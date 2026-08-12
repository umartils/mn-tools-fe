"use client";

import { useSortFlow } from "@/hooks/useSortFlow";
import { AppHeader } from "@/components/AppHeader";
import { SortForm } from "@/components/sorting/SortForm";
import { SortResultStep } from "@/components/sorting/SortResultStep";

export default function SortingPage() {
  const flow = useSortFlow();

  return (
    <div className="min-h-screen bg-paper">
      <AppHeader toolTitle="Klasifikasi Data Donatur Scrapt" />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {flow.step === "form" && (
          <SortForm
            file={flow.file}
            isDragging={flow.isDragging}
            isSubmitting={flow.isSubmitting}
            error={flow.error}
            canSubmit={flow.canSubmit}
            fileInputRef={flow.fileInputRef}
            colKeterangan={flow.colKeterangan}
            setColKeterangan={flow.setColKeterangan}
            colNominal={flow.colNominal}
            setColNominal={flow.setColNominal}
            colProgram={flow.colProgram}
            setColProgram={flow.setColProgram}
            csvDelimiter={flow.csvDelimiter}
            setCsvDelimiter={flow.setCsvDelimiter}
            csvHeaderRow={flow.csvHeaderRow}
            setCsvHeaderRow={flow.setCsvHeaderRow}
            onFile={flow.handleFile}
            onDrop={flow.handleDrop}
            onDragOver={() => flow.setIsDragging(true)}
            onDragLeave={() => flow.setIsDragging(false)}
            onSubmit={flow.handleSubmit}
          />
        )}

        {flow.step === "result" && flow.result && (
          <SortResultStep
            result={flow.result}
            onDownload={flow.handleDownload}
            onReset={flow.handleReset}
          />
        )}
      </main>
    </div>
  );
}
