import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { NavLinks } from "@/components/NavLinks";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PY Study Companion",
  description:
    "Flashcards and quizzes for the Professional Year, with weak-topic tracking.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <header className="border-b border-line bg-surface">
          <div className="mx-auto flex min-h-16 max-w-[1040px] flex-wrap items-center justify-between gap-3 px-6 py-2">
            <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-[-0.01em]">
              <span className="flex size-7 items-center justify-center rounded-lg bg-accent">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
                  <path d="M8 7h7" />
                </svg>
              </span>
              PY Study Companion
            </Link>
            <NavLinks />
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1040px] flex-1 px-6 pt-6 pb-16">{children}</main>
        <footer className="mx-auto w-full max-w-[1040px] px-6 py-6 text-xs text-muted">
          A personal study aid. Not financial advice and not an official ASIC resource.
        </footer>
      </body>
    </html>
  );
}
