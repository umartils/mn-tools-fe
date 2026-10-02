import * as XLSX from "xlsx";

/**
 * Konversi file .xls/.xlsx jadi File CSV baru (ambil sheet pertama saja).
 * Tujuannya supaya file Excel biner tidak pernah dikirim ke backend —
 * beberapa layer hosting (termasuk firewall Vercel) kadang salah-tangkap
 * konten biner file Excel sebagai request mencurigakan.
 */
export async function convertExcelToCsv(file: File): Promise<File> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  const csv = XLSX.utils.sheet_to_csv(worksheet, { FS: ";", });
  const csvBlob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const csvFilename = file.name.replace(/\.(xlsx|xls)$/i, ".csv");
  return new File([csvBlob], csvFilename, {
    type: "text/csv;charset=utf-8;",
  });
}

export function isExcelFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith(".xls") || name.endsWith(".xlsx");
}