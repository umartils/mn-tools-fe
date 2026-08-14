import { Sparkles, ListFilter } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { ToolCard } from "@/components/ToolCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <AppHeader />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10 animate-slide-up">
          <h1 className="font-display text-5xl font-bold text-ink leading-tight mb-3">
            WELCOME 
            <br />
            <span className="text-accent text-bold">MN DATA TOOLS</span>
          </h1>
          {/* <p className="font-body text-muted text-lg max-w-md">
            Pilih tool yang kamu butuhkan — semua jalan langsung di file CSV
            atau Excel kamu, tanpa perlu pindah-pindah aplikasi.
          </p> */}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
          <ToolCard
            href="/cleaning"
            icon={Sparkles}
            title="Data Cleaning (Donatur Pending)"
            description="Normalisasi nama kolom, hapus duplikat & baris kosong, filter status transaksi."
          />
          <ToolCard
            href="/sorting"
            icon={ListFilter}
            title="Klasifikasi Donasi (Donatur Scrapt)"
            description="Kelompokkan transaksi donasi ke kategori berdasarkan keterangan & nominal, hasil per sheet."
          />
        </div>
      </main>
    </div>
  );
}
