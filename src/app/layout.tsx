import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import { Suspense } from "react";
import { AppProviders } from "@/components/AppProviders";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Parampara Path — Living Heritage Compass",
  description:
    "Unofficial learner tool for Indian living heritage: attributed cards, grounded Q&A, quizzes, and a human-reviewed contribution queue.",
  applicationName: "Parampara Path",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
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
  themeColor: "#2f4f8a",
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
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${fraunces.variable} ${figtree.variable} antialiased`}>
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
