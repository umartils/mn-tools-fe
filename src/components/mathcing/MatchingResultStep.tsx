import { CheckCircle2, Download, FileSpreadsheet } from "lucide-react";
import { MatchResult } from "@/lib/matchingApi";

interface MatchResultStepProps {
  matchResult: MatchResult;
  onDownload: () => void;
  onReset: () => void;
}

export function MatchResultStep({ matchResult, onDownload, onReset }: MatchResultStepProps) {
  const total = matchResult.matchedCount + matchResult.unmatchedCount;
  const matchedPercent = total > 0 ? Math.round((matchResult.matchedCount / total) * 100) : 0;

  return (
    <div className="animate-slide-up max-w-2xl mx-auto text-center">
      <div className="w-20 h-20 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-success" />
      </div>

      <h2 className="font-display text-4xl font-700 text-ink mb-2">Pencocokan selesai!</h2>
      <p className="font-body text-muted mb-10">
        File Excel 3 sheet (Data Hasil Cleaning, Cocok, Tidak Cocok) siap diunduh
      </p>

      <div className="grid grid-cols-3 gap-4 mb-10 text-left">
        {[
          { label: "Total", value: total.toLocaleString(), sub: "baris", color: "text-ink" },
          {
            label: "Cocok",
            value: matchResult.matchedCount.toLocaleString(),
            sub: `${matchedPercent}% dari total`,
            color: "text-success",
          },
          {
            label: "Tidak Cocok",
            value: matchResult.unmatchedCount.toLocaleString(),
            sub: `${total > 0 ? 100 - matchedPercent : 0}% dari total`,
            color: "text-accent",
          },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-cream border border-border rounded-xl p-4">
            <p className="font-mono text-xs text-muted uppercase tracking-wide mb-1">{label}</p>
            <p className={`font-display text-2xl font-700 ${color}`}>{value}</p>
            <p className="font-body text-xs text-muted mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={onDownload}
          className="flex items-center gap-2.5 px-8 py-3.5 bg-ink text-paper rounded-xl font-display font-600 text-sm hover:bg-accent transition-all"
        >
          <Download className="w-4 h-4" />
          Unduh {matchResult.filename}
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2.5 px-6 py-3.5 bg-cream border border-border rounded-xl font-display font-600 text-sm text-ink hover:border-ink transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" />
          File Baru
        </button>
      </div>
    </div>
  );
}