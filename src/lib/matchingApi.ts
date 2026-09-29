import { API_BASE } from "./api";

export interface MatchOptions {
  fileTransaksi: File;
  fileMutasi: File;
  nominalColumn: string;
  namaColumn: string;
  mutasiKeteranganColumn?: string;
  mutasiJumlahColumn?: string;
}

export interface MatchResult {
  blob: Blob;
  filename: string;
  matchedCount: number;
  unmatchedCount: number;
}

export async function cocokkanMutasi(opts: MatchOptions): Promise<MatchResult> {
  const form = new FormData();
  form.append("file_transaksi", opts.fileTransaksi);
  form.append("file_mutasi", opts.fileMutasi);
  form.append("nominal_column", opts.nominalColumn);
  form.append("nama_column", opts.namaColumn);
  form.append("mutasi_keterangan_column", opts.mutasiKeteranganColumn || "Keterangan");
  form.append("mutasi_jumlah_column", opts.mutasiJumlahColumn || "Jumlah");

  const res = await fetch(`${API_BASE}/matching/cocokkan-mutasi`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    let message = "Gagal mencocokkan data";
    try {
      const err = await res.json();
      message = err.detail || message;
    } catch {
      // response bukan JSON, pakai pesan default
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const matchedCount = parseInt(res.headers.get("X-Matched-Count") || "0");
  const unmatchedCount = parseInt(res.headers.get("X-Unmatched-Count") || "0");

  const disposition = res.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="(.+?)"/);
  const filename = match ? match[1] : "hasil_pencocokan_mutasi.xlsx";

  return { blob, filename, matchedCount, unmatchedCount };
}