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

export default function AuthStatus() {
  const { data: session } = useSession();
  const [showSignOut, setShowSignOut] = useState(false);

  if (session) {
    return (
      <header className="fixed top-0 w-full bg-gray-800 text-white p-4 shadow-md z-50">
        <div className="container mx-auto flex gap-4 items-center justify-between">
          <Link 
          href="/"
          className={`text-4xl font-bold ${MonomaniacOne.className}`}>
            My tools box
          </Link>
          <div className="flex gap-4">
            <Link
              href="/idea-manager"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Idea Manager
            </Link>
            {/* Add more links here */}
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
                <Link href={`https://github.com/${session.user?.name}`} className="font-bold">
                {session.user?.name}
                </Link>
                <div className="text-red-600">Sign out</div>
              </button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }
  return (
    <header className="fixed top-0 w-full bg-gray-800 text-white p-4 shadow-md z-50">
      <div className="container mx-auto flex gap-4 items-center justify-between">
        <div className={`text-4xl font-bold ${MonomaniacOne.className}`}>
          My tools box
        </div>
        <div className="flex gap-4">
          <Link
            href="/idea-manager"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Idea Manager
          </Link>
          {/* Add more links here */}
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
