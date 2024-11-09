"use client";
import { useState } from 'react';
import { Monomaniac_One } from 'next/font/google';

const MonomaniacOne = Monomaniac_One({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  const [backgroundImage, setBackgroundImage] = useState('');

  const handleMouseEnter = (imageUrl: string) => {
    setBackgroundImage(`url(${imageUrl})`);
  };

  const handleMouseLeave = () => {
    setBackgroundImage('');
  };

  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] text-white"
      style={{
        backgroundImage: backgroundImage || 'linear-gradient(to right, #3b82f6, #8b5cf6)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className={`text-7xl font-bold ${MonomaniacOne.className} drop-shadow-lg`}>my tools box</div>
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
            onMouseEnter={() => handleMouseEnter('/idea-manager.png')}
            onMouseLeave={handleMouseLeave}
          >
            Idea Manager
          </a>
          <a
            className="rounded-full border border-white transition-colors flex items-center justify-center hover:bg-white hover:text-black text-sm sm:text-base h-12 px-5 sm:min-w-44 shadow-lg"
            href="https://tool2.example.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => handleMouseEnter('/images/tool2.jpg')}
            onMouseLeave={handleMouseLeave}
          >
            ツール2
          </a>
          <a
            className="rounded-full border border-white transition-colors flex items-center justify-center hover:bg-white hover:text-black text-sm sm:text-base h-12 px-5 sm:min-w-44 shadow-lg"
            href="https://tool3.example.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => handleMouseEnter('/images/tool3.jpg')}
            onMouseLeave={handleMouseLeave}
          >
            ツール3
          </a>
        </div>
      </main>
    </div>
  );
}
