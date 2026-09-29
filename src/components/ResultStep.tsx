import { CheckCircle2, Download, FileSpreadsheet, ArrowRightLeft } from "lucide-react";
import { CleanResult } from "@/lib/api";

interface ResultStepProps {
  cleanResult: CleanResult;
  removedRows: number;
  removalPercent: number;
  onDownload: () => void;
  onGoToMatch: () => void;
  onReset: () => void;
}

export function ResultStep({
  cleanResult,
  removedRows,
  removalPercent,
  onDownload,
  onGoToMatch,
  onReset,
}: ResultStepProps) {
  return (
    <div className="animate-slide-up max-w-2xl mx-auto text-center">
      <div className="w-20 h-20 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-success" />
      </div>

      <h2 className="font-display text-4xl font-700 text-ink mb-2">
        Data berhasil dibersihkan!
      </h2>
      <p className="font-body text-muted mb-10">File siap untuk diunduh</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 text-left">
        {[
          { label: "Sebelum", value: cleanResult.originalRows.toLocaleString(), sub: "baris", color: "text-ink" },
          { label: "Sesudah", value: cleanResult.finalRows.toLocaleString(), sub: "baris", color: "text-success" },
          { label: "Dihapus", value: removedRows.toLocaleString(), sub: `${removalPercent}% dari total`, color: "text-accent" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-cream border border-border rounded-xl p-4">
            <p className="font-mono text-xs text-muted uppercase tracking-wide mb-1">{label}</p>
            <p className={`font-display text-2xl font-700 ${color}`}>{value}</p>
            <p className="font-body text-xs text-muted mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Steps log */}
      {cleanResult.stepsLog.length > 0 && (
        <div className="bg-ink rounded-xl p-5 mb-8 text-left">
          <p className="font-display font-600 text-paper text-xs uppercase tracking-wider mb-3">
            Log Proses
          </p>
          <ul className="space-y-1.5">
            {cleanResult.stepsLog.map((log, i) => (
              <li key={i} className="flex items-start gap-2.5 font-mono text-xs text-paper/70">
                <span className="text-accent mt-0.5">›</span>
                {log}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={onDownload}
          className="flex items-center gap-2.5 px-8 py-3.5 bg-ink text-paper rounded-xl font-display font-600 text-sm hover:bg-accent transition-all"
        >
          <Download className="w-4 h-4" />
          Unduh {cleanResult.filename}
        </button>
        <button
          onClick={onGoToMatch}
          className="flex items-center gap-2.5 px-6 py-3.5 bg-cream border border-border rounded-xl font-display font-600 text-sm text-ink hover:border-ink transition-all"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Lanjut ke Pencocokan Mutasi
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