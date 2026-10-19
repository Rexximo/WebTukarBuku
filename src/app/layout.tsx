import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/images/logoFTB.png",
  },
  title: {
    default: "FestivalTukarBuku — Tukar Bukumu, Temukan Cerita Baru",
    template: "%s — FestivalTukarBuku",
  },
  description:
    "FestivalTukarBuku adalah komunitas untuk menemukan cerita baru dengan menukar buku yang sudah selesai Anda baca, tanpa biaya.",
};

export const viewport: Viewport = {
  themeColor: "#f5faff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
