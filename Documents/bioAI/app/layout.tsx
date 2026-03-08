import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BioAI Microplastic Capture",
  description: "AI-driven simulation evolving biodegradable multicellular structures to capture microplastics in water",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
