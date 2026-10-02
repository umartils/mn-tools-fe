"use client";

import { useCleanFlow } from "@/hooks/useCleanFlow";
import { StepHeader } from "@/components/StepHeader";
import { UploadStep } from "@/components/UploadStep";
import { ConfigureStep } from "@/components/ConfigureStep";
import { ResultStep } from "@/components/ResultStep";
import { AppHeader } from "@/components/AppHeader";
import { MatchUploadStep } from "@/components/mathcing/MatchingUploadStep";
import { MatchResultStep } from "@/components/mathcing/MatchingResultStep";

export default function CleaningPage() {
  const flow = useCleanFlow();

  return (
    <div className="min-h-screen bg-paper">
      <AppHeader toolTitle="Data Cleaning" right={<StepHeader step={flow.step} />} />

      {/* ── Main ── */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {flow.step === "upload" && (
          <UploadStep
            isDragging={flow.isDragging}
            isAnalyzing={flow.isAnalyzing}
            error={flow.error}
            fileInputRef={flow.fileInputRef}
            onFile={flow.handleFile}
            onDrop={flow.handleDrop}
            onDragOver={() => flow.setIsDragging(true)}
            onDragLeave={() => flow.setIsDragging(false)}
          />
        )}

        {flow.step === "configure" && flow.analyzeResult && (
          <ConfigureStep
            file={flow.file}
            analyzeResult={flow.analyzeResult}
            isCleaning={flow.isCleaning}
            error={flow.error}
            canClean={flow.canClean}
            normalizeColNames={flow.normalizeColNames}
            setNormalizeColNames={flow.setNormalizeColNames}
            removeDuplicates={flow.removeDuplicates}
            setRemoveDuplicates={flow.setRemoveDuplicates}
            dedupTimeColumn={flow.dedupTimeColumn}
            setDedupTimeColumn={flow.setDedupTimeColumn}
            dedupSubset={flow.dedupSubset}
            setDedupSubset={flow.setDedupSubset}
            removeNulls={flow.removeNulls}
            setRemoveNulls={flow.setRemoveNulls}
            filters={flow.filters}
            addFilter={flow.addFilter}
            removeFilter={flow.removeFilter}
            setFilterColumn={flow.setFilterColumn}
            setFilterValues={flow.setFilterValues}
            toggleFilterValue={flow.toggleFilterValue}
            outputFormat={flow.outputFormat}
            setOutputFormat={flow.setOutputFormat}
            onClean={flow.handleClean}
            onReset={flow.handleReset}
          />
        )}

        {flow.step === "result" && flow.cleanResult && (
          <ResultStep
            cleanResult={flow.cleanResult}
            removedRows={flow.removedRows}
            removalPercent={flow.removalPercent}
            onDownload={flow.handleDownload}
            onGoToMatch={flow.goToMatch}
            onReset={flow.handleReset}
          />
        )}

        {flow.step === "match" && flow.cleanResult && (
          <MatchUploadStep
            file={flow.file}
            resultColumns={flow.cleanResult.resultColumns}
            matchFile={flow.matchFile}
            isConvertingMatchFile={flow.isConvertingMatchFile}
            isDragging={flow.isDragging}
            isMatching={flow.isMatching}
            error={flow.matchError}
            canMatch={flow.canMatch}
            nominalColumn={flow.nominalColumn}
            setNominalColumn={flow.setNominalColumn}
            namaColumn={flow.namaColumn}
            setNamaColumn={flow.setNamaColumn}
            onFile={flow.handleMatchFile}
            onDrop={flow.handleMatchDrop}
            onDragOver={() => flow.setIsDragging(true)}
            onDragLeave={() => flow.setIsDragging(false)}
            onSubmit={flow.handleMatchSubmit}
            onBack={flow.backToResult}
            mutasiKeteranganColumn={flow.mutasiKeteranganColumn}
            setMutasiKeteranganColumn={flow.setMutasiKeteranganColumn}
            mutasiJumlahColumn={flow.mutasiJumlahColumn}
            setMutasiJumlahColumn={flow.setMutasiJumlahColumn}
            mutasiCsvDelimiter={flow.mutasiCsvDelimiter}
            setMutasiCsvDelimiter={flow.setMutasiCsvDelimiter}
            mutasiCsvHeaderRow={flow.mutasiCsvHeaderRow}
            setMutasiCsvHeaderRow={flow.setMutasiCsvHeaderRow}
            isCsvFile={flow.isCsvFile}
          />
        )}

        {flow.step === "matchResult" && flow.matchResult && (
          <MatchResultStep
            matchResult={flow.matchResult}
            onDownload={flow.handleMatchDownload}
            onReset={flow.handleReset}
          />
        )}
      </main>
    </div>
  );
}