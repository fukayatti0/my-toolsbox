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
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Idea Manager
      </Link>
      {/* Add more links here */}
    </>
  );

  const HamburgerButton = () => (
    <button
      type="button"
      aria-label="Toggle navigation menu"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="md:hidden p-2"
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
      <header className="fixed top-0 w-full bg-gray-800 text-white p-4 shadow-md z-50">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className={`text-4xl font-bold ${MonomaniacOne.className}`}
            >
              My tools box
            </Link>
          </div>

          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:flex w-full md:w-auto md:items-center mt-4 md:mt-0`}
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
              className="rounded-full cursor-pointer border-2 border-white"
              onClick={() => setShowSignOut(!showSignOut)}
            />
            {showSignOut && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg"
                onBlur={() => setShowSignOut(false)}
                tabIndex={0}
              >
                <button
                  onClick={() => signOut()}
                  type="button"
                  className="w-full text-left px-4 py-2"
                >
                  <div className="text-sm font-normal">Signed in as</div>
                  <Link
                    href={`https://github.com/${session.user?.name}`}
                    className="font-bold"
                  >
                    {session.user?.name}
                  </Link>
                  <div className="text-red-600">Sign out</div>
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
    <header className="fixed top-0 w-full bg-gray-800 text-white p-4 shadow-md z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <div className={`text-4xl font-bold ${MonomaniacOne.className}`}>
            My tools box
          </div>
          <HamburgerButton />
        </div>

        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex w-full md:w-auto md:items-center mt-4 md:mt-0`}
        >
          <nav className="flex flex-col md:flex-row gap-4">
            <MenuItems />
          </nav>
        </div>

        <Link
          href="/auth/signin"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}
