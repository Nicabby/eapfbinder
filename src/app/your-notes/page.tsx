'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import PagePaper from '@/components/PagePaper';

interface NoteEntry {
  key: string;
  content: string;
  section: string;
  lesson: string;
  type: 'lesson' | 'stepback' | 'section';
  sectionTitle: string;
  timestamp?: number;
}

export default function YourNotesPage() {
  const [allNotes, setAllNotes] = useState<NoteEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllNotes = () => {
      const notes: NoteEntry[] = [];
      
      // Get all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        
        // Process different types of notes
        if (key.startsWith('note-')) {
          // Main lesson notes: note-{section}-{lesson}
          const parts = key.split('-');
          if (parts.length === 3) {
            const content = localStorage.getItem(key);
            if (content && content.trim()) {
              notes.push({
                key,
                content: content.trim(),
                section: parts[1],
                lesson: parts[2],
                type: 'lesson',
                sectionTitle: formatSectionTitle(parts[1])
              });
            }
          }
        } else if (key.startsWith('stepback-')) {
          // Step Back reflection notes: stepback-{section}-{lesson}
          const parts = key.split('-');
          if (parts.length === 3) {
            const content = localStorage.getItem(key);
            if (content && content.trim()) {
              notes.push({
                key,
                content: content.trim(),
                section: parts[1],
                lesson: parts[2],
                type: 'stepback',
                sectionTitle: formatSectionTitle(parts[1])
              });
            }
          }
        }
      }
      
      // Sort notes by section and lesson
      notes.sort((a, b) => {
        if (a.section !== b.section) {
          return a.section.localeCompare(b.section);
        }
        return a.lesson.localeCompare(b.lesson);
      });
      
      setAllNotes(notes);
      setLoading(false);
    };

    loadAllNotes();
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
    let content = 'EAP FACILITATOR BINDER - YOUR NOTES\n';
    content += '=====================================\n\n';
    
    let currentSection = '';
    
    allNotes.forEach(note => {
      if (currentSection !== note.sectionTitle) {
        currentSection = note.sectionTitle;
        content += `\n${currentSection.toUpperCase()}\n`;
        content += '='.repeat(currentSection.length) + '\n\n';
      }
      
      content += `${formatLessonTitle(note.lesson)}`;
      if (note.type === 'stepback') {
        content += ' - Step Back Reflection';
      }
      content += '\n' + '-'.repeat(40) + '\n';
      content += note.content + '\n\n';
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EAP-Facilitator-Notes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = () => {
    // For now, we'll create a printable version that users can save as PDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    let htmlContent = `
      <html>
        <head>
          <title>EAP Facilitator Binder - Your Notes</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            h1 { color: #1e40af; border-bottom: 3px solid #1e40af; padding-bottom: 10px; }
            h2 { color: #374151; border-bottom: 1px solid #d1d5db; padding-bottom: 5px; margin-top: 30px; }
            h3 { color: #6b7280; margin-top: 20px; }
            .note-content { background: #f9fafb; padding: 15px; border-left: 4px solid #3b82f6; margin: 10px 0; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <h1>EAP Facilitator Binder - Your Notes</h1>
    `;
    
    let currentSection = '';
    
    allNotes.forEach(note => {
      if (currentSection !== note.sectionTitle) {
        currentSection = note.sectionTitle;
        htmlContent += `<h2>${currentSection}</h2>`;
      }
      
      htmlContent += `<h3>${formatLessonTitle(note.lesson)}`;
      if (note.type === 'stepback') {
        htmlContent += ' - Step Back Reflection';
      }
      htmlContent += '</h3>';
      htmlContent += `<div class="note-content">${note.content.replace(/\n/g, '<br>')}</div>`;
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </PagePaper>
    );
  }

  return (
    <PagePaper>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            📝 Your Notes
          </h1>
          <p className="text-slate-600 text-lg mb-6">
            All your learning notes and reflections from across the training modules.
          </p>
          
          {allNotes.length > 0 && (
            <div className="flex gap-3">
              <Button 
                onClick={exportAsText}
                variant="outline"
                className="flex items-center gap-2"
              >
                📄 Export as Text
              </Button>
              <Button 
                onClick={exportAsPDF}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                📑 Export as PDF
              </Button>
            </div>
          )}
        </div>

        {allNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-slate-600 mb-2">
              No notes yet
            </h2>
            <p className="text-slate-500">
              Start taking notes in your lessons and they&apos;ll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {(() => {
              let currentSection = '';
              return allNotes.map((note) => {
                const showSectionHeader = currentSection !== note.sectionTitle;
                if (showSectionHeader) {
                  currentSection = note.sectionTitle;
                }
                
                return (
                  <div key={note.key}>
                    {showSectionHeader && (
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-slate-300 pb-2">
                          {note.sectionTitle}
                        </h2>
                      </div>
                    )}
                    
                    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {formatLessonTitle(note.lesson)}
                          {note.type === 'stepback' && (
                            <span className="ml-2 text-sm font-normal text-purple-600 bg-purple-100 px-2 py-1 rounded">
                              Step Back Reflection
                            </span>
                          )}
                        </h3>
                      </div>
                      
                      <div className="bg-slate-50 bg-opacity-90 p-4 border border-slate-200 rounded-lg">
                        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-mono">
                          {note.content}
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-slate-500">
                        {note.content.trim().split(/\s+/).filter(word => word.length > 0).length} words
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