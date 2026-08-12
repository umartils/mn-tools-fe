import { CheckCircle2, Download, FileSpreadsheet } from "lucide-react";
import { SortResult } from "@/lib/sortApi";

interface SortResultStepProps {
  result: SortResult;
  onDownload: () => void;
  onReset: () => void;
}

export function SortResultStep({ result, onDownload, onReset }: SortResultStepProps) {
  return (
    <div className="animate-slide-up max-w-2xl mx-auto text-center">
      <div className="w-20 h-20 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-success" />
      </div>

      <h2 className="font-display text-4xl font-700 text-ink mb-2">
        Data berhasil diklasifikasi!
      </h2>
      <p className="font-body text-muted mb-10">
        File Excel dengan sheet per kategori siap diunduh
      </p>

      <div className="flex gap-3 justify-center">
        <button
          onClick={onDownload}
          className="flex items-center gap-2.5 px-8 py-3.5 bg-ink text-paper rounded-xl font-display font-600 text-sm hover:bg-accent transition-all"
        >
          <Download className="w-4 h-4" />
          Unduh {result.filename}
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
