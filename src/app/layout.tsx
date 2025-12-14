import type { Metadata } from "next";
import { geom } from "@/lib/fonts";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";

const SchibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const MartianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cup WebApp",
  description: "Cup tournament web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geom.variable} ${MartianMono.variable} ${SchibstedGrotesk.variable} min-h-screen antialiased`}
      >
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
