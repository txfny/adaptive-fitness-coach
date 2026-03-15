import { SnapshotForm } from "@/components/snapshot-form";

export default function SnapshotPage() {
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">Daily Snapshot</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Enter your numbers. System computes readiness.
        </p>
      </div>
      <SnapshotForm />
    </div>
  );
}
