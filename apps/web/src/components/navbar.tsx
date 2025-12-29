'use client';

import { UserButton } from '@clerk/nextjs';
import { FolderOpen, Plus, Presentation } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export function Navbar() {
  return (
    <nav className="border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Presentation className="h-6 w-6 text-[var(--primary)]" />
              <span className="font-semibold text-lg">PitchDeck</span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="h-4 w-4" />
                  Projects
                </span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/projects/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                New Project
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  );
}
