"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-base">
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} flex h-screen bg-base text-primary`}
      >
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 bg-surface">
          {children}
        </main>
      </body>
    </html>
  );
}
