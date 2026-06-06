import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/serverAuth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { user, response } = await requireCurrentUser();
  if (response) return response;

  const { id } = await context.params;

  const prediction = await prisma.predictionHistory.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: { id: true },
  });

  if (!prediction) {
    return NextResponse.json({ error: "Prediction not found." }, { status: 404 });
  }

  await prisma.predictionHistory.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
