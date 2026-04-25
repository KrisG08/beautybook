import type { Metadata } from "next";
import "./globals.css";

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
      <body style={{ background: '#FFFBFA', minHeight: '100vh', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}