import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPDEV AI — Brand Asset Generator",
  description: "Generate your logo, social media poster, and AI anchor video automatically from your business requirements using Gemini AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white">{children}</body>
    </html>
  );
}
