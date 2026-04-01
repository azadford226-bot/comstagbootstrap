import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/molecules/navbar";
import ConditionalFooter from "@/components/molecules/conditional-footer";
import VercelAnalytics from "@/components/vercel-analytics";
import { ToastProvider } from "@/components/ui/toast";

// Using system fonts instead of Google Fonts to avoid network issues during build
// Font variables will use CSS fallbacks
const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};

export const metadata: Metadata = {
  title: "Comstag",
  description: "Build your network of suppliers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content">{children}</main>
          <ConditionalFooter />
          <VercelAnalytics />
        </ToastProvider>
      </body>
    </html>
  );
}
