import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoiceTask AI - AI Voice Receptionist for Service Businesses",
  description: "Never miss a customer call again. AI-powered voice receptionist that converts calls into structured tasks automatically. Built for local service businesses.",
  keywords: ["AI receptionist", "voice intelligence", "task automation", "service business", "call management"],
  authors: [{ name: "VoiceTask AI" }],
  openGraph: {
    title: "VoiceTask AI - AI Voice + Task Intelligence Platform",
    description: "Convert phone calls into structured action items automatically. 95%+ accuracy.",
    type: "website",
  },
};

import { AuthProvider } from "./context/AuthContext";

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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
