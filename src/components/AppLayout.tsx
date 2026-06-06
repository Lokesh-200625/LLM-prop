"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Atom } from 'lucide-react';
import { SettingsMenu } from './SettingsMenu';
import { Button } from './ui/button';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const displayName = session?.user?.name || session?.user?.email?.split('@')[0];
  const userInitial = displayName ? displayName.charAt(0).toUpperCase() : undefined;
  const isAuthLoading = status === 'loading';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Atom className="size-6 text-white" />
              </div>
              <span className="font-semibold text-lg">LLM-Prop</span>
            </Link>

            <div className="flex items-center gap-2">
              <Link href="/">
                <Button
                  variant={pathname === '/' ? 'secondary' : 'ghost'}
                  size="sm"
                >
                  Predict
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant={pathname === '/about' ? 'secondary' : 'ghost'}
                  size="sm"
                >
                  About
                </Button>
              </Link>

              {displayName ? (
                <div className="hidden max-w-60 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground md:flex animate-in fade-in duration-300">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-xs font-semibold text-black">
                    {userInitial}
                  </div>
                  <span className="truncate">{displayName}</span>
                </div>
              ) : isAuthLoading ? (
                <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted animate-pulse" />
                  <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                </div>
              ) : (
                  <Button
                    size="sm"
                    className="bg-yellow-500 text-black hover:bg-yellow-400"
                    onClick={() => {
                      router.push('/login');
                    }}
                  >
                    Sign In / Sign Up
                  </Button>
              )}
              <div className="ml-2">
                <SettingsMenu />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}
    </div>
  );
}
