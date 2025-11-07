import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pragati - Your Next-Gen Health Partner",
  description:
    "Advanced AI-powered health monitoring and analysis platform. Track your vital signs, get instant health insights, and maintain your well-being with Pragati.",
  keywords:
    "health monitoring, AI health, vital signs, health analysis, wellness tracker",
  authors: [{ name: "Pragati Team" }],
  openGraph: {
    title: "Pragati - Your Next-Gen Health Partner",
    description: "Advanced AI-powered health monitoring and analysis platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
