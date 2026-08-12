export const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "/api";

export interface ColumnInfo {
  name: string;
  dtype: string;
  null_count: number;
  unique_count: number;
  unique_values?: string[];
}

export interface AnalyzeResult {
  total_rows: number;
  total_columns: number;
  duplicate_rows: number;
  columns: ColumnInfo[];
  datetime_columns: DatetimeColumnInfo[];
  normalize_preview: { before: string; after: string }[];
  preview: Record<string, unknown>[];
}

export interface DatetimeColumnInfo {
  name: string;
  sample: string;
  resolution: "second" | "minute" | "date";
}

export interface CleanOptions {
  file: File;
  normalizeColNames: boolean;
  removeDuplicates: boolean;
  dedupTimeColumn: string | null;
  dedupSubset: string[];
  removeNulls: boolean;
  filterColumn: string | null;
  filterValues: string[];
  outputFormat: "csv" | "xlsx";
}

export interface CleanResult {
  blob: Blob;
  filename: string;
  originalRows: number;
  finalRows: number;
  stepsLog: string[];
}

export async function analyzeFile(file: File): Promise<AnalyzeResult> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Gagal menganalisis file");
  }

  return res.json();
}

export async function cleanFile(opts: CleanOptions): Promise<CleanResult> {
  const form = new FormData();
  form.append("file", opts.file);
  form.append("normalize_col_names", String(opts.normalizeColNames));
  form.append("remove_duplicates", String(opts.removeDuplicates));
  form.append("dedup_time_column", opts.dedupTimeColumn || "");
  form.append("dedup_subset", JSON.stringify(opts.dedupSubset));
  form.append("remove_nulls", String(opts.removeNulls));
  form.append("filter_column", opts.filterColumn || "");
  form.append("filter_values", JSON.stringify(opts.filterValues));
  form.append("output_format", opts.outputFormat);

  const res = await fetch(`${API_BASE}/clean`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Gagal membersihkan file");
  }

  const blob = await res.blob();
  const originalRows = parseInt(res.headers.get("X-Original-Rows") || "0");
  const finalRows = parseInt(res.headers.get("X-Final-Rows") || "0");
  const stepsLogRaw = res.headers.get("X-Steps-Log") || "[]";
  const stepsLog: string[] = JSON.parse(stepsLogRaw);

  const disposition = res.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="(.+?)"/);
  const filename = match ? match[1] : `cleaned_data.${opts.outputFormat}`;

  return { blob, filename, originalRows, finalRows, stepsLog };
}
