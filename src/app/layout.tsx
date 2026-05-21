import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PetFeeder Pro — Alimentación Inteligente para tu Mascota",
  description:
    "Plataforma IoT para controlar, programar y monitorear la alimentación de tu mascota desde cualquier lugar. Tecnología ESP32 con MQTT.",
  keywords: [
    "pet feeder",
    "IoT",
    "ESP32",
    "MQTT",
    "mascota",
    "dispensador",
    "automatizado",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
