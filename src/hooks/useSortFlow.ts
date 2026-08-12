"use client";

import { useCallback, useRef, useState } from "react";
import { klasifikasiDonasi, SortResult } from "@/lib/sortApi";

export type SortStep = "form" | "result";

export function useSortFlow() {
  const [step, setStep] = useState<SortStep>("form");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SortResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default sesuai struktur data transaksi donasi yang biasa dipakai
  const [colKeterangan, setColKeterangan] = useState("Keterangan");
  const [colNominal, setColNominal] = useState("Transaksi");
  const [colProgram, setColProgram] = useState("Program");
  const [csvDelimiter, setCsvDelimiter] = useState(";");
  const [csvHeaderRow, setCsvHeaderRow] = useState(1);

  const handleFile = useCallback((f: File) => {
    setError(null);
    setFile(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const canSubmit = !!file && !!colKeterangan && !!colNominal && !!colProgram && !isSubmitting;

  const handleSubmit = useCallback(async () => {
    if (!file) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await klasifikasiDonasi({
        file,
        colKeterangan,
        colNominal,
        colProgram,
        csvDelimiter,
        csvHeaderRow,
      });
      setResult(res);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  }, [file, colKeterangan, colNominal, colProgram, csvDelimiter, csvHeaderRow]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  const handleReset = useCallback(() => {
    setStep("form");
    setFile(null);
    setResult(null);
    setError(null);
  }, []);

  return {
    step,
    file,
    isDragging,
    setIsDragging,
    isSubmitting,
    error,
    result,
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
    canSubmit,
    handleFile,
    handleDrop,
    handleSubmit,
    handleDownload,
    handleReset,
  };
}
