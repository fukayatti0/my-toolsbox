"use client";

import Head from "next/head";
import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setUpProviders();
  }, []);

  if (!providers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sign In</title>
        <meta name="description" content="サインインしてください" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-2">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
            ログイン
          </h1>
          {Object.values(providers).map((provider: any) => (
            <div key={provider.name} className="w-full mb-4">
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              >
                <img
                  src={`https://skillicons.dev/icons?i=${provider.name.toLowerCase()}`}
                  alt={`${provider.name} icon`}
                  className="w-6 h-6 mr-2"
                />
                {provider.name}でログイン
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
