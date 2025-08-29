'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import PagePaper from '@/components/PagePaper';
import { stepBackQuestions } from '@/lib/stepBackQuestions';

interface StepBackEntry {
  key: string;
  content: string;
  section: string;
  lesson: string;
  sectionTitle: string;
  question: string;
}

export default function StepBackJournalPage() {
  const [stepBackEntries, setStepBackEntries] = useState<StepBackEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStepBackEntries = () => {
      const entries: StepBackEntry[] = [];
      
      // Get all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        
        // Process binder.v1.notes keys with -stepback suffix
        if (key.startsWith('binder.v1.notes.') && key.endsWith('-stepback')) {
          const noteKey = key.replace('binder.v1.notes.', '').replace('-stepback', '');
          const parts = noteKey.split('.');
          if (parts.length === 2) {
            const content = localStorage.getItem(key);
            if (content) {
              try {
                const noteData = JSON.parse(content);
                if (noteData.content && noteData.content.trim()) {
                  const question = stepBackQuestions[parts[1]] || 'No question found for this lesson.';
                  
                  entries.push({
                    key,
                    content: noteData.content.trim(),
                    section: parts[0],
                    lesson: parts[1],
                    sectionTitle: formatSectionTitle(parts[0]),
                    question
                  });
                }
              } catch (error) {
                console.warn('Failed to parse step back note data:', error);
              }
            }
          }
        }
        // Also check for legacy stepback format
        else if (key.startsWith('stepback-')) {
          const parts = key.split('-');
          if (parts.length === 3) {
            const content = localStorage.getItem(key);
            if (content && content.trim()) {
              const question = stepBackQuestions[parts[2]] || 'No question found for this lesson.';
              
              entries.push({
                key,
                content: content.trim(),
                section: parts[1],
                lesson: parts[2],
                sectionTitle: formatSectionTitle(parts[1]),
                question
              });
            }
          }
        }
      }
      
      // Sort entries by section and lesson
      entries.sort((a, b) => {
        if (a.section !== b.section) {
          return a.section.localeCompare(b.section);
        }
        return a.lesson.localeCompare(b.lesson);
      });
      
      setStepBackEntries(entries);
      setLoading(false);
    };

    loadStepBackEntries();
  }, []);

  const formatSectionTitle = (sectionId: string): string => {
    const titleMap: Record<string, string> = {
      'orientation': 'Program Orientation',
      'leadership': 'Leadership',
      'communication': 'Communication',
      'active-listening': 'Active Listening',
      'relationship-building': 'Relationship Building',
      'emotional-intelligence': 'Emotional Intelligence',
      'equity-inclusion': 'Equity & Inclusion',
      'wrap-up': 'Program Wrap-Up'
    };
    return titleMap[sectionId] || sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
  };

  const formatLessonTitle = (lessonId: string): string => {
    return lessonId.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const exportAsText = () => {
    let content = 'EAP FACILITATOR BINDER - STEP BACK JOURNAL\n';
    content += '==========================================\n\n';
    
    let currentSection = '';
    
    stepBackEntries.forEach(entry => {
      if (currentSection !== entry.sectionTitle) {
        currentSection = entry.sectionTitle;
        content += `\n${currentSection.toUpperCase()}\n`;
        content += '='.repeat(currentSection.length) + '\n\n';
      }
      
      content += `${formatLessonTitle(entry.lesson)} - Step Back Reflection\n`;
      content += '-'.repeat(50) + '\n';
      content += `REFLECTION QUESTION:\n${entry.question}\n\nMY RESPONSE:\n`;
      content += entry.content + '\n\n';
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EAP-Step-Back-Journal.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    let htmlContent = `
      <html>
        <head>
          <title>EAP Facilitator Binder - Step Back Journal</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            h1 { color: #7c3aed; border-bottom: 3px solid #7c3aed; padding-bottom: 10px; }
            h2 { color: #374151; border-bottom: 1px solid #d1d5db; padding-bottom: 5px; margin-top: 30px; }
            h3 { color: #6b7280; margin-top: 20px; }
            .question { background: #f3e8ff; padding: 15px; border-left: 4px solid #7c3aed; margin: 10px 0; }
            .response { background: #f9fafb; padding: 15px; border-left: 4px solid #a855f7; margin: 10px 0; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <h1>EAP Facilitator Binder - Step Back Journal</h1>
    `;
    
    let currentSection = '';
    
    stepBackEntries.forEach(entry => {
      if (currentSection !== entry.sectionTitle) {
        currentSection = entry.sectionTitle;
        htmlContent += `<h2>${currentSection}</h2>`;
      }
      
      htmlContent += `<h3>${formatLessonTitle(entry.lesson)} - Step Back Reflection</h3>`;
      htmlContent += `<div class="question"><strong>Reflection Question:</strong><br><em>${entry.question}</em></div>`;
      htmlContent += `<div class="response">${entry.content.replace(/\n/g, '<br>')}</div>`;
    });
    
    htmlContent += '</body></html>';
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <PagePaper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </PagePaper>
    );
  }

  return (
    <PagePaper>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-4">
            📝 Step Back Journal
          </h1>
          <p className="text-slate-600 text-lg mb-6">
            All your step back reflections from across the training modules. These deep reflection questions help you connect course concepts to your personal experience.
          </p>
          
          {stepBackEntries.length > 0 && (
            <div className="flex gap-3">
              <Button 
                onClick={exportAsText}
                variant="outline"
                className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                📄 Export Journal as Text
              </Button>
              <Button 
                onClick={exportAsPDF}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                📑 Export Journal as PDF
              </Button>
            </div>
          )}
        </div>

        {stepBackEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤔</div>
            <h2 className="text-xl font-semibold text-slate-600 mb-2">
              No reflections yet
            </h2>
            <p className="text-slate-500 mb-4">
              Complete step back reflection questions in your lessons and they&apos;ll appear here.
            </p>
            <p className="text-sm text-purple-600 bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md mx-auto">
              💡 <strong>Tip:</strong> Look for the purple &quot;Step Back Reflection Question&quot; sections in your lessons to start building your reflection journal.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {(() => {
              let currentSection = '';
              
              return stepBackEntries.map((entry) => {
                const showSectionHeader = currentSection !== entry.sectionTitle;
                if (showSectionHeader) {
                  currentSection = entry.sectionTitle;
                }
                
                return (
                  <div key={entry.key}>
                    {showSectionHeader && (
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-purple-800 border-b-2 border-purple-300 pb-2">
                          {entry.sectionTitle}
                        </h2>
                      </div>
                    )}
                    
                    <div className="bg-white border border-purple-200 rounded-lg p-6 shadow-sm">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {formatLessonTitle(entry.lesson)}
                        </h3>
                      </div>
                      
                      {/* Reflection Question */}
                      <div className="bg-purple-50 p-4 border border-purple-200 rounded-lg mb-4">
                        <p className="text-sm font-medium text-purple-800 mb-2">Reflection Question:</p>
                        <p className="text-purple-700 leading-relaxed italic">
                          {entry.question}
                        </p>
                      </div>
                      
                      {/* Your Response */}
                      <div className="bg-purple-50 bg-opacity-50 p-4 border border-purple-200 rounded-lg">
                        <p className="text-sm font-medium text-purple-800 mb-2">Your Response:</p>
                        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-mono">
                          {entry.content}
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-slate-500">
                        {entry.content.trim().split(/\s+/).filter(word => word.length > 0).length} words
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
    </PagePaper>
  );
}