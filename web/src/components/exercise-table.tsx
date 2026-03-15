import { Exercise } from "@/lib/types";

export function ExerciseTable({ exercises }: { exercises: Exercise[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-cream-500 text-[10px] uppercase tracking-widest border-b border-cream-200">
            <th className="text-left py-2 pr-2 font-medium">Exercise</th>
            <th className="text-center py-2 px-2 font-medium">Sets</th>
            <th className="text-center py-2 px-2 font-medium">Reps</th>
            <th className="text-center py-2 px-2 font-medium">Load</th>
            <th className="text-center py-2 px-2 font-medium">Rest</th>
            <th className="text-center py-2 pl-2 font-medium">RPE</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, i) => (
            <tr
              key={i}
              className={`border-b border-cream-200/60 ${
                ex.is_warmup_set ? "text-cream-500 italic" : "text-cream-800"
              }`}
            >
              <td className="py-3 pr-2">
                <div>
                  <span className="font-medium text-cream-900">{ex.name}</span>
                  {ex.target_area && (
                    <span className="text-cream-500 text-[11px] ml-1.5 font-light">
                      {ex.target_area}
                    </span>
                  )}
                </div>
                {ex.notes && (
                  <p className="text-cream-500 text-[11px] mt-0.5 font-light">{ex.notes}</p>
                )}
              </td>
              <td className="text-center py-3 px-2 font-mono text-xs">{ex.sets}</td>
              <td className="text-center py-3 px-2 font-mono text-xs">
                {ex.reps || "—"}
              </td>
              <td className="text-center py-3 px-2 font-mono text-[11px] text-cream-600">
                {ex.load || "BW"}
              </td>
              <td className="text-center py-3 px-2 font-mono text-[11px] text-cream-500">
                {ex.rest_seconds ? `${ex.rest_seconds}s` : "—"}
              </td>
              <td className="text-center py-3 pl-2 font-mono text-xs">
                {ex.rpe_target || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
