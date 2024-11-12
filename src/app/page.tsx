"use client";
import { Monomaniac_One } from "next/font/google";
import Head from "next/head";
import { motion } from "framer-motion";

const MonomaniacOne = Monomaniac_One({
  weight: "400",
  subsets: ["latin"],
});

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Home() {
  return (
    <>
      <Head>
        <title>My Tools Box</title>
        <meta name="description" content="My Tools Box" />
      </Head>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] text-white">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <motion.div
            className={`text-7xl font-bold ${MonomaniacOne.className} drop-shadow-lg`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            my tools box
          </motion.div>
          <motion.ol
            className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] bg-white bg-opacity-20 p-4 rounded-lg shadow-md"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.li className="mb-2" variants={fadeInUp}>
              このツールボックスを使って、さまざまな開発ツールやリソースにアクセスできます。
            </motion.li>
            <motion.li variants={fadeInUp}>
              ツールを選んで、すぐに使い始めましょう。
            </motion.li>
          </motion.ol>
          <motion.div
            className="flex gap-4 items-center flex-col sm:flex-row"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.a
              className="rounded-full border border-white transition-colors flex items-center justify-center hover:bg-white hover:text-black text-sm sm:text-base h-12 px-5 sm:min-w-44 shadow-lg"
              href="/idea-manager"
              rel="noopener noreferrer"
              variants={fadeInUp}
            >
              Idea Manager
            </motion.a>
            <motion.a
              className="rounded-full border border-white transition-colors flex items-center justify-center hover:bg-white hover:text-black text-sm sm:text-base h-12 px-5 sm:min-w-44 shadow-lg"
              href="/image-converter"
              rel="noopener noreferrer"
              variants={fadeInUp}
            >
              Image Converter
            </motion.a>
            <motion.a
              className="rounded-full border border-white transition-colors flex items-center justify-center hover:bg-white hover:text-black text-sm sm:text-base h-12 px-5 sm:min-w-44 shadow-lg"
              href="https://tool3.example.com"
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeInUp}
            >
              ツール3
            </motion.a>
          </motion.div>
        </main>
      </div>
    </>
  );
}
