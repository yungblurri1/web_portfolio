"use client"

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-24">
        {/* Left side */}
        <div>
          <h2 className="text-2xl font-semibold">Dominic Hauser Portfolio</h2>
        </div>

        {/* Right side */}
        <div className="flex gap-8">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
