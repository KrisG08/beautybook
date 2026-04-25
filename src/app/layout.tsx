import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BeautyBook - Beauty Service Booking",
  description: "Book last-minute and up-to-one-week-ahead beauty and cosmetic services",
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