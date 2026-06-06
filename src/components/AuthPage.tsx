"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Atom, Github, Lock, Mail, User } from "lucide-react";

import { signInWithProvider } from "@/services/auth/authService";

type AuthPageProps = {
  mode: "login" | "signup";
  error?: string;
};

export function AuthPage({ mode, error: authError }: AuthPageProps) {
  const isSignup = mode === "signup";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Simulate a sign-in with Google even if they submit the fake form
    void signInWithProvider("google");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.08),transparent_30%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_60%)]" />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-8">
        <Link
          className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition hover:border-yellow-500/40 hover:text-foreground"
          href="/"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>

        <section className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[560px] rounded-[2rem] border border-border bg-card/80 p-8 shadow-2xl backdrop-blur-xl md:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-500 text-black shadow-[0_0_45px_rgba(250,204,21,0.25)]">
                <Atom className="size-10" />
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground">
                {isSignup ? "Create your workspace" : "Welcome back"}
              </h1>
              <p className="mt-3 max-w-[420px] text-sm leading-6 text-muted-foreground">
                {isSignup
                  ? "Start saving AI material predictions to your account."
                  : "Sign in to access your prediction history."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              {authError ? (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {authError === "AccessDenied"
                    ? "Sign-in was denied. Make sure your provider account has a public email."
                    : "Sign-in failed. Please try again."}
                </div>
              ) : null}

              {isSignup && (
                <div className="space-y-2 rounded-3xl border border-border bg-muted/50 px-4 py-4">
                  <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Full name
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-3 py-3">
                    <User className="size-4 text-muted-foreground" />
                    <input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                      placeholder="Your name"
                      type="text"
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 rounded-3xl border border-border bg-muted/50 px-4 py-4">
                <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Email
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-3 py-3">
                  <Mail className="size-4 text-muted-foreground" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2 rounded-3xl border border-border bg-muted/50 px-4 py-4">
                <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-3 py-3">
                  <Lock className="size-4 text-muted-foreground" />
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    placeholder={isSignup ? "Create your password" : "Your password"}
                    type="password"
                    autoComplete={isSignup ? "new-password" : "current-password"}
                  />
                </div>
              </div>

              {isSignup && (
                <div className="space-y-2 rounded-3xl border border-border bg-muted/50 px-4 py-4">
                  <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Confirm password
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-3 py-3">
                    <Lock className="size-4 text-muted-foreground" />
                    <input
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                      placeholder="Confirm password"
                      type="password"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-3xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
              >
                {isSignup ? "Sign up" : "Sign in"}
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-border"></div>
                <span className="shrink-0 px-4 text-xs text-muted-foreground">OR</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              <button
                type="button"
                onClick={() => void signInWithProvider("google")}
                className="w-full rounded-3xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-yellow-500/40 hover:bg-accent"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                  Sign in with Google
                </span>
              </button>

              <button
                type="button"
                onClick={() => void signInWithProvider("github")}
                className="w-full rounded-3xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-yellow-500/40 hover:bg-accent"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Github className="size-4" />
                  Sign in with GitHub
                </span>
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              By continuing, you agree to our Terms of Service.
            </p>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {isSignup ? "Already have an account?" : "New to LLM-Prop?"}{" "}
              <Link
                className="font-semibold text-yellow-500 transition hover:text-yellow-400"
                href={isSignup ? "/login" : "/signup"}
              >
                {isSignup ? "Sign in" : "Create workspace"}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
