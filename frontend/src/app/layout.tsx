import type { Metadata } from "next";
import { Inter, Playfair_Display, Pacifico, Cinzel, Dancing_Script } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const pacifico = Pacifico({ weight: "400", subsets: ["latin"], variable: "--font-pacifico" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing" });

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
    <html lang="es" className={cn("dark", inter.variable, playfair.variable, pacifico.variable, cinzel.variable, dancing.variable)}>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans pt-20">
        <Header />
        {children}
        <Footer />
        <AgeVerificationModal />
      </body>
    </html>
  );
}

