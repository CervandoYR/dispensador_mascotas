import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import FloatingKibbles from "@/components/layout/FloatingKibbles";
import "./globals.css";

export const metadata: Metadata = {
  title: "PetFeeder Pro — Plataforma IoT de Nutrición Inteligente",
  description:
    "Plataforma IoT de grado industrial para alimentación automatizada de mascotas. Monitoreo MQTT en tiempo real, visión ESP32-CAM, analítica HX711 e identificación RFID.",
  keywords: [
    "dispensador mascotas",
    "IoT",
    "ESP32",
    "MQTT",
    "alimentación inteligente",
    "HX711",
    "RFID",
    "ESP32-CAM",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <FloatingKibbles />
          <div className="glow-mesh" />
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
