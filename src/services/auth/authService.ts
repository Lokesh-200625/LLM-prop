import { signIn, signOut } from "next-auth/react";

import type { AuthProvider } from "@/types/auth";

export function signInWithProvider(provider: AuthProvider) {
  return signIn(provider, { callbackUrl: "/" });
}

export function signOutUser() {
  return signOut({ callbackUrl: "/" });
}
