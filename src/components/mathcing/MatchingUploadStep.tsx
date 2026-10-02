import { Upload, AlertCircle, Loader2, ArrowLeft, Columns3 } from "lucide-react";

interface MatchUploadStepProps {
  file: File | null;
  resultColumns: string[];
  matchFile: File | null; 
  isDragging: boolean;
  isMatching: boolean;
  isConvertingMatchFile: boolean;
  error: string | null;
  canMatch: boolean;
  nominalColumn: string;
  setNominalColumn: (v: string) => void;
  namaColumn: string;
  setNamaColumn: (v: string) => void;
  onFile: (f: File) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: () => void;
  onDragLeave: () => void;
  onSubmit: () => void;
  onBack: () => void;
  mutasiKeteranganColumn: string;
  setMutasiKeteranganColumn: (v: string) => void;
  mutasiJumlahColumn: string;
  setMutasiJumlahColumn: (v: string) => void;
  mutasiCsvDelimiter: string;
  setMutasiCsvDelimiter: (v: string) => void;
  mutasiCsvHeaderRow: number;
  setMutasiCsvHeaderRow: (v: number) => void;
  isCsvFile: boolean;
}

export function MatchUploadStep({
  file,
  resultColumns,
  matchFile,
  isDragging,
  isMatching,
  isConvertingMatchFile,
  error,
  canMatch,
  nominalColumn,
  setNominalColumn,
  namaColumn,
  setNamaColumn,
  onFile,
  onDrop,
  onDragOver,
  onDragLeave,
  onSubmit,
  onBack,
  mutasiKeteranganColumn,
  setMutasiKeteranganColumn,
  mutasiJumlahColumn,
  setMutasiJumlahColumn,
  mutasiCsvDelimiter,
  setMutasiCsvDelimiter,
  mutasiCsvHeaderRow,
  setMutasiCsvHeaderRow,
  isCsvFile,
}: MatchUploadStepProps) {
  return (
    <div className="animate-slide-up max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-muted hover:text-ink text-sm font-body mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke hasil cleaning
      </button>

      <h1 className="font-display text-3xl font-800 text-ink mb-2">
        Cocokkan dengan Mutasi Bank
      </h1>
      <p className="font-body text-muted mb-8">
        Upload data mutasi bank (CSV) untuk memeriksa transaksi mana yang
        sebenarnya sudah masuk, meski status di data cleaning masih
        Checkout/Expired.
      </p>

      {/* Pilih kolom */}
      <div className="p-5 bg-cream border border-border rounded-2xl mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Columns3 className="w-4 h-4 text-muted" />
          <span className="font-display font-600 text-sm text-ink">
            Kolom di data hasil cleaning
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="font-body text-xs text-muted mb-1 block">Kolom Nominal</label>
            <select
              value={nominalColumn}
              onChange={(e) => setNominalColumn(e.target.value)}
              className="w-full px-3 py-2 bg-paper border border-border rounded-lg font-mono text-sm text-ink focus:outline-none focus:border-accent"
            >
              <option value="">— Pilih kolom —</option>
              {resultColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-body text-xs text-muted mb-1 block">Kolom Nama</label>
            <select
              value={namaColumn}
              onChange={(e) => setNamaColumn(e.target.value)}
              className="w-full px-3 py-2 bg-paper border border-border rounded-lg font-mono text-sm text-ink focus:outline-none focus:border-accent"
            >
              <option value="">— Pilih kolom —</option>
              {resultColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="font-body text-xs text-muted mt-3">
          Baris dianggap <span className="text-ink font-medium">Cocok</span> kalau nominal
          ATAU nama ditemukan di data mutasi (salah satu cukup).
        </p>
      </div>

      {/* Nama kolom di file mutasi bank */}
      <div className="p-5 bg-cream border border-border rounded-2xl mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Columns3 className="w-4 h-4 text-muted" />
          <span className="font-display font-600 text-sm text-ink">
            Nama kolom di file mutasi bank
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="font-body text-xs text-muted mb-1 block">Kolom Keterangan</label>
            <input
              type="text"
              value={mutasiKeteranganColumn}
              onChange={(e) => setMutasiKeteranganColumn(e.target.value)}
              className="w-full px-3 py-2 bg-paper border border-border rounded-lg font-mono text-sm text-ink focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="font-body text-xs text-muted mb-1 block">Kolom Jumlah</label>
            <input
              type="text"
              value={mutasiJumlahColumn}
              onChange={(e) => setMutasiJumlahColumn(e.target.value)}
              className="w-full px-3 py-2 bg-paper border border-border rounded-lg font-mono text-sm text-ink focus:outline-none focus:border-accent"
            />
          </div>
        </div>
        <p className="font-body text-xs text-muted mt-3">
          Sesuaikan kalau nama kolom di file mutasi bank kamu beda dari default ini.
        </p>
      </div>

      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer ${
          isDragging ? "border-accent bg-accent/5 scale-[1.01]" : "border-border hover:border-ink bg-cream"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver();
        }}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => document.getElementById("mutasi-file-input")?.click()}
      >
        <input
          id="mutasi-file-input"
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        <div className="py-12 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-ink/5 border border-border flex items-center justify-center">
            <Upload className="w-6 h-6 text-ink/50" />
          </div>
          <div className="text-center">
            <p className="font-display font-600 text-lg text-ink mb-1">
              {isConvertingMatchFile
                ? "Mengonversi file Excel..."
                : matchFile
                ? matchFile.name
                : isDragging
                ? "Lepaskan file di sini"
                : "Drag & drop mutasi bank"}
            </p>
            {!matchFile && (
              <p className="font-body text-muted text-sm">
                atau{" "}
                <span className="text-accent font-medium underline underline-offset-2">
                  klik untuk browse
                </span>
              </p>
            )}
            <p className="font-mono text-xs text-border mt-3">CSV / XLS / XLSX — kolom Keterangan &amp; Jumlah</p>
          </div>
        </div>
      </div>

      {matchFile?.name.toLowerCase().endsWith(".csv") || matchFile?.name.toLowerCase().endsWith(".xls") ? (
        <div className="p-5 bg-cream border border-border rounded-2xl mb-6 mt-6 animate-fade-in">
          <div className="grid sm:grid-cols-2 gap-3 mt-1 pt-1 border-t">
            <div>
              <label className="font-body text-xs text-muted mb-1 block">Delimiter CSV</label>
              <input
                type="text"
                value={mutasiCsvDelimiter}
                onChange={(e) => setMutasiCsvDelimiter(e.target.value)}
                className="w-full px-3 py-2 bg-paper border border-border rounded-lg font-mono text-sm text-ink focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="font-body text-xs text-muted mb-1 block">
                Baris header (0 = baris pertama)
              </label>
              <input
                type="number"
                min={0}
                value={mutasiCsvHeaderRow}
                onChange={(e) => setMutasiCsvHeaderRow(Number(e.target.value))}
                className="w-full px-3 py-2 bg-paper border border-border rounded-lg font-mono text-sm text-ink focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>
      ) : null}

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="font-body text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={!canMatch}
        className="mt-6 w-full sm:w-auto px-6 py-3 bg-ink text-paper 
          font-display font-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed 
          flex items-center justify-center gap-2 hover:bg-ink/90 transition-colors"
      >
        {isMatching ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Mencocokkan...
          </>
        ) : (
          "Cocokkan Data"
        )}
      </button>
    </div>
  );
}