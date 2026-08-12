import { Upload, AlertCircle, Loader2, Tag } from "lucide-react";

interface SortFormProps {
  file: File | null;
  isDragging: boolean;
  isSubmitting: boolean;
  error: string | null;
  canSubmit: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  colKeterangan: string;
  setColKeterangan: (v: string) => void;
  colNominal: string;
  setColNominal: (v: string) => void;
  colProgram: string;
  setColProgram: (v: string) => void;
  csvDelimiter: string;
  setCsvDelimiter: (v: string) => void;
  csvHeaderRow: number;
  setCsvHeaderRow: (v: number) => void;
  onFile: (f: File) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: () => void;
  onDragLeave: () => void;
  onSubmit: () => void;
}

export function SortForm({
  file,
  isDragging,
  isSubmitting,
  error,
  canSubmit,
  fileInputRef,
  colKeterangan,
  setColKeterangan,
  colNominal,
  setColNominal,
  colProgram,
  setColProgram,
  csvDelimiter,
  setCsvDelimiter,
  csvHeaderRow,
  setCsvHeaderRow,
  onFile,
  onDrop,
  onDragOver,
  onDragLeave,
  onSubmit,
}: SortFormProps) {
  return (
    <div className="animate-slide-up">
      <div className="mb-10">
        <h1 className="font-display text-5xl font-800 text-ink leading-tight mb-3">
          Klasifikasi donasi,
          <br />
          <span className="text-accent">otomatis per kategori.</span>
        </h1>
        <p className="font-body text-muted text-lg max-w-md">
          Upload data transaksi, sistem akan mengklasifikasikan data berdasarkan keterangan &
          nominal — hasilnya file Excel dengan sheet per kategori.
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
        <div className="py-14 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-ink/5 border border-border flex items-center justify-center">
            <Upload className="w-7 h-7 text-ink/50" />
          </div>
          <div className="text-center">
            <p className="font-display font-600 text-xl text-ink mb-1">
              {file ? file.name : isDragging ? "Lepaskan file di sini" : "Drag & drop file"}
            </p>
            {!file && (
              <p className="font-body text-muted text-sm">
                atau{" "}
                <span className="text-accent font-medium underline underline-offset-2">
                  klik untuk browse
                </span>
              </p>
            )}
            <p className="font-mono text-xs text-border mt-3">CSV · XLSX · XLS</p>
          </div>
        </div>
      </div>

      {/* Konfigurasi kolom */}
      <div className="mt-8 p-5 bg-cream border border-border rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-muted" />
          <span className="font-display font-600 text-sm text-ink">
            Nama kolom di file kamu
          </span>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Kolom Keterangan" value={colKeterangan} onChange={setColKeterangan} />
          <Field label="Kolom Nominal" value={colNominal} onChange={setColNominal} />
          <Field label="Kolom Program" value={colProgram} onChange={setColProgram} />
        </div>

        {file?.name.toLowerCase().endsWith(".csv") && (
          <div className="grid sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-border">
            <Field label="Delimiter CSV" value={csvDelimiter} onChange={setCsvDelimiter} />
            <div>
              <label className="font-body text-xs text-muted mb-1 block">
                Baris header (0 = baris pertama)
              </label>
              <input
                type="number"
                min={0}
                value={csvHeaderRow}
                onChange={(e) => setCsvHeaderRow(Number(e.target.value))}
                className="w-full px-3 py-2 bg-paper border border-border rounded-lg font-mono text-sm text-ink focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="font-body text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="mt-6 w-full sm:w-auto px-6 py-3 bg-ink text-paper font-display font-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-ink/90 transition-colors"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Memproses...
          </>
        ) : (
          "Klasifikasikan"
        )}
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="font-body text-xs text-muted mb-1 block">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-paper border border-border rounded-lg font-mono text-sm text-ink focus:outline-none focus:border-accent"
      />
    </div>
  );
}
