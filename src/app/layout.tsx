import type { Metadata } from "next";
import "./globals.css";

import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Vyas Credits and Savings",
  description:
    "Vyas Saving & Credit Co-Operative Ltd.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <SiteShell>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}