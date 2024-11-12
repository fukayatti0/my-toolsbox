'use client';
import localFont from "next/font/local";
import "./globals.css";
import NextAuthProvider from "@/components/NextAuthProvider";
import Header from "@/components/header";
import Head from "next/head";
import { useEffect } from "react";

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
      <body className="relative min-h-screen overflow-hidden antialiased">
        <div className="absolute inset-0 z-0 starry-background"></div>
        <div className="relative z-10">
          <NextAuthProvider>
            <Header />
            {children}
          </NextAuthProvider>
        </div>
        <style jsx>{`
          .starry-background {
            position: absolute;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, white 1px, transparent 1px);
            background-size: 50px 50px;
            animation: starryAnimation 100s linear infinite;
          }

          @keyframes starryAnimation {
            from {
              transform: translate(-50%, -50%);
            }
            to {
              transform: translate(50%, 50%);
            }
          }
        `}</style>
      </body>
    </html>
  );
}