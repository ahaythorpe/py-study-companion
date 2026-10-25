// Shared class names so every page follows the same design.

export const field =
  "w-full rounded-[10px] border border-line-strong bg-surface px-3 py-2.5 text-sm focus:border-accent focus:outline-none";

const btn =
  "inline-flex h-11 min-w-[88px] items-center justify-center rounded-[10px] px-[18px] text-sm transition-opacity";

export const btnPrimary = `${btn} border border-accent bg-accent font-semibold text-white hover:opacity-90`;

export const btnGhost = `${btn} border border-line-strong bg-surface font-medium text-foreground hover:border-accent`;

export const btnDisabled = `${btn} cursor-not-allowed border border-line bg-background font-medium text-[#6b7280]`;

export const panel = "rounded-[14px] border border-line bg-surface";

export const h1 = "text-[32px] font-bold leading-tight tracking-[-0.02em]";

export const intro = "max-w-[520px] text-[15px] leading-[1.55] text-muted";
