import type { Metadata } from "next";
import { Lexend, Source_Sans_3, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const atkinson = Atkinson_Hyperlegible({
  weight: ['400', '700'],
  variable: "--font-atkinson",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barangay Information System | Digital Governance",
  description: "A comprehensive digital solution for efficient Barangay management, resident records, and community services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} ${sourceSans.variable} ${atkinson.variable} h-full antialiased`}
    >
      <body className="min-h-full font-atkinson text-slate-900 bg-slate-50">{children}</body>
    </html>
  );
}
