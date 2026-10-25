"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Study" },
  { href: "/training", label: "PY training" },
  { href: "/reading", label: "Reading log" },
  { href: "/resources", label: "Resources" },
];

export function NavLinks() {
  const pathname = usePathname();
  // Quiz and card pages belong to Study.
  const active = (href: string) =>
    href === "/" ? !LINKS.some((l) => l.href !== "/" && pathname.startsWith(l.href)) : pathname.startsWith(href);

  return (
    <nav aria-label="Main" className="flex flex-wrap gap-1">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={active(link.href) ? "page" : undefined}
          className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-foreground aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
