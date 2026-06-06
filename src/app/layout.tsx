import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "LLM-Prop – AI Materials Platform",
  description: "LLM-Prop is an AI platform for predicting material properties.",
};

type RootLayoutProps = {
  children: ReactNode;
};

import { AppLayout } from "../components/AppLayout";

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
