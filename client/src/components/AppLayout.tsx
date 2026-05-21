import { ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "./ui/button";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-bold text-foreground hover:text-accent transition-colors">
            Misfit Ministries
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/prayer" className="text-sm font-medium hover:text-accent transition-colors">Prayer</Link>
            <Link href="/shine" className="text-sm font-medium hover:text-accent transition-colors">Shine</Link>
            <Link href="/wreckage" className="text-sm font-medium hover:text-accent transition-colors">The Wreckage</Link>
            <Link href="/armory" className="text-sm font-medium hover:text-accent transition-colors">The Armory</Link>
            <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors">About</Link>
          </div>

          <a
            href="tel:988"
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm md:text-base"
          >
            <span>988</span>
            <span className="hidden sm:inline">Crisis Line</span>
          </a>
        </div>
      </nav>

      <main className="flex-1 w-full">{children}</main>

      <footer className="border-t border-border bg-card text-card-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-serif text-lg font-bold mb-4">Misfit Ministries</h3>
              <p className="text-sm text-muted-foreground">
                A hospital for the broken. A beacon for humanity. Jesus Christ is the answer.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/prayer">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Prayer Wall</a>
                  </Link>
                </li>
                <li>
                  <Link href="/shine">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Testimonies</a>
                  </Link>
                </li>
                <li>
                  <Link href="/wreckage">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Crisis Resources</a>
                  </Link>
                </li>
                <li>
                  <Link href="/nura">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">Chat with Nura</a>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">In Crisis?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                You are not alone. Jesus sees you.
              </p>
              <a
                href="tel:988"
                className="inline-block px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
              >
                Call 988
              </a>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>
              Misfit Ministries — A hospital for the broken. A beacon for humanity.
            </p>
            <p className="mt-2">
              No user tracking. No data sold. Jesus Christ is the answer.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
