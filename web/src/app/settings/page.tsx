import { DEFAULT_BASELINE } from "@/lib/readiness";

export default function SettingsPage() {
  return (
    <div className="py-8 space-y-7 max-w-2xl mx-auto lg:pl-16">
      <div>
        <h1 className="text-[28px] font-semibold text-cream-900 tracking-tight">Settings</h1>
        <p className="text-sm text-cream-600 mt-1 font-light">Your profile and how the system works.</p>
      </div>

      {/* Baseline */}
      <div className="bg-white border border-cream-300/50 rounded-2xl p-5 space-y-4 card-soft">
        <h3 className="text-[10px] font-medium text-cream-600 uppercase tracking-widest">Your Baseline</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "HRV Mean", value: `${DEFAULT_BASELINE.hrv_mean} ms` },
            { label: "HRV SD", value: `${DEFAULT_BASELINE.hrv_sd} ms` },
            { label: "RHR Avg", value: `${DEFAULT_BASELINE.rhr_7day_avg} bpm` },
            { label: "Data Points", value: `${DEFAULT_BASELINE.data_points}` },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-cream-500 text-[11px] font-light">{item.label}</p>
              <p className="text-cream-900 font-mono text-sm mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-cream-500 font-light">
          Updates automatically from your rolling 14-day data.
        </p>
      </div>

      {/* Profile */}
      <div className="bg-white border border-cream-300/50 rounded-2xl p-5 space-y-3 card-soft">
        <h3 className="text-[10px] font-medium text-cream-600 uppercase tracking-widest">Profile</h3>
        <div className="space-y-3">
          {[
            { label: "OC", value: "Tyblume (combined)" },
            { label: "Focus", value: "Body Recomposition" },
            { label: "Locations", value: "Home + Planet Fitness" },
            { label: "Calibration", value: "Low (8 sessions)", color: "text-amber-600" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center">
              <span className="text-cream-600 text-sm font-light">{row.label}</span>
              <span className={`text-sm ${row.color || "text-cream-900"}`}>{row.value}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-cream-500 font-light pt-1">
          15+ sessions = high confidence. The system gets smarter every time you log.
        </p>
      </div>

      {/* How it works */}
      <div className="bg-white border border-cream-300/50 rounded-2xl p-5 space-y-4 card-soft">
        <h3 className="text-[10px] font-medium text-cream-600 uppercase tracking-widest">How It Works</h3>
        <div className="space-y-4">
          {[
            { step: "01", title: "Check in", desc: "morning HRV, RHR, sleep, symptoms" },
            { step: "02", title: "Readiness", desc: "lowest signal sets training ceiling" },
            { step: "03", title: "Session", desc: "exercises adapt to readiness + history" },
            { step: "04", title: "Reflect", desc: "your feedback calibrates future sessions" },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start">
              <span className="text-terra font-mono text-xs mt-0.5">{item.step}</span>
              <div>
                <p className="text-cream-900 text-sm font-medium">{item.title}</p>
                <p className="text-cream-600 text-xs font-light mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
