import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Your topics</h1>
        <p className="text-muted">
          Topics under 70% accuracy (after 5 attempts) are flagged weak. Missed questions come
          back first.
        </p>
      </div>
      <Dashboard />
    </div>
  );
}
