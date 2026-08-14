import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MN Data Tools — CSV & Excel Toolkit",
  description: "Bersihkan, filter, dan klasifikasikan data CSV & Excel lembaga dalam satu tempat",
  icons: {
    icon: "/assets/cropped-logo-masjid-nusantara.png", // ambil dari public
    shortcut: "/assets/cropped-logo-masjid-nusantara.png",
    apple: "/assets/cropped-logo-masjid-nusantara.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
