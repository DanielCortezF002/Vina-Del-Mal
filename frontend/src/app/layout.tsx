import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AgeVerificationModal from "@/components/AgeVerificationModal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Viña del Mal",
  description: "Plataforma multi-tenant para botillerías independientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn("dark", inter.variable, playfair.variable)}>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        {children}
        <AgeVerificationModal />
      </body>
    </html>
  );
}
