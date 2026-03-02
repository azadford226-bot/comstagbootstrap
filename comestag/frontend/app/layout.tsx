import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/molecules/navbar";
import ConditionalFooter from "@/components/molecules/conditional-footer";
import DevModeInitializer from "@/components/dev-mode-initializer";
import EnvDebugger from "@/components/env-debugger";
import VercelAnalytics from "@/components/vercel-analytics";
import DevAutoLoginHelper from "@/components/dev-auto-login-helper";

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
        <EnvDebugger />
        <DevModeInitializer />
        <DevAutoLoginHelper />
        <Navbar />
        {children}
        <ConditionalFooter />
        <VercelAnalytics />
      </body>
    </html>
  );
}
