'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface StepBackSectionProps {
  question: string;
  sectionId: string;
  lessonId: string;
}

export default function StepBackSection({ question, sectionId, lessonId }: StepBackSectionProps) {
  const [reflection, setReflection] = useState('');

  const handleReflectionChange = (content: string) => {
    setReflection(content);
    // Save to localStorage for persistence
    localStorage.setItem(`stepback-${sectionId}-${lessonId}`, content);
  };

  // Load saved reflection on component mount
  useEffect(() => {
    const saved = localStorage.getItem(`stepback-${sectionId}-${lessonId}`);
    if (saved) {
      setReflection(saved);
    }
  }, [sectionId, lessonId]);

  return (
    <div className="mb-8">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">📝</span>
          </div>
          <h2 className="text-xl font-bold text-purple-900">
            Step Back Reflection Question
          </h2>
        </div>
        
        <div className="mb-6">
          <p className="text-purple-800 leading-relaxed font-medium">
            {question}
          </p>
        </div>
        
        <div className="space-y-4">
          <textarea
            placeholder="Take a moment to step back and reflect on this question. Your thoughts will be saved automatically as you type..."
            value={reflection}
            onChange={(e) => handleReflectionChange(e.target.value)}
            className="w-full min-h-[150px] p-4 border border-purple-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, Monaco, Consolas, monospace' }}
          />
          
          <div className="flex items-center justify-between text-sm text-purple-600">
            <div>
              {reflection.trim().split(/\s+/).filter(word => word.length > 0).length} words
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
                onClick={() => window.open('/resources/STEP BACK JOURNAL.pdf', '_blank')}
              >
                📋 View Full Journal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}