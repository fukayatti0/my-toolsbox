import localFont from "next/font/local";
import "./globals.css";
import NextAuthProvider from "@/components/NextAuthProvider";
import Header from "@/components/header";
import Head from "next/head";
import { useEffect } from "react";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  }, []);

  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <title>My Tools Box</title>
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextAuthProvider>
          <Header /> {/* Adjust the margin-top value as needed */}
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}