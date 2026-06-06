import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  logger: {
    error(code, metadata) {
      if (code === "JWT_SESSION_ERROR") {
        return;
      }
      console.error(`[next-auth][${code}]`, metadata);
    },
  },
  callbacks: {
    async signIn({ user }) {
      const email = user?.email?.trim().toLowerCase();
      console.log("SIGNIN EMAIL:", email);

      if (!email) {
        console.error("SIGNIN ERROR: missing email");
        return false;
      }

      try {
        // Upsert user in database
        await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name: user.name,
            image: user.image,
          },
        });
      } catch (error) {
        console.error("SAVE USER ERROR:", error);
        return false;
      }

      return true;
    },
    async session({ session, token }) {
      if (session?.user && typeof token.userId === "string") {
        session.user.id = token.userId;
      }
      return session;
    },
    async jwt({ token }) {
      const email = token.email?.trim().toLowerCase();
      if (email) {
        const dbUser = await prisma.user.findUnique({
          where: { email },
          select: { id: true },
        });
        if (dbUser) {
          token.userId = dbUser.id;
        }
      }
      return token;
    },
  },
};
