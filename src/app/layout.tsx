import localFont from "next/font/local";
import "./globals.css";
import NextAuthProvider from '@/components/NextAuthProvider'
import Header from '@/components/header'

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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <Header />
          <div className="main-content mt-16"> {/* Adjust the margin-top value as needed */}
            {children}
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
