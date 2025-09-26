'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import PrintPageButton from './PrintPageButton';
import { FEATURES } from '@/config/features';

interface PagePaperProps {
  children: ReactNode;
  className?: string;
  pageTitle?: string;
  showPrintButton?: boolean;
}

export default function PagePaper({
  children,
  className,
  pageTitle = 'Page',
  showPrintButton = true
}: PagePaperProps) {
  return (
    <main className={cn('flex-1 relative min-h-screen bg-slate-50', className)}>
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Print Button - Positioned at top right */}
        {showPrintButton && FEATURES.PDF_EXPORT && (
          <div className="flex justify-end mb-4">
            <PrintPageButton
              pageTitle={pageTitle}
              variant="outline"
              size="sm"
            />
          </div>
        )}
        {children}
      </div>
    </main>
  );
}