import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Malim Energy | Swiss EV Charging Subsidy Explorer",
  description: "Entdecken Sie Subventionen für Elektrofahrzeug-Ladeinfrastruktur in der Schweiz. Interaktive Karte mit kantonalen Förderprogrammen.",
  keywords: "EV charging, Switzerland, subsidies, Ladeinfrastruktur, Subventionen, Malim, E-Mobilität, Elektrofahrzeug, Förderung",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Malim Energy | Swiss EV Charging Subsidy Explorer",
    description: "Discover subsidies for electric vehicle charging infrastructure across Switzerland.",
    siteName: "Malim Energy",
    locale: "de_CH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Malim Energy | Swiss EV Charging Subsidy Explorer",
    description: "Discover subsidies for electric vehicle charging infrastructure across Switzerland.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
