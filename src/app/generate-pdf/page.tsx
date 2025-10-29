'use client';

import { useState, useEffect } from 'react';
import PagePaper from '@/components/PagePaper';
import { generateBinderPDF, generateSectionPDF } from '@/utils/pdfGenerator';
import { Download, FileText, Loader2, BookOpen } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  color: string;
  description: string;
}

export default function GeneratePDFPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingSection, setGeneratingSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    // Load sections data
    const loadSections = async () => {
      try {
        const response = await fetch('/data/course.json');
        const data = await response.json();
        setSections(data.sections || []);
      } catch (err) {
        console.error('Failed to load sections:', err);
      }
    };
    loadSections();
  }, []);

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

  const handleGenerateSectionPDF = async (sectionId: string) => {
    setGeneratingSection(sectionId);
    setError(null);

    try {
      await generateSectionPDF(sectionId);
    } catch (err) {
      setError('Failed to generate section PDF. Please try again.');
      console.error('Section PDF generation error:', err);
    } finally {
      setGeneratingSection(null);
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

        {/* Full Binder Section */}
        <div className="bg-emerald-50 rounded-lg p-6 mb-8 border border-emerald-200">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-800">Complete Binder</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Download the entire EAP Facilitator Development Program as one comprehensive PDF.
            Each section will start on a new page for easy document insertion.
          </p>
          <div className="text-left space-y-2 text-gray-700 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>Complete program overview and syllabus</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>All training modules with page breaks between sections</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>Table of contents for easy navigation</span>
            </div>
          </div>
          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating || generatingSection !== null}
            className={`
              inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-200
              ${isGenerating || generatingSection !== null
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg transform hover:scale-105'
              }
              text-white
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating Complete Binder...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Download Complete Binder
              </>
            )}
          </button>
        </div>

        {/* Individual Sections */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Individual Sections</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Download specific sections individually. Perfect for printing only what you need or inserting additional materials.
          </p>
          <div className="grid gap-3">
            {sections.map((section, index) => (
              <div key={section.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {index + 1}. {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                </div>
                <button
                  onClick={() => handleGenerateSectionPDF(section.id)}
                  disabled={isGenerating || generatingSection !== null}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200
                    ${isGenerating || generatingSection !== null
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                    }
                    text-white text-sm
                  `}
                >
                  {generatingSection === section.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Instructions</h3>
          <div className="text-blue-700 text-sm space-y-2 text-left">
            <p><strong>Complete Binder:</strong></p>
            <ul className="ml-4 space-y-1 list-disc">
              <li>Download the entire program as one PDF with page breaks between sections</li>
              <li>Perfect for inserting additional documents between sections</li>
              <li>Includes table of contents for easy navigation</li>
            </ul>
            <p className="mt-3"><strong>Individual Sections:</strong></p>
            <ul className="ml-4 space-y-1 list-disc">
              <li>Download specific sections as separate PDFs</li>
              <li>Ideal for printing only what you need</li>
              <li>Each section is self-contained with its lessons and resources</li>
            </ul>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-700 text-sm">
            <strong>Note:</strong> The generated PDFs will include all program content but not the individual resource files.
            Those can be downloaded separately from the Resource Packages section. Each section in the complete binder
            starts on a new page to facilitate inserting additional documents.
          </p>
        </div>
      </div>
    </PagePaper>
  );
}