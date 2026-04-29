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
      <body style={{ background: '#0a0a1a', margin: 0, padding: 0, overflowX: 'hidden' }} suppressHydrationWarning>
        <div style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '177.78vh',
            height: '100%',
            maxHeight: '56.25vw',
            aspectRatio: '16 / 9',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <AuthProvider>
              {children}
              <AIChat />
            </AuthProvider>
          </div>
        </div>
      </body>
    </html>
  );
}