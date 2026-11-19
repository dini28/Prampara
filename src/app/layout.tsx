import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces, Noto_Sans_Devanagari } from "next/font/google";
import { Suspense } from "react";
import { AppProviders } from "@/components/AppProviders";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { SkipToContent } from "@/components/SkipToContent";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-deva",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parampara Path: Living Heritage Compass",
  description:
    "Visit any place in India and understand it deeply: the culture of the whole state, the heritage of your city, the meaning behind what you see, the best food and travel, and the modern India growing beside it.",
  applicationName: "Parampara Path",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Parampara Path",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f1e6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no, email=no, address=no" />
      </head>
      <body
        className={`${fraunces.variable} ${figtree.variable} ${notoDevanagari.variable} ios-root antialiased`}
      >
        <SkipToContent />
        <SiteHeader />
        <Suspense fallback={null}>
          <AppProviders>{children}</AppProviders>
        </Suspense>
        <SiteFooter />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
