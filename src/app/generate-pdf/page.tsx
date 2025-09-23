'use client';

import { useState } from 'react';
import PagePaper from '@/components/PagePaper';
import { generateBinderPDF } from '@/utils/pdfGenerator';
import { Download, FileText, Loader2 } from 'lucide-react';

export default function GeneratePDFPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      await generateBinderPDF();
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PagePaper pageTitle="Generate PDF Binder" showPrintButton={false}>
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-10 w-10 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-800">Generate Binder PDF</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Create a comprehensive PDF version of the entire EAP Facilitator Development Program binder
          </p>
        </div>

        {/* Features */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">What&apos;s Included</h2>
          <div className="text-left space-y-2 text-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>Complete program overview and syllabus</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>All 7 training modules with detailed content</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>Learning objectives and key strategies</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>Resource lists and references</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>Table of contents for easy navigation</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="space-y-4">
          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className={`
              inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200
              ${isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg transform hover:scale-105'
              }
              text-white
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-6 w-6" />
                Generate & Download PDF
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Instructions</h3>
          <div className="text-blue-700 text-sm space-y-1 text-left">
            <p>1. Click the &quot;Generate &amp; Download PDF&quot; button above</p>
            <p>2. Wait for the PDF to be generated (this may take a few moments)</p>
            <p>3. The PDF will automatically download to your device</p>
            <p>4. Open the PDF to view your complete binder</p>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-700 text-sm">
            <strong>Note:</strong> The generated PDF will include all program content but not the individual resource files.
            Those can be downloaded separately from the Resource Packages section.
          </p>
        </div>
      </div>
    </PagePaper>
  );
}