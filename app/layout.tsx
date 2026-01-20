import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { I18nProvider } from "@/ui/components/I18nProvider";
import { ThemeProvider } from "@/ui/components/ThemeProvider";
import { PageScrollArea } from "@/ui/components/PageScrollArea";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "О!СОБЫТИЕ",
    template: "%s | О!СОБЫТИЕ",
  },
  description: "Ваша ежемесячная порция 'Вау!' — коробка с уникальным впечатлением, которое приходит к вам раз в месяц.",
  keywords: ["события", "впечатления", "подарки", "подписка", "коробка впечатлений"],
  authors: [{ name: "О!СОБЫТИЕ" }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://osobytie.com",
    siteName: "О!СОБЫТИЕ",
    title: "О!СОБЫТИЕ — ваша ежемесячная порция 'Вау!'",
    description: "Ваша ежемесячная порция 'Вау!' — коробка с уникальным впечатлением, которое приходит к вам раз в месяц.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <I18nProvider>
          <ThemeProvider>
            <PageScrollArea>{children}</PageScrollArea>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
