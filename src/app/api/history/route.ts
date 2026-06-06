import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/serverAuth";
import { historyQuerySchema, zodErrorMessage } from "@/lib/validation";
import { Prisma } from "@prisma/client";

type PredictionRow = {
  id: string;
  prompt: string;
  result: {
    band_gap_ev?: number;
    [key: string]: unknown;
  };
  createdAt: Date;
};

export async function GET(request: Request) {
  const { user, response } = await requireCurrentUser();
  if (response) return response;

  try {
    const url = new URL(request.url);
    const parsed = historyQuerySchema.safeParse(Object.fromEntries(url.searchParams));

    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
    }

    const { q, page, limit } = parsed.data;
    const where: Prisma.PredictionHistoryWhereInput = {
      userId: user.id,
      ...(q ? { prompt: { contains: q, mode: "insensitive" } } : {}),
    };

    const predictions = await prisma.predictionHistory.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        prompt: true,
        result: true,
        createdAt: true,
        _count: {
          select: { sharedPredictions: true },
        },
      },
    });
    const total = await prisma.predictionHistory.count({ where });

    const history = (predictions as (PredictionRow & { _count: { sharedPredictions: number } })[]).map((p) => ({
      id: p.id,
      user_email: user.email,
      input_text: p.prompt,
      output: p.result,
      created_at: p.createdAt,
      shared_count: p._count.sharedPredictions,
    }));

    return NextResponse.json({
      history,
      pagination: {
        page,
        limit,
        total,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
