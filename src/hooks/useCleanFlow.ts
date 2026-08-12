"use client";

import { useState, useRef, useCallback } from "react";
import { analyzeFile, cleanFile, AnalyzeResult, CleanResult } from "@/lib/api";

export type Step = "upload" | "configure" | "result";

export function useCleanFlow() {
  // ── Navigation ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("upload");

  // ── File ────────────────────────────────────────────────────────────────────
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Async state ─────────────────────────────────────────────────────────────
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Results ─────────────────────────────────────────────────────────────────
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [cleanResult, setCleanResult] = useState<CleanResult | null>(null);

  // ── Clean options ────────────────────────────────────────────────────────────
  const [normalizeColNames, setNormalizeColNames] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [dedupTimeColumn, setDedupTimeColumn] = useState<string>("");
  const [dedupSubset, setDedupSubset] = useState<string[]>([]);
  const [removeNulls, setRemoveNulls] = useState(true);
  const [filterColumn, setFilterColumn] = useState<string>("");
  const [filterValues, setFilterValues] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState<"csv" | "xlsx">("xlsx");

  // ── Derived ──────────────────────────────────────────────────────────────────
  const selectedColumn = analyzeResult?.columns.find((c) => c.name === filterColumn);
  const removedRows = cleanResult ? cleanResult.originalRows - cleanResult.finalRows : 0;
  const removalPercent = cleanResult
    ? Math.round((removedRows / cleanResult.originalRows) * 100)
    : 0;
  const canClean = normalizeColNames || removeDuplicates || removeNulls || !!filterColumn;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleFile = useCallback(async (f: File) => {
    const name = f.name.toLowerCase();
    if (!name.endsWith(".csv") && !name.endsWith(".xlsx") && !name.endsWith(".xls")) {
      setError("Format tidak didukung. Gunakan file CSV atau Excel (.xlsx).");
      return;
    }
    setFile(f);
    setError(null);
    setIsAnalyzing(true);
    try {
      const result = await analyzeFile(f);
      setAnalyzeResult(result);
      setStep("configure");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal membaca file");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleClean = async () => {
    if (!file) return;
    setIsCleaning(true);
    setError(null);
    try {
      const result = await cleanFile({
        file,
        normalizeColNames,
        removeDuplicates,
        dedupTimeColumn: dedupTimeColumn || null,
        dedupSubset,
        removeNulls,
        filterColumn: filterColumn || null,
        filterValues,
        outputFormat,
      });
      setCleanResult(result);
      setStep("result");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal memproses file");
    } finally {
      setIsCleaning(false);
    }
  };

  const handleDownload = () => {
    if (!cleanResult) return;
    const url = URL.createObjectURL(cleanResult.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = cleanResult.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setStep("upload");
    setFile(null);
    setAnalyzeResult(null);
    setCleanResult(null);
    setError(null);
    setFilterColumn("");
    setFilterValues([]);
    setNormalizeColNames(false);
    setRemoveDuplicates(true);
    setDedupTimeColumn("");
    setDedupSubset([]);
    setRemoveNulls(true);
    setOutputFormat("csv");
  };

  const toggleFilterValue = (val: string) => {
    setFilterValues((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  return {
    // State
    step,
    file,
    isDragging,
    isAnalyzing,
    isCleaning,
    error,
    analyzeResult,
    cleanResult,
    selectedColumn,
    removedRows,
    removalPercent,
    canClean,

    // Refs
    fileInputRef,

    // Clean options (state + setters)
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
    filterColumn,
    setFilterColumn,
    filterValues,
    setFilterValues,
    outputFormat,
    setOutputFormat,

    // Handlers
    handleFile,
    handleDrop,
    handleClean,
    handleDownload,
    handleReset,
    toggleFilterValue,
    setIsDragging,
  };
}