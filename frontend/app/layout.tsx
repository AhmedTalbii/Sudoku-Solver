import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sudoku Solver – Fast, Accurate & Reliable",
  description:
    "Experience the ultimate online Sudoku solver that overcomes the common pitfalls of other solvers. Our tool delivers fast, accurate, and bug-free solutions to all Sudoku puzzles.",
  keywords:
    "Sudoku solver, online Sudoku solver, solve Sudoku puzzles, fast Sudoku solver, accurate Sudoku solver, reliable Sudoku, puzzle solver, troubleshooting Sudoku errors",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1.0",
  authors: [{ name: "AhmedTalbii" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
