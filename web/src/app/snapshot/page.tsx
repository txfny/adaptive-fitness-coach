import { SnapshotForm } from "@/components/snapshot-form";
import { FaceProfile } from "@/components/line-art";

export default function SnapshotPage() {
  return (
    <div className="py-6 max-w-2xl mx-auto lg:pl-16">
      <div className="mb-6">
        <p className="text-xs text-sage-dark font-semibold uppercase tracking-wider">Step 1</p>
        <div className="flex items-center gap-2 mt-1">
          <h1 className="text-2xl font-bold text-cream-900">Check In</h1>
          <FaceProfile size={24} color="#C08B6F" />
        </div>
        <p className="text-sm text-cream-600 mt-1 font-light">
          How&apos;s your body feeling today?
        </p>
      </div>
      <SnapshotForm />
    </div>
  );
}
