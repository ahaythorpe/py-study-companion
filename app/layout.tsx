import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import { NavLinks } from "@/components/NavLinks";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const serif = Source_Serif_4({
  variable: "--font-serif-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PY Study Companion",
  description:
    "Study tools for the Professional Year with weak-topic tracking.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} h-full antialiased`}>
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
              <span className="leading-tight">
                PY Study Companion
                <span className="block text-xs font-normal tracking-normal text-muted">
                  Independent exam and Professional Year study tool
                </span>
              </span>
            </Link>
            <NavLinks />
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1040px] flex-1 px-6 pt-6 pb-16">{children}</main>
        <footer className="border-t border-line bg-surface">
          <div className="mx-auto max-w-[1040px] space-y-1 px-6 py-6 text-xs leading-relaxed text-muted">
            <p className="font-medium text-foreground">Independent study tool</p>
            <p>
              Not affiliated with or endorsed by ASIC or ACER or any AFS licensee. Not financial advice. Content
              is checked against primary sources but the law changes. Confirm against the current legislation and
              ASIC guidance before relying on it.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
