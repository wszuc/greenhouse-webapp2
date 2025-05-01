'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-white flex flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-4">
        Greenhouse Manager
      </h1>
      <p className="text-lg md:text-xl text-green-700 max-w-2xl mb-8">
        Nowoczesny system do zdalnego monitorowania i zarządzania Twoją szklarnią - z każdego miejsca na świecie.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/login"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl text-lg transition"
        >
          Zaloguj się
        </Link>
      </div>
    </main>
  );
}
