import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-2xl font-normal tracking-tight"
        >
          Roman Real Estate
        </Link>

        <nav className="hidden md:flex items-center gap-8">
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

        <div className="hidden md:flex items-center gap-4">
          <a
            href="/login"
            className="text-sm font-medium transition-opacity hover:opacity-70"
          >
            Login
          </a>

          <a
            href="/signup"
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            Get Started
          </a>
        </div>
        
        <button type="button" className="md:hidden" aria-label="Open menu">
          ☰
        </button>
      </div>
    </header>
  );
}
