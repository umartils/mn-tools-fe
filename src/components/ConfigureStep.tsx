import {
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Clock,
  ChevronDown,
  CaseSensitive,
  Plus,
  Filter as FilterIcon,
} from "lucide-react";
import { AnalyzeResult } from "@/lib/api";
import { FilterDraft } from "@/hooks/useCleanFlow";

interface ConfigureStepProps {
  file: File | null;
  analyzeResult: AnalyzeResult;
  isCleaning: boolean;
  error: string | null;
  canClean: boolean;
  normalizeColNames: boolean;
  setNormalizeColNames: (v: boolean) => void;
  removeDuplicates: boolean;
  setRemoveDuplicates: (v: boolean) => void;
  dedupTimeColumn: string;
  setDedupTimeColumn: (v: string) => void;
  dedupSubset: string[];
  setDedupSubset: (fn: (prev: string[]) => string[]) => void;
  removeNulls: boolean;
  setRemoveNulls: (v: boolean) => void;
  filters: FilterDraft[];
  addFilter: () => void;
  removeFilter: (id: string) => void;
  setFilterColumn: (id: string, column: string) => void;
  setFilterValues: (id: string, values: string[]) => void;
  toggleFilterValue: (id: string, val: string) => void;
  outputFormat: "csv" | "xlsx";
  setOutputFormat: (v: "csv" | "xlsx") => void;
  onClean: () => void;
  onReset: () => void;
}

export function ConfigureStep({
  file,
  analyzeResult,
  isCleaning,
  error,
  canClean,
  normalizeColNames,
  setNormalizeColNames,
  removeDuplicates,
  setRemoveDuplicates,
  dedupTimeColumn,
  setDedupTimeColumn,
  dedupSubset,
  setDedupSubset,
  removeNulls,
  setRemoveNulls,
  filters,
  addFilter,
  removeFilter,
  setFilterColumn,
  setFilterValues,
  toggleFilterValue,
  outputFormat,
  setOutputFormat,
  onClean,
  onReset,
}: ConfigureStepProps) {
  return (
    <div className="animate-slide-up">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl font-700 text-ink mb-1">
            Konfigurasi Pembersihan
          </h2>
          <p className="font-body text-muted text-sm">{file?.name}</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors font-body"
        >
          <X className="w-3.5 h-3.5" />
          Ganti file
        </button>
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Baris", value: analyzeResult.total_rows.toLocaleString() },
          { label: "Total Kolom", value: analyzeResult.total_columns },
          {
            label: "Baris Duplikat",
            value: analyzeResult.duplicate_rows.toLocaleString(),
            highlight: analyzeResult.duplicate_rows > 0,
          },
        ].map(({ label, value, highlight }) => (
          <div key={label} className="bg-cream border border-border rounded-xl p-4">
            <p className="font-mono text-xs text-muted uppercase tracking-wide mb-1">{label}</p>
            <p className={`font-display text-2xl font-700 ${highlight ? "text-accent" : "text-ink"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Left: Cleaning options ── */}
        <div className="space-y-4">
          <h3 className="font-display font-600 text-ink text-sm uppercase tracking-wider">
            Operasi Pembersihan
          </h3>

          {/* Normalize column names */}
          <NormalizeOption
            checked={normalizeColNames}
            onChange={setNormalizeColNames}
            preview={analyzeResult.normalize_preview}
          />

          {/* Remove duplicates */}
          <DeduplicateOption
            checked={removeDuplicates}
            onChange={(v) => {
              setRemoveDuplicates(v);
              if (!v) setDedupTimeColumn("");
            }}
            duplicateRows={analyzeResult.duplicate_rows}
            datetimeColumns={analyzeResult.datetime_columns}
            allColumns={analyzeResult.columns}
            dedupTimeColumn={dedupTimeColumn}
            setDedupTimeColumn={setDedupTimeColumn}
            dedupSubset={dedupSubset}
            setDedupSubset={setDedupSubset}
          />

          {/* Remove nulls */}
          <label className="flex items-start gap-3 p-4 bg-cream border border-border rounded-xl cursor-pointer hover:border-ink transition-colors">
            <input
              type="checkbox"
              className="custom-checkbox mt-0.5"
              checked={removeNulls}
              onChange={(e) => setRemoveNulls(e.target.checked)}
            />
            <div>
              <p className="font-display font-600 text-ink text-sm">Hapus Baris Kosong</p>
              <p className="font-body text-muted text-xs mt-0.5">
                Menghapus baris yang memiliki nilai null atau kosong
              </p>
            </div>
          </label>

          {/* Output format */}
          <div className="p-4 bg-cream border border-border rounded-xl">
            <p className="font-display font-600 text-ink text-sm mb-3">Format Output</p>
            <div className="flex gap-2">
              {(["csv", "xlsx"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setOutputFormat(fmt)}
                  className={`flex-1 py-2 rounded-lg text-sm font-mono font-500 transition-all border ${
                    outputFormat === fmt
                      ? "bg-ink text-paper border-ink"
                      : "bg-paper text-muted border-border hover:border-ink"
                  }`}
                >
                  .{fmt}
                </button>
              ))}
            </div>
          </div>
        </div>

                {/* ── Right: Filter ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-600 text-ink text-sm uppercase tracking-wider">
              Filter Kategori
            </h3>
            <button
              onClick={addFilter}
              className="flex items-center gap-1 text-xs text-accent hover:underline font-body"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Filter
            </button>
          </div>

          {filters.length === 0 && (
            <div className="p-4 bg-cream border border-dashed border-border rounded-xl text-center">
              <FilterIcon className="w-4 h-4 text-muted mx-auto mb-2" />
              <p className="font-body text-muted text-xs">
                Belum ada filter — data tidak akan difilter kategori apapun.
                <br />
                Klik &quot;Tambah Filter&quot; kalau perlu.
              </p>
            </div>
          )}

          {filters.map((f) => (
            <FilterRow
              key={f.id}
              filter={f}
              columns={analyzeResult.columns}
              onColumnChange={(col) => setFilterColumn(f.id, col)}
              onValuesChange={(vals) => setFilterValues(f.id, vals)}
              onToggleValue={(val) => toggleFilterValue(f.id, val)}
              onRemove={() => removeFilter(f.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Preview table ── */}
      <div className="mt-8">
        <h3 className="font-display font-600 text-ink text-sm uppercase tracking-wider mb-3">
          Preview Data (5 baris pertama)
        </h3>
        <div className="border border-border rounded-xl overflow-hidden overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {analyzeResult.columns.map((col) => (
                  <th key={col.name}>{col.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analyzeResult.preview.map((row, i) => (
                <tr key={i}>
                  {analyzeResult.columns.map((col) => (
                    <td key={col.name}>
                      {row[col.name] === null || row[col.name] === "" ? (
                        <span className="text-border italic">null</span>
                      ) : (
                        String(row[col.name])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="font-body text-sm">{error}</p>
        </div>
      )}

      {/* ── CTA ── */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={onClean}
          disabled={isCleaning || !canClean}
          className="flex items-center gap-2.5 px-8 py-3.5 bg-ink text-paper rounded-xl font-display font-600 text-sm hover:bg-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isCleaning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Bersihkan Data
            </>
          )}
        </button>
      </div>
    </div>
  );
}

interface ColumnLike {
  name: string;
  unique_count: number;
  unique_values?: string[];
}

interface FilterRowProps {
  filter: FilterDraft;
  columns: ColumnLike[];
  onColumnChange: (column: string) => void;
  onValuesChange: (values: string[]) => void;
  onToggleValue: (value: string) => void;
  onRemove: () => void;
}

function FilterRow({
  filter,
  columns,
  onColumnChange,
  onValuesChange,
  onToggleValue,
  onRemove,
}: FilterRowProps) {
  const selectedColumn = columns.find((c) => c.name === filter.column);

  return (
    <div className="p-4 bg-cream border border-border rounded-xl animate-fade-in relative">
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 text-muted hover:text-ink transition-colors"
        title="Hapus filter ini"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <p className="font-body text-muted text-xs mb-2 pr-6">Pilih kolom untuk difilter</p>
      <select
        className="w-full bg-paper border border-border rounded-lg px-3 py-2 text-sm font-mono text-ink focus:outline-none focus:border-ink"
        value={filter.column}
        onChange={(e) => onColumnChange(e.target.value)}
      >
        <option value="">— Pilih kolom —</option>
        {columns
          .filter((c) => c.unique_values && c.unique_values.length > 0)
          .map((col) => (
            <option key={col.name} value={col.name}>
              {col.name} ({col.unique_count} nilai unik)
            </option>
          ))}
      </select>

      {filter.column && selectedColumn?.unique_values && (
        <div className="mt-3 pt-3 border-t border-border animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <p className="font-body text-muted text-xs">
              Pilih nilai yang <span className="font-medium text-ink">disimpan</span>
            </p>
            <button
              onClick={() =>
                onValuesChange(
                  filter.values.length === selectedColumn.unique_values!.length
                    ? []
                    : [...selectedColumn.unique_values!]
                )
              }
              className="text-xs text-accent hover:underline font-body"
            >
              {filter.values.length === selectedColumn.unique_values.length
                ? "Kosongkan semua"
                : "Pilih semua"}
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {selectedColumn.unique_values.map((val) => (
              <label
                key={val}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-paper cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={filter.values.includes(val)}
                  onChange={() => onToggleValue(val)}
                />
                <span className="font-mono text-xs text-ink truncate">{val || "(kosong)"}</span>
              </label>
            ))}
          </div>
          {filter.values.length > 0 && (
            <p className="mt-2 text-xs text-accent font-body">{filter.values.length} nilai dipilih</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components (scoped to this file — no need to export)
// ─────────────────────────────────────────────────────────────────────────────

interface NormalizeOptionProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  preview: { before: string; after: string }[];
}

function NormalizeOption({ checked, onChange, preview }: NormalizeOptionProps) {
  return (
    <div className={`border rounded-xl transition-all ${checked ? "border-ink bg-cream" : "border-border bg-cream"}`}>
      <label className="flex items-start gap-3 p-4 cursor-pointer">
        <input
          type="checkbox"
          className="custom-checkbox mt-0.5"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="font-display font-600 text-ink text-sm">Normalisasi Nama Kolom</p>
            <span className="font-mono text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded">
              snake_case
            </span>
          </div>
          <p className="font-body text-muted text-xs">
            Ubah semua nama kolom ke huruf kecil dengan underscore
          </p>
        </div>
      </label>

      {checked && preview.length > 0 && (
        <div className="border-t border-border px-4 pb-4 pt-3 animate-fade-in">
          <p className="font-body text-xs text-muted mb-2 flex items-center gap-1.5">
            <CaseSensitive className="w-3 h-3" />
            Preview perubahan nama kolom
          </p>
          <div className="max-h-36 overflow-y-auto space-y-1">
            {preview.map((r) => (
              <div key={r.before} className="flex items-center gap-2 font-mono text-xs">
                <span className="text-muted bg-paper border border-border rounded px-2 py-0.5 truncate max-w-[45%]">
                  {r.before}
                </span>
                <span className="text-border flex-shrink-0">→</span>
                <span className="text-success bg-success/5 border border-success/20 rounded px-2 py-0.5 truncate max-w-[45%]">
                  {r.after}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {checked && preview.length === 0 && (
        <div className="border-t border-border px-4 pb-3 pt-2 animate-fade-in">
          <p className="text-xs text-success font-body flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" />
            Semua nama kolom sudah dalam format snake_case
          </p>
        </div>
      )}
    </div>
  );
}

interface DeduplicateOptionProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  duplicateRows: number;
  datetimeColumns: { name: string; resolution: string; sample: string }[];
  allColumns: { name: string; unique_values?: string[]; unique_count?: number }[];
  dedupTimeColumn: string;
  setDedupTimeColumn: (v: string) => void;
  dedupSubset: string[];
  setDedupSubset: (fn: (prev: string[]) => string[]) => void;
}

function DeduplicateOption({
  checked,
  onChange,
  duplicateRows,
  datetimeColumns,
  allColumns,
  dedupTimeColumn,
  setDedupTimeColumn,
  dedupSubset,
  setDedupSubset,
}: DeduplicateOptionProps) {
  return (
    <div className={`border rounded-xl transition-all ${checked ? "border-ink bg-cream" : "border-border bg-cream"}`}>
      <label className="flex items-start gap-3 p-4 cursor-pointer">
        <input
          type="checkbox"
          className="custom-checkbox mt-0.5"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="flex-1 min-w-0">
          <p className="font-display font-600 text-ink text-sm">Hapus Duplikat</p>
          <p className="font-body text-muted text-xs mt-0.5">
            Menghapus baris yang memiliki data identik
            {duplicateRows > 0 && (
              <span className="text-accent font-medium">
                {" "}· {duplicateRows} baris terdeteksi
              </span>
            )}
          </p>
        </div>
      </label>

      {checked && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-3 animate-fade-in">
          {/* Keep latest by time column */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Clock className="w-3 h-3 text-accent" />
              <p className="font-body text-xs font-medium text-ink">
                Pertahankan data terbaru berdasarkan kolom waktu
              </p>
            </div>

            {datetimeColumns.length > 0 ? (
              <div className="relative">
                <select
                  className="w-full appearance-none bg-paper border border-border rounded-lg px-3 py-2 pr-8 text-sm font-mono text-ink focus:outline-none focus:border-ink"
                  value={dedupTimeColumn}
                  onChange={(e) => setDedupTimeColumn(e.target.value)}
                >
                  <option value="">— Tidak pakai (hapus duplikat biasa) —</option>
                  {datetimeColumns.map((col) => (
                    <option key={col.name} value={col.name}>
                      {col.name}
                      {col.resolution === "second"
                        ? " · presisi detik"
                        : col.resolution === "minute"
                        ? " · presisi menit"
                        : " · hanya tanggal"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
              </div>
            ) : (
              <p className="text-xs font-body text-muted bg-paper border border-border rounded-lg px-3 py-2">
                Tidak ada kolom waktu terdeteksi di file ini
              </p>
            )}

            {dedupTimeColumn && (
              <p className="mt-1.5 text-xs font-body text-muted">
                Contoh nilai:{" "}
                <span className="font-mono text-ink">
                  {datetimeColumns.find((c) => c.name === dedupTimeColumn)?.sample}
                </span>
              </p>
            )}
          </div>

          {/* Dedup subset columns */}
          {dedupTimeColumn && (
            <div className="animate-fade-in">
              <p className="font-body text-xs font-medium text-ink mb-1.5">
                Kolom kunci duplikat{" "}
                <span className="text-muted font-normal">
                  (opsional — kosong = semua kolom non-waktu)
                </span>
              </p>
              <div className="max-h-32 overflow-y-auto border border-border rounded-lg bg-paper p-2 space-y-1">
                {allColumns
                  .filter((c) => c.name !== dedupTimeColumn)
                  .map((col) => (
                    <label
                      key={col.name}
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-cream cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={dedupSubset.includes(col.name)}
                        onChange={() =>
                          setDedupSubset((prev) =>
                            prev.includes(col.name)
                              ? prev.filter((c) => c !== col.name)
                              : [...prev, col.name]
                          )
                        }
                      />
                      <span className="font-mono text-xs text-ink truncate">{col.name}</span>
                    </label>
                  ))}
              </div>
              {dedupSubset.length > 0 && (
                <p className="mt-1 text-xs text-accent font-body">
                  {dedupSubset.length} kolom dipilih sebagai kunci
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}