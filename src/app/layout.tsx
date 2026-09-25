import type { Metadata } from "next";
import {
  Inter,
  Manrope,
} from "next/font/google";

import "./globals.css";

import SiteShell from "@/components/SiteShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Byas SACCOS",
  description:
    "Byas Saving & Credit Co-Operative Ltd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable}`}
    >
      <body className="bg-white text-gray-900 ">
        <SiteShell>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}