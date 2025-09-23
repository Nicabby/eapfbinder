'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PrintPageButtonProps {
  pageTitle?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export default function PrintPageButton({
  pageTitle = 'Page',
  className,
  variant = 'outline',
  size = 'default'
}: PrintPageButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrintPage = async () => {
    setIsGenerating(true);

    try {
      // Find the main content area (PagePaper component content)
      const contentElement = document.querySelector('main') || document.body;

      // Temporarily remove the print button from the captured content
      const printButtons = contentElement.querySelectorAll('[data-print-button]');
      printButtons.forEach(button => {
        (button as HTMLElement).style.display = 'none';
      });

      // Temporarily enable print styles for better PDF output
      const printStyleOverrides = document.createElement('style');
      printStyleOverrides.innerHTML = `
        @media screen {
          body {
            background: white !important;
          }
          main {
            background: white !important;
            box-shadow: none !important;
            border: none !important;
          }
          .bg-slate-50 {
            background: white !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `;
      document.head.appendChild(printStyleOverrides);

      // Generate canvas from the content
      const canvas = await html2canvas(contentElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: contentElement.scrollWidth,
        height: contentElement.scrollHeight
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      // Calculate dimensions to fit the page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate scaling to fit within margins
      const margin = 10;
      const maxWidth = pageWidth - (margin * 2);
      const maxHeight = pageHeight - (margin * 2);

      const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      // Center the image on the page
      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;

      // Add the image to PDF
      pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);

      // Save the PDF
      const filename = `${pageTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      pdf.save(filename);

      // Clean up
      document.head.removeChild(printStyleOverrides);
      printButtons.forEach(button => {
        (button as HTMLElement).style.display = '';
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handlePrintPage}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className={className}
      data-print-button="true"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </>
      )}
    </Button>
  );
}