'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Download, AlertCircle } from 'lucide-react';

interface ProtectedPDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  pdfName: string;
}

export default function ProtectedPDFViewer({
  isOpen,
  onClose,
  pdfUrl,
  pdfName
}: ProtectedPDFViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    // Reset states when opening
    setLoadError(false);
    setIsLoading(true);

    // Set a timeout to detect if iframe fails to load
    const loadTimeout = setTimeout(() => {
      if (isLoading) {
        setLoadError(true);
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    // Disable print functionality
    const disablePrint = () => {
      // Block Ctrl+P and Cmd+P
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
          e.preventDefault();
          e.stopPropagation();
          alert('Printing is disabled for this document.');
          return false;
        }
      };

      // Block right-click context menu
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };

      // Block F12 and other dev tools shortcuts
      const handleDevTools = (e: KeyboardEvent) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.key === 'u')
        ) {
          e.preventDefault();
          return false;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleDevTools);

      // Try to disable print in iframe if same origin
      if (iframeRef.current) {
        try {
          const iframeWindow = iframeRef.current.contentWindow;
          if (iframeWindow) {
            iframeWindow.addEventListener('keydown', handleKeyDown);
            iframeWindow.addEventListener('contextmenu', handleContextMenu);

            // Override print function
            iframeWindow.print = () => {
              alert('Printing is disabled for this document.');
            };
          }
        } catch {
          // Cross-origin restrictions prevent access
          console.log('Cannot access iframe content due to cross-origin restrictions');
        }
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleDevTools);
      };
    };

    const cleanup = disablePrint();

    return () => {
      clearTimeout(loadTimeout);
      if (cleanup) cleanup();
    };
  }, [isOpen, isLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-800">{pdfName}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-600 font-medium">🚫 Print Disabled</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading protected document...</p>
              </div>
            </div>
          )}

          {loadError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center max-w-md mx-auto p-6">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Unable to display PDF in viewer
                </h3>
                <p className="text-gray-600 mb-4">
                  The PDF cannot be displayed inline. Click below to download and view in your default PDF viewer.
                </p>
                <a
                  href={pdfUrl}
                  download={pdfName}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download {pdfName}
                </a>
                <p className="text-xs text-red-600 mt-3">
                  Remember: This document is protected and cannot be printed.
                </p>
              </div>
            </div>
          ) : (
            <>
              <iframe
                ref={iframeRef}
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                className="w-full h-full border-0"
                title={pdfName}
                style={{
                  // Additional security styles
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none'
                }}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setLoadError(true);
                  setIsLoading(false);
                }}
              />

              {/* Print blocking overlay - invisible but captures events */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'transparent',
                  zIndex: 1
                }}
                onContextMenu={(e) => e.preventDefault()}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              📄 EAP Facilitator Training Resource - View Only
            </div>
            <div className="text-xs text-red-600">
              This document is protected and cannot be printed, downloaded, or copied.
            </div>
          </div>
        </div>
      </div>

      {/* Print blocking styles */}
      <style jsx>{`
        @media print {
          * {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}