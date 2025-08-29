'use client';

interface StepBackSectionProps {
  question: string;
  sectionId: string;
  lessonId: string;
}

export default function StepBackSection({ question }: StepBackSectionProps) {
  return (
    <div className="mb-8">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">🤔</span>
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
        
        <div className="bg-white border border-purple-200 rounded-lg p-4">
          <p className="text-purple-600 text-center italic">
            In the full version, facilitators can record and track their reflections across all modules.
          </p>
        </div>
      </div>
    </div>
  );
}