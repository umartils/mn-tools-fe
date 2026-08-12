import { API_BASE } from "./api";

export interface SortOptions {
  file: File;
  colKeterangan: string;
  colNominal: string;
  colProgram: string;
  csvDelimiter: string;
  csvHeaderRow: number;
}

export interface SortResult {
  blob: Blob;
  filename: string;
}

export async function klasifikasiDonasi(opts: SortOptions): Promise<SortResult> {
  const form = new FormData();
  form.append("file", opts.file);
  form.append("col_keterangan", opts.colKeterangan);
  form.append("col_nominal", opts.colNominal);
  form.append("col_program", opts.colProgram);
  form.append("csv_delimiter", opts.csvDelimiter);
  form.append("csv_header_row", String(opts.csvHeaderRow));

  const res = await fetch(`${API_BASE}/sorting/klasifikasi-donasi`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    let message = "Gagal memproses file";
    try {
      const err = await res.json();
      message = err.detail || message;
    } catch {
      // response bukan JSON, pakai pesan default
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="(.+?)"/);
  const filename = match ? match[1] : "hasil_klasifikasi.xlsx";

  return { blob, filename };
}
