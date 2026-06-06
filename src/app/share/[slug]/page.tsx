import { notFound } from "next/navigation";

import { PredictionResultCard } from "@/components/PredictionResultCard";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/serverAuth";
import { prisma } from "@/lib/prisma";
import { SharePageActions } from "./SharePageActions";

type SharePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SharePage({ params }: SharePageProps) {
  const { slug } = await params;
  const [prediction, currentUser] = await Promise.all([
    prisma.predictionHistory.findUnique({
      where: { id: slug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    getCurrentUser(),
  ]);

  if (!prediction) {
    notFound();
  }

  const result = prediction.result as {
    band_gap_ev?: number;
    confidence?: number;
    label?: string;
    properties?: any;
  };

  const canDelete = currentUser?.id === prediction.userId;

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Shared Prediction</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Created {prediction.createdAt.toLocaleString()}
            {prediction.user?.name || prediction.user?.email ? ` by ${prediction.user.name ?? prediction.user.email}` : ""}
          </p>
        </div>
        <SharePageActions slug={slug} canDelete={canDelete} />
      </div>

      <PredictionResultCard
        predictionId={prediction.id}
        materialInput={prediction.prompt}
        timestamp={prediction.createdAt}
        saved
        properties={
          result.properties ?? {
            band_gap: {
              value: result.band_gap_ev ?? 0,
              unit: "eV",
              confidence: result.confidence,
            },
          }
        }
      />

      <Card className="mt-6 p-6 border-border bg-card">
        <h2 className="font-semibold">Prediction metadata</h2>
        <dl className="mt-4 grid gap-4 text-sm md:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Model</dt>
            <dd className="mt-1 font-medium">bandgap</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Prediction time</dt>
            <dd className="mt-1 font-medium">{prediction.createdAt.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Prediction ID</dt>
            <dd className="mt-1 font-mono text-xs">{slug}</dd>
          </div>
        </dl>
      </Card>
    </main>
  );
}
