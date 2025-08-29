'use client';

import PagePaper from '@/components/PagePaper';

export default function YourNotesPage() {
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
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-slate-600 mb-2">
            Demo Version
          </h2>
          <div className="max-w-2xl mx-auto space-y-4 text-left">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                In the full version, this page includes:
              </h3>
              <ul className="text-blue-800 space-y-2">
                <li>• <strong>Automatic note saving</strong> from all lesson interactions</li>
                <li>• <strong>Organized display</strong> of notes by section and lesson</li>
                <li>• <strong>Export functionality</strong> to PDF and text formats</li>
                <li>• <strong>Search and filtering</strong> to find specific notes quickly</li>
                <li>• <strong>Progress tracking</strong> showing completion status</li>
                <li>• <strong>Note categories</strong> including lesson notes and final reflections</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-center">
                <strong>💡 Key Feature:</strong> All participant inputs are automatically saved and organized for easy review and professional development tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PagePaper>
  );
}