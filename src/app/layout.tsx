import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EAP Facilitator Binder",
  description: "A comprehensive development program for effective facilitation skills",
  manifest: "/manifest.json",
};

export function generateViewport() {
  return {
    themeColor: "#467edd",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EAP Binder" />

        {/* Print Protection Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Disable print functionality
              (function() {
                // Override print function
                window.print = function() {
                  alert('Printing is disabled for this application.');
                };

                // Block print shortcuts
                document.addEventListener('keydown', function(e) {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                    e.preventDefault();
                    e.stopPropagation();
                    alert('Printing is disabled for this application.');
                    return false;
                  }

                  // Block some dev tools shortcuts
                  if (e.key === 'F12' ||
                      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                      (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                      (e.ctrlKey && e.key === 'u')) {
                    e.preventDefault();
                    return false;
                  }
                });

                // Block right-click context menu
                document.addEventListener('contextmenu', function(e) {
                  e.preventDefault();
                  return false;
                });

                // Hide print buttons in toolbar if any
                document.addEventListener('DOMContentLoaded', function() {
                  const style = document.createElement('style');
                  style.textContent = \`
                    *[title*="print" i],
                    *[aria-label*="print" i] {
                      display: none !important;
                    }
                  \`;
                  document.head.appendChild(style);
                });
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
