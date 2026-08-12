import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AppHeaderProps {
  /** Konten kanan header spesifik tool, mis. StepHeader untuk cleaning */
  right?: React.ReactNode;
  /** Tampilkan tombol back-to-home + judul tool (dipakai di halaman tool) */
  toolTitle?: string;
}

export function AppHeader({ right, toolTitle }: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-paper/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {toolTitle ? (
            <Link
              href="/"
              className="flex items-center gap-2 text-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-body text-sm hidden sm:inline">Semua tools</span>
            </Link>
          ) : (
            <>
              <div className="w-8 h-8 rounded-sm flex items-center justify-center">
                <Image
                  src="/assets/cropped-logo-masjid-nusantara.png"
                  alt="Logo"
                  width={32}
                  height={32}
                />
              </div>
              <span className="hidden sm:inline font-display font-700 text-xl tracking-tight text-ink">
                MN Data Tools
              </span>
            </>
          )}
          {toolTitle && (
            <>
              <span className="text-border">/</span>
              <span className="font-display font-700 text-lg tracking-tight text-ink">
                {toolTitle}
              </span>
            </>
          )}
        </div>
        {right}
      </div>
    </header>
  );
}
