import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isStaleSessionCookieError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const message = "message" in error && typeof error.message === "string" ? error.message : "";
  const name = "name" in error && typeof error.name === "string" ? error.name : "";

  return (
    name === "JWTSessionError" ||
    message.includes("JWT_SESSION_ERROR") ||
    message.includes("decryption operation failed")
  );
}

export async function getCurrentUser() {
  let session;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    if (isStaleSessionCookieError(error)) {
      return null;
    }

    throw error;
  }

  const email = session?.user?.email?.trim().toLowerCase();

  if (!email) {
    return null;
  }

  return prisma.user.findUnique({
    where: { email },
  });
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user, response: null };
}
