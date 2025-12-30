'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/navbar';

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPresentPage = pathname?.includes('/present');

  if (isPresentPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
