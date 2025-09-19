'use client';

import { useState } from 'react';
import PDFPasswordPrompt from './PDFPasswordPrompt';
import ProtectedPDFViewer from './ProtectedPDFViewer';

interface ProtectedPDFLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function ProtectedPDFLink({ href, children, className }: ProtectedPDFLinkProps) {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

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
        // Open PDF in protected viewer
        const protectedUrl = `/api/protected-pdf?pdf=${encodeURIComponent(pdfName)}&token=${encodeURIComponent(data.accessToken)}`;
        setPdfUrl(protectedUrl);
        setShowPDFViewer(true);
        setShowPasswordPrompt(false);
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

      <ProtectedPDFViewer
        isOpen={showPDFViewer}
        onClose={() => {
          setShowPDFViewer(false);
          setPdfUrl('');
        }}
        pdfUrl={pdfUrl}
        pdfName={href.split('/').pop() || ''}
      />
    </>
  );
}