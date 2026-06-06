import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { predictionRequestSchema, zodErrorMessage } from "@/lib/validation";

const WORKER_API_URL = process.env.WORKER_API_URL ?? "http://localhost:8000";
const PREDICTION_TIMEOUT_MS = Number(process.env.PREDICTION_TIMEOUT_MS ?? 30000);

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    if (
      typeof body === "object" &&
      body !== null &&
      !("input" in body) &&
      "input_text" in body
    ) {
      body = {
        ...body,
        input: (body as { input_text: unknown }).input_text,
      };
    }

    const parsed = predictionRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
    }

    const { model, input: inputText } = parsed.data;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PREDICTION_TIMEOUT_MS);

    const fastApiResponse = await fetch(`${WORKER_API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, input: inputText }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    let data: unknown;
    try {
      data = await fastApiResponse.json();
    } catch (parseError) {
      const text = await fastApiResponse.text();
      return NextResponse.json(
        { error: "FastAPI response was not valid JSON.", details: text },
        { status: fastApiResponse.ok ? 500 : fastApiResponse.status },
      );
    }

    if (!fastApiResponse.ok) {
      return NextResponse.json(data, { status: fastApiResponse.status });
    }

    const label = typeof (data as any).prediction === "string"
      ? (data as any).prediction
      : String((data as any).prediction ?? "Unknown");
    const bandGap = typeof (data as any).band_gap === "number"
      ? (data as any).band_gap
      : (data as any).properties?.band_gap?.value !== undefined
      ? (data as any).properties.band_gap.value
      : typeof (data as any).prediction === "number"
      ? (data as any).prediction
      : null;

    if (bandGap === null || Number.isNaN(bandGap)) {
      return NextResponse.json({ error: "Invalid band_gap value from FastAPI." }, { status: 500 });
    }

    const confidence = typeof (data as any).properties?.band_gap?.confidence === "number"
      ? (data as any).properties.band_gap.confidence
      : typeof (data as any).confidence === "number"
      ? (data as any).confidence
      : null;

    const metadata = typeof (data as any).metadata === "object" && (data as any).metadata !== null
      ? (data as any).metadata
      : undefined;

    const output = {
      label,
      band_gap_ev: bandGap,
      confidence,
      source: "fastapi",
      properties: (data as any).properties,
      ...(metadata ? { metadata } : {}),
    } as const;

    let predictionId: string | null = null;

    if (userEmail) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: userEmail },
        });

        if (user) {
          const prediction = await prisma.predictionHistory.create({
            data: {
              prompt: inputText,
              result: output,
              userId: user.id,
            },
          });
          predictionId = prediction.id;
        }
      } catch (dbError) {
        console.error("Database error saving prediction:", dbError);
        // Don't fail the request if we can't save to database
        // The prediction is still returned to the user
      }
    }

    return NextResponse.json({ output, predictionId });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Prediction timed out. Please try again." },
        { status: 504 },
      );
    }

    console.error("Prediction route error:", error);
    return NextResponse.json(
      { error: "Prediction failed. The worker may be offline." },
      { status: 500 },
    );
  }
}
