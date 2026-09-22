"use client";

import { useState, useRef, useCallback } from "react";
import { analyzeFile, cleanFile, AnalyzeResult, CleanResult } from "@/lib/api";

export interface FilterDraft {
  id: string;
  column: string;
  values: string[];
}

let filterIdCounter = 0;
const nextFilterId = () => `filter_${++filterIdCounter}`;

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
  const [filters, setFilters] = useState<FilterDraft[]>([]);
  const [outputFormat, setOutputFormat] = useState<"csv" | "xlsx">("xlsx");

  // ── Derived ──────────────────────────────────────────────────────────────────
  const removedRows = cleanResult ? cleanResult.originalRows - cleanResult.finalRows : 0;
  const removalPercent = cleanResult
    ? Math.round((removedRows / cleanResult.originalRows) * 100)
    : 0;
  const hasActiveFilter = filters.some((f) => f.column && f.values.length > 0);
  const canClean = normalizeColNames || removeDuplicates || removeNulls || hasActiveFilter;

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
        filters: filters.map(({ column, values }) => ({ column, values })),
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
    setFilters([]);
    setNormalizeColNames(false);
    setRemoveDuplicates(true);
    setDedupTimeColumn("");
    setDedupSubset([]);
    setRemoveNulls(true);
    setOutputFormat("csv");
  };

  const addFilter = () => {
    setFilters((prev) => [...prev, { id: nextFilterId(), column: "", values: [] }]);
  };

  const removeFilter = (id: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const setFilterColumn = (id: string, column: string) => {
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, column, values: [] } : f)));
  };

  const setFilterValues = (id: string, values: string[]) => {
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, values } : f)));
  };

  const toggleFilterValue = (id: string, val: string) => {
    setFilters((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, values: f.values.includes(val) ? f.values.filter((v) => v !== val) : [...f.values, val] }
          : f
      )
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
    filters,
    addFilter,
    removeFilter,
    setFilterColumn,
    setFilterValues,
    toggleFilterValue,
    outputFormat,
    setOutputFormat,

    // Handlers
    handleFile,
    handleDrop,
    handleClean,
    handleDownload,
    handleReset,
    setIsDragging,
  };
}