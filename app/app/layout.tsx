import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { ProgressBar } from "@/components/ProgressBar";

export const metadata: Metadata = {
  title: "Saral — file your first tax return",
  description:
    "An interview-led way to file an Indian income-tax return for the first time. We explain every question before we ask it.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14532d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto min-h-dvh max-w-lg px-4 pb-28 pt-5">
          <Link
            href="/"
            className="mb-6 inline-flex items-baseline gap-2 text-[15px] font-extrabold tracking-tight text-brand"
          >
            सरल
            <span className="text-ink-faint font-semibold">Saral</span>
          </Link>
          {children}
        </div>
        <ProgressBar />
      </body>
    </html>
  );
}
