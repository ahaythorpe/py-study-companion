import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PY Study Companion",
  description:
    "Flashcards and quizzes for the Professional Year, with weak-topic tracking.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <header className="border-b border-line">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4">
            <Link href="/" className="font-semibold tracking-tight">
              PY Study Companion
            </Link>
            <nav className="flex gap-4 text-sm text-muted">
              <Link href="/" className="hover:text-accent">
                Study
              </Link>
              <Link href="/training" className="hover:text-accent">
                PY training
              </Link>
              <Link href="/reading" className="hover:text-accent">
                Reading log
              </Link>
              <Link href="/resources" className="hover:text-accent">
                Resources
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
        <footer className="mx-auto w-full max-w-3xl px-4 py-6 text-xs text-muted">
          A personal study aid. Not financial advice and not an official ASIC resource.
        </footer>
      </body>
    </html>
  );
}
