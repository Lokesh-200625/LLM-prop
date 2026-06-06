import { prisma } from "./prisma";

export async function saveUser(email: string) {
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return user;
  } catch (error) {
    throw new Error(
      `Failed to save user: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    throw new Error(
      `Failed to fetch user: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        predictions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (error) {
    throw new Error(
      `Failed to fetch user: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
