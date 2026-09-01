"use client";

import Link from "next/link";
import { useState } from "react";
import { Playwrite_DE_LA } from "next/font/google";

const playwrite = Playwrite_DE_LA({
  display: "swap", // Спочатку показати текст системним шрифтом,
  //  а коли Playwrite завантажиться — замінити його на Playwrite.
});

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className={`${playwrite.className} text-2xl`}>
          Roman Real Estate
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/properties"
            className="text-sm font-medium transition-opacity hover:opacity-70"
          >
            Properties
          </Link>

          <Link
            href="/agents"
            className="text-sm font-medium transition-opacity hover:opacity-70"
          >
            Agents
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium transition-opacity hover:opacity-70"
          >
            About
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium transition-opacity hover:opacity-70"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-border md:hidden">
          <nav className="flex flex-col px-6 py-6">
            <Link
              href="/properties"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-border py-4 text-sm font-medium"
            >
              Properties
            </Link>

            <Link
              href="/agents"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-border py-4 text-sm font-medium"
            >
              Agents
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-border py-4 text-sm font-medium"
            >
              About
            </Link>

            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="py-4 text-sm font-medium"
            >
              Login
            </Link>

            <Link
              href="/signup"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 rounded-lg bg-primary px-5 py-3 text-center text-sm font-medium text-white"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
