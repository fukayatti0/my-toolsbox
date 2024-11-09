"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Monomaniac_One } from "next/font/google";
import Image from "next/image";
import { useState } from "react";

const MonomaniacOne = Monomaniac_One({
  weight: "400",
  subsets: ["latin"],
});

export default function Header() {
  const { data: session } = useSession();
  const [showSignOut, setShowSignOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const MenuItems = () => (
    <>
      <Link
        href="/idea-manager"
        className="relative px-4 py-2 group transition-all duration-300"
      >
        <span className="relative z-10 text-white group-hover:text-gray-800">
          Idea Manager
        </span>
        <div className="absolute inset-0 h-full w-0 bg-white rounded-lg transition-all duration-300 group-hover:w-full"></div>
      </Link>
      {/* Add more links here */}
    </>
  );

  const HamburgerButton = () => (
    <button
      type="button"
      aria-label="Toggle navigation menu"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="md:hidden p-2 transition-transform duration-300 hover:scale-110"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isMenuOpen ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  );

  if (session) {
    return (
      <header className="fixed top-0 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-4 shadow-lg z-50 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className={`text-4xl font-bold ${MonomaniacOne.className} hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300`}
            >
              My tools box
            </Link>
          </div>

          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:flex w-full md:w-auto md:items-center mt-4 md:mt-0 transition-all duration-300`}
          >
            <nav className="flex flex-col md:flex-row gap-4">
              <MenuItems />
            </nav>
          </div>

          <div className="relative">
            <Image
              src={session.user?.image || "/default-image.png"}
              alt="User Image"
              width={50}
              height={50}
              className="rounded-full cursor-pointer border-2 border-white hover:border-blue-400 transition-all duration-300 hover:scale-105"
              onClick={() => setShowSignOut(!showSignOut)}
            />
            {showSignOut && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm text-gray-800 rounded-lg shadow-xl transform transition-all duration-300"
                onBlur={() => setShowSignOut(false)}
                tabIndex={0}
              >
                <button
                  onClick={() => signOut()}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <div className="text-sm font-normal">Signed in as</div>
                  <Link
                    href={`https://github.com/${session.user?.name}`}
                    className="font-bold hover:text-blue-600"
                  >
                    {session.user?.name}
                  </Link>
                  <div className="text-red-600 hover:text-red-700">Sign out</div>
                </button>
              </div>
            )}
          </div>
          <HamburgerButton />
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-4 shadow-lg z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <div className={`text-4xl font-bold ${MonomaniacOne.className} text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500`}>
            My tools box
          </div>
          <HamburgerButton />
        </div>

        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex w-full md:w-auto md:items-center mt-4 md:mt-0 transition-all duration-300`}
        >
          <nav className="flex flex-col md:flex-row gap-4">
            <MenuItems />
          </nav>
        </div>

        <Link
          href="/auth/signin"
          className="relative px-6 py-2 group overflow-hidden rounded-lg transition-all duration-300 hover:scale-105"
        >
          <span className="relative z-10 text-white group-hover:text-gray-800">
            Sign in
          </span>
          <div className="absolute inset-0 h-full w-0 bg-white transition-all duration-300 group-hover:w-full"></div>
        </Link>
      </div>
    </header>
  );
}
