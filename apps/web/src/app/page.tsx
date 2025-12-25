import Link from "next/link";
import { Presentation, Zap, Share2, FileDown } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--muted)]">
      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Presentation className="h-6 w-6 text-[var(--primary)]" />
              <span className="font-semibold text-lg">PitchDeck</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary)]/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Create stunning pitch decks
            <br />
            <span className="text-[var(--primary)]">in minutes</span>
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] mb-8">
            Build professional presentations for investors, customers, and leads.
            Auto-extract your branding, share with a link, and export to PDF.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/sign-up"
              className="px-6 py-3 bg-[var(--primary)] text-white font-medium rounded-lg hover:bg-[var(--primary)]/90 transition-colors"
            >
              Start Free
            </Link>
            <Link
              href="/sign-in"
              className="px-6 py-3 border border-[var(--border)] font-medium rounded-lg hover:bg-[var(--muted)] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Auto Branding</h3>
            <p className="text-[var(--muted-foreground)]">
              Enter your website URL and we&apos;ll extract your logo, colors, and fonts automatically.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Share2 className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Share Anywhere</h3>
            <p className="text-[var(--muted-foreground)]">
              Get a shareable link with beautiful preview cards for social media and messaging apps.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileDown className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <h3 className="font-semibold text-lg mb-2">PDF Export</h3>
            <p className="text-[var(--muted-foreground)]">
              Download your presentation as a PDF for offline viewing and printing.
            </p>
          </div>
        </div>

        {/* Audience Types */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Decks for every audience</h2>
          <p className="text-[var(--muted-foreground)] mb-8">
            Create tailored presentations for different stakeholders
          </p>
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { name: "Cold Leads", desc: "Quick hook & intro" },
              { name: "Customers", desc: "Problem & solution" },
              { name: "Investors", desc: "Traction & financials" },
              { name: "Custom", desc: "Build from scratch" },
            ].map((type) => (
              <div
                key={type.name}
                className="p-4 border border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-colors"
              >
                <h4 className="font-semibold">{type.name}</h4>
                <p className="text-sm text-[var(--muted-foreground)]">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Presentation className="h-5 w-5 text-[var(--muted-foreground)]" />
              <span className="text-sm text-[var(--muted-foreground)]">PitchDeck</span>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              Built for indie hackers and startups
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
