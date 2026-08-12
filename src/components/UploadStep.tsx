import { useRef } from "react";
import { Upload, Trash2, Filter, BarChart3, AlertCircle, Loader2 } from "lucide-react";

interface UploadStepProps {
  isDragging: boolean;
  isAnalyzing: boolean;
  error: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFile: (f: File) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: () => void;
  onDragLeave: () => void;
}

const FEATURE_PILLS = [
  { icon: Trash2, label: "Hapus Duplikat" },
  { icon: Filter, label: "Filter Kategori" },
  { icon: BarChart3, label: "Preview Data" },
];

export function UploadStep({
  isDragging,
  isAnalyzing,
  error,
  fileInputRef,
  onFile,
  onDrop,
  onDragOver,
  onDragLeave,
}: UploadStepProps) {
    // console.log(error);
  return (
    <div className="animate-slide-up">
      <div className="mb-10">
        <h1 className="font-display text-5xl font-800 text-ink leading-tight mb-3">
          Bersihkan data<br />
          <span className="text-accent">tanpa ribet.</span>
        </h1>
        <p className="font-body text-muted text-lg max-w-md">
          Upload file CSV atau Excel, pilih operasi pembersihan, dan unduh
          hasilnya dalam hitungan detik.
        </p>
      </div>

      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer ${
          isDragging
            ? "border-accent bg-accent/5 scale-[1.01]"
            : "border-border hover:border-ink bg-cream"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver();
        }}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        <div className="py-20 flex flex-col items-center gap-4">
          {isAnalyzing ? (
            <>
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
              <p className="font-display font-600 text-lg text-ink">Menganalisis file...</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-ink/5 border border-border flex items-center justify-center">
                <Upload className="w-7 h-7 text-ink/50" />
              </div>
              <div className="text-center">
                <p className="font-display font-600 text-xl text-ink mb-1">
                  {isDragging ? "Lepaskan file di sini" : "Drag & drop file"}
                </p>
                <p className="font-body text-muted text-sm">
                  atau{" "}
                  <span className="text-accent font-medium underline underline-offset-2">
                    klik untuk browse
                  </span>
                </p>
                <p className="font-mono text-xs text-border mt-3">CSV · XLSX · XLS</p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="font-body text-sm">{error}</p>
        </div>
      )}

      {/* Feature pills */}
      <div className="mt-8 flex gap-3 flex-wrap">
        {FEATURE_PILLS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-4 py-2 bg-cream border border-border rounded-full text-sm font-body text-muted"
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}