import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import AIChat from "@/components/AIChat";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "LastMinute - Book beauty in seconds",
  description: "Last-minute beauty appointments. Book in 60 seconds. Available now.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ background: '#0a0a1a', minHeight: '100vh', margin: 0, padding: 0, overflowX: 'hidden' }} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <AIChat />
        </AuthProvider>
      </body>
    </html>
  );
}