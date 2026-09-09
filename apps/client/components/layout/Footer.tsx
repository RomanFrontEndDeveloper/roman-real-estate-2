import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="font-serif text-2xl font-bold">Roman Real Estate</h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-secondary">
              Discover exceptional properties and find a place that feels like
              home.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold">Navigation</h3>

            <ul className="mt-4 space-y-3 text-sm text-secondary">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-foreground"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/property"
                  className="transition-colors hover:text-foreground"
                >
                  Property
                </Link>
              </li>

              <li>
                <Link
                  href="/profile"
                  className="transition-colors hover:text-foreground"
                >
                  Profile
                </Link>
              </li>

              <li>
                <Link
                  href="/agents"
                  className="transition-colors hover:text-foreground"
                >
                  Agents
                </Link>
              </li>

              
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold">Company</h3>

            <ul className="mt-4 space-y-3 text-sm text-secondary">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold">Contact</h3>

            <ul className="mt-4 space-y-3 text-sm text-secondary">
              <li>Kyiv, Ukraine</li>
              <li>hello@romanrealestate.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-sm text-secondary">
          © {new Date().getFullYear()} Roman Real Estate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
