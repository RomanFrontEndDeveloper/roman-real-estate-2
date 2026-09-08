"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Playwrite_DE_LA } from "next/font/google";

import Image from "next/image";

import Button from "@/components/ui/Button";

import { apiFetch } from "@/lib/apiFetch";

const playwrite = Playwrite_DE_LA({
  display: "swap",
});

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "agency" | "agent" | "owner-client";
  phone?: string;
  bio?: string;
  avatar?: {
    url: string;
    publicId: string;
  };
};

type MeResponse = {
  user: User;
};

export default function Header() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      try {
        const response = await apiFetch("/api/auth/me");

        if (!response.ok) {
          sessionStorage.removeItem("accessToken");

          setIsLoggedIn(false);
          setUser(null);

          window.dispatchEvent(new Event("auth-change"));

          return;
        }

        const data: MeResponse = await response.json();

        setIsLoggedIn(true);
        setUser(data.user);
      } catch {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("auth-change", loadUser);
    window.addEventListener("profile-change", loadUser);

    return () => {
      window.removeEventListener("auth-change", loadUser);
      window.removeEventListener("profile-change", loadUser);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      sessionStorage.removeItem("accessToken");

      setIsLoggedIn(false);
      setUser(null);

      window.dispatchEvent(new Event("auth-change"));

      router.push("/");
    }
  };

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
            href="/"
            className="text-sm font-medium transition-opacity hover:opacity-70"
          >
            Properties
          </Link>

          <Link
            href="/profile"
            className="text-sm font-medium transition-opacity hover:opacity-70"
          >
            Profile
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
          {isLoggedIn ? (
            <>
              {/* Avatar */}
              <Link
                href="/profile"
                className="flex items-center"
                aria-label="Profile"
              >
                {user?.avatar?.url ? (
                  <Image
                    src={user.avatar.url}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
                    {user?.name
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
              </Link>

              {/* Logout */}
              <Button type="button" variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium transition-opacity hover:opacity-70"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
              >
                Get Started
              </Link>
            </>
          )}
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
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-border py-4 text-sm font-medium"
            >
              Properties
            </Link>

            <Link
              href="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-border py-4 text-sm font-medium"
            >
              Profile
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

            {isLoggedIn ? (
              <>
                {/* Mobile Avatar */}
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 border-b border-border py-4"
                >
                  {user?.avatar?.url ? (
                    <Image
                      src={user.avatar.url}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
                      {user?.name
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}

                  <span className="text-sm font-medium">{user?.name}</span>
                </Link>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="mt-4"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-4 text-sm font-medium"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-2 rounded-lg bg-primary px-5 py-3 text-center text-sm font-medium text-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
