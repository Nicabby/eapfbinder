'use client';

import { useState } from 'react';
import PDFPasswordPrompt from './PDFPasswordPrompt';

interface ProtectedPDFLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function ProtectedPDFLink({ href, children, className }: ProtectedPDFLinkProps) {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if this is a PDF file that needs protection
    const isPDF = href.endsWith('.pdf');
    const isProtected = href.includes('/resources/');
    
    if (isPDF && isProtected) {
      setShowPasswordPrompt(true);
    } else {
      // For non-protected files, open normally
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePasswordSuccess = (password: string) => {
    // Get PDF filename from href
    const pdfName = href.split('/').pop();
    
    if (!pdfName) {
      console.error('Could not extract PDF name from href');
      return;
    }

    // Verify password and get access token
    fetch('/api/verify-pdf-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pdfName,
        password,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success && data.accessToken) {
        // Open PDF with access token
        const protectedUrl = `/api/protected-pdf?pdf=${encodeURIComponent(pdfName)}&token=${encodeURIComponent(data.accessToken)}`;
        window.open(protectedUrl, '_blank', 'noopener,noreferrer');
      } else {
        console.error('Failed to get access token:', data.message);
      }
    })
    .catch(error => {
      console.error('Error verifying password:', error);
    });
  };

  return (
    <>
      <a
        href={href}
        onClick={handleClick}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
      
      <PDFPasswordPrompt
        isOpen={showPasswordPrompt}
        onClose={() => setShowPasswordPrompt(false)}
        onSuccess={handlePasswordSuccess}
        pdfName={href.split('/').pop() || ''}
      />
    </>
  );
}