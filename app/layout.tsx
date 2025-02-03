import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Providers from "./providers";

const font = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monitoramento de Diabetes",
  description: "Sistema de monitoramento de diabetes e medicações",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <SettingsProvider>{children}</SettingsProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
