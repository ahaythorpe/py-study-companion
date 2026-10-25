import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 py-12 text-center">
      <h1 className="text-[32px] font-bold leading-tight tracking-[-0.02em]">Topic not found</h1>
      <Link href="/" className="text-accent hover:underline">
        Back to the dashboard
      </Link>
    </div>
  );
}
