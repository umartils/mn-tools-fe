"use client";

import { useState, useRef, useCallback } from "react";
import { analyzeFile, cleanFile, AnalyzeResult, CleanResult } from "@/lib/api";
import { cocokkanMutasi, MatchResult } from "@/lib/matchingApi";

export type Step = "upload" | "configure" | "result" | "match" | "matchResult";

export interface FilterDraft {
  id: string;
  column: string;
  values: string[];
}

let filterIdCounter = 0;
const nextFilterId = () => `filter_${++filterIdCounter}`;

function guessColumn(columns: string[], hints: string[]): string {
  const found = columns.find((c) => hints.some((h) => c.toLowerCase().includes(h)));
  return found || "";
}


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

    // ── Matching mutasi bank ────────────────────────────────────────────────────
  const [matchFile, setMatchFile] = useState<File | null>(null);
  const [nominalColumn, setNominalColumn] = useState("");
  const [namaColumn, setNamaColumn] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [mutasiKeteranganColumn, setMutasiKeteranganColumn] = useState("Keterangan");
  const [mutasiJumlahColumn, setMutasiJumlahColumn] = useState("Jumlah");

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

    setMatchFile(null);
    setNominalColumn("");
    setNamaColumn("");
    setMutasiKeteranganColumn("Keterangan");
    setMutasiJumlahColumn("Jumlah");
    setMatchError(null);
    setMatchResult(null);
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

  // ── Matching mutasi bank ────────────────────────────────────────────────────
  const goToMatch = () => {
    if (cleanResult) {
      setNominalColumn(guessColumn(cleanResult.resultColumns, ["nominal", "jumlah", "amount", "transaksi"]));
      setNamaColumn(guessColumn(cleanResult.resultColumns, ["nama", "keterangan"]));
    }
    setMatchError(null);
    setMatchResult(null);
    setMatchFile(null);
    setStep("match");
  };

  const handleMatchFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith(".csv")) {
      setMatchError("Format tidak didukung. Gunakan file CSV mutasi bank.");
      return;
    }
    setMatchError(null);
    setMatchFile(f);
  }, []);

  const handleMatchDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleMatchFile(f);
    },
    [handleMatchFile]
  );

  const canMatch =
    !!matchFile &&
    !!nominalColumn &&
    !!namaColumn &&
    !!mutasiKeteranganColumn &&
    !!mutasiJumlahColumn &&
    !isMatching;

  const handleMatchSubmit = async () => {
    if (!cleanResult || !matchFile) return;
    setIsMatching(true);
    setMatchError(null);
    try {
      const fileTransaksi = new File([cleanResult.blob], cleanResult.filename);
      const result = await cocokkanMutasi({
        fileTransaksi,
        fileMutasi: matchFile,
        nominalColumn,
        namaColumn,
        mutasiKeteranganColumn,
        mutasiJumlahColumn,
      });
      setMatchResult(result);
      setStep("matchResult");
    } catch (e) {
      setMatchError(e instanceof Error ? e.message : "Gagal mencocokkan data");
    } finally {
      setIsMatching(false);
    }
  };

  const handleMatchDownload = () => {
    if (!matchResult) return;
    const url = URL.createObjectURL(matchResult.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = matchResult.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const backToResult = () => {
    setMatchFile(null);
    setMatchError(null);
    setMatchResult(null);
    setStep("result");
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
    matchFile,
    nominalColumn,
    setNominalColumn,
    namaColumn,
    setNamaColumn,
    mutasiKeteranganColumn,
    setMutasiKeteranganColumn,
    mutasiJumlahColumn,
    setMutasiJumlahColumn,

    isMatching,
    matchError,
    matchResult,
    canMatch,

    // Handlers
    handleFile,
    handleDrop,
    handleClean,
    handleDownload,
    handleReset,
    setIsDragging,
    goToMatch,
    handleMatchFile,
    handleMatchDrop,
    handleMatchSubmit,
    handleMatchDownload,
    backToResult,
  };
}