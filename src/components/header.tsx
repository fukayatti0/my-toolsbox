"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Monomaniac_One } from "next/font/google";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const monomaniacOne = Monomaniac_One({
  weight: "400",
  subsets: ["latin"],
});

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const NavigationLinks = () => (
    <>
      <Link
        href="/idea-manager"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
      >
        Idea Manager
      </Link>
      <Link
        href="/image-converter"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
      >
        Idea Manager
      </Link>
      {/* Add more navigation links here */}
    </>
  );

  const MobileMenu = () => (
    <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
      <div className="px-2 pt-2 pb-3 space-y-1">
        <NavigationLinks />
      </div>
    </div>
  );

  const UserMenu = () => (
    <div className="relative">
      <button
        type="button"
        aria-label="Open user menu"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <Image
          src={session?.user?.image || "/default-avatar.png"}
          alt="User avatar"
          width={32}
          height={32}
          className="rounded-full border-2 border-gray-600 hover:border-blue-500 transition-colors duration-200"
        />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-2 text-sm text-gray-700">
            <p className="font-medium text-gray-900">Signed in as</p>
            <p className="truncate">{session?.user?.name}</p>
          </div>
          <div className="border-t border-gray-200">
            <button
              onClick={() => signOut()}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-gray-800 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className={`text-white text-xl font-bold ${monomaniacOne.className}`}>My Tools Box</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavigationLinks />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {session ? (
              <UserMenu />
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Sign in
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <MobileMenu />
      </nav>
    </header>
  );
}
