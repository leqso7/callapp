import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cal AI - კალორიების მართვის აპლიკაცია",
  description: "AI-ზე დაფუძნებული კალორიების მართვის აპლიკაცია",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          {children}
        </main>
      </body>
    </html>
  );
}
