import { Exercise } from "@/lib/types";

export function ExerciseTable({ exercises }: { exercises: Exercise[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
            <th className="text-left py-2 pr-2">Exercise</th>
            <th className="text-center py-2 px-2">Sets</th>
            <th className="text-center py-2 px-2">Reps</th>
            <th className="text-center py-2 px-2">Load</th>
            <th className="text-center py-2 px-2">Rest</th>
            <th className="text-center py-2 pl-2">RPE</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, i) => (
            <tr
              key={i}
              className={`border-b border-zinc-800/50 ${
                ex.is_warmup_set ? "text-zinc-600 italic" : "text-zinc-200"
              }`}
            >
              <td className="py-2.5 pr-2">
                <div>
                  <span className="font-medium">{ex.name}</span>
                  {ex.target_area && (
                    <span className="text-zinc-600 text-xs ml-1">
                      ({ex.target_area})
                    </span>
                  )}
                </div>
                {ex.notes && (
                  <p className="text-zinc-500 text-xs mt-0.5">{ex.notes}</p>
                )}
              </td>
              <td className="text-center py-2.5 px-2 font-mono">{ex.sets}</td>
              <td className="text-center py-2.5 px-2 font-mono">
                {ex.reps || "—"}
              </td>
              <td className="text-center py-2.5 px-2 font-mono text-xs">
                {ex.load || "BW"}
              </td>
              <td className="text-center py-2.5 px-2 font-mono text-xs">
                {ex.rest_seconds ? `${ex.rest_seconds}s` : "—"}
              </td>
              <td className="text-center py-2.5 pl-2 font-mono">
                {ex.rpe_target || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
