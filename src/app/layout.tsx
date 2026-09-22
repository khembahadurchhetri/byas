import type { Metadata } from "next";
import "./globals.css";

import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Mahila SACCOS",
  description:
    "Mahila Saving and Credit Cooperative Society Ltd.",
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