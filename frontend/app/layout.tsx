import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowCash - Mobile-First Payment Platform on Electroneum",
  description: "Send ETN, buy airtime, pay bills, and earn cashback. The future of mobile payments in Africa powered by Electroneum blockchain.",
  keywords: "FlowCash, ETN, Electroneum, mobile payments, Africa, airtime, bill payments, cryptocurrency",
  authors: [{ name: "FlowCash Team" }],
  openGraph: {
    title: "FlowCash - Mobile-First Payment Platform on Electroneum",
    description: "Send ETN, buy airtime, pay bills, and earn cashback. The future of mobile payments in Africa.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowCash - Mobile-First Payment Platform on Electroneum",
    description: "Send ETN, buy airtime, pay bills, and earn cashback. The future of mobile payments in Africa.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
