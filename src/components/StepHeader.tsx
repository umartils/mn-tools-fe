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

export function StepHeader({ step }: StepHeaderProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted font-body">
      {STEPS.map(({ label, id }, i) => {
        const active = step === id;
        const done =
          (step === "configure" && i === 0) ||
          (step === "result" && i < 2);

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