"use client";
import { Monomaniac_One } from "next/font/google";
import Head from "next/head";

const MonomaniacOne = Monomaniac_One({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Head>
        <title>My Tools Box</title>
        <meta name="description" content="My Tools Box" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-cover bg-center">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div
            className={`text-7xl font-bold ${MonomaniacOne.className} drop-shadow-lg`}
          >
            my tools box
          </div>
          <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] bg-white bg-opacity-20 p-4 rounded-lg shadow-md">
            <li className="mb-2">
              このツールボックスを使って、さまざまな開発ツールやリソースにアクセスできます。
            </li>
            <li>ツールを選んで、すぐに使い始めましょう。</li>
          </ol>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a
              className="rounded-full border border-white transition-colors flex items-center justify-center hover:bg-white hover:text-black text-sm sm:text-base h-12 px-5 sm:min-w-44 shadow-lg"
              href="/idea-manager"
              target="_blank"
              rel="noopener noreferrer"
            >
              Idea Manager
            </a>
            <a
              className="rounded-full border border-white transition-colors flex items-center justify-center hover:bg-white hover:text-black text-sm sm:text-base h-12 px-5 sm:min-w-44 shadow-lg"
              href="/image-converter"
              target="_blank"
              rel="noopener noreferrer"
            >
              ツール2
            </a>
            <a
              className="rounded-full border border-white transition-colors flex items-center justify-center hover:bg-white hover:text-black text-sm sm:text-base h-12 px-5 sm:min-w-44 shadow-lg"
              href="https://tool3.example.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              ツール3
            </a>
          </div>
        </main>
      </div>
    </>
  );
}
