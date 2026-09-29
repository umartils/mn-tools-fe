import { ChevronRight } from "lucide-react";
import { Step } from "@/hooks/useCleanFlow";

interface StepHeaderProps {
  step: Step;
}

const STEPS: { label: string; id: Step }[] = [
  { label: "Upload", id: "upload" },
  { label: "Konfigurasi", id: "configure" },
  { label: "Hasil", id: "result" },
];

const STEP_ORDER: Step[] = ["upload", "configure", "result", "match", "matchResult"];

export function StepHeader({ step }: StepHeaderProps) {
  const currentIndex = STEP_ORDER.indexOf(step);

  return (
    <div className="flex items-center gap-2 text-sm text-muted font-body">
      {STEPS.map(({ label, id }, i) => {
        const active = step === id;
        const done = currentIndex > i;

        return (
          <div key={id} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="w-3 h-3 text-border" />}
            <span
              className={`font-medium transition-colors ${
                active ? "text-accent" : done ? "text-ink" : "text-border"
              }`}
            >
              {done && !active ? "✓ " : ""}
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}