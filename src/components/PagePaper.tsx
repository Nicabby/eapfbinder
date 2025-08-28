'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PagePaperProps {
  children: ReactNode;
  className?: string;
  _showRings?: boolean;
}

export default function PagePaper({ 
  children, 
  className, 
  _showRings = true 
}: PagePaperProps) {
  return (
    <main className={cn('flex-1 relative min-h-screen bg-slate-50', className)}>
      <div className="max-w-4xl mx-auto px-8 py-12">
        {children}
      </div>
    </main>
  );
}