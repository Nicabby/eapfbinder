'use client';

import PagePaper from '@/components/PagePaper';

export default function StepBackJournalPage() {
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
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="text-xl font-semibold text-slate-600 mb-2">
            Demo Version
          </h2>
          <div className="max-w-2xl mx-auto space-y-4 text-left">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">
                In the full version, this journal includes:
              </h3>
              <ul className="text-purple-800 space-y-2">
                <li>• <strong>Deep reflection questions</strong> for each lesson module</li>
                <li>• <strong>Personal response tracking</strong> with automatic saving</li>
                <li>• <strong>Progress visualization</strong> across all competency areas</li>
                <li>• <strong>Export capabilities</strong> for professional portfolios</li>
                <li>• <strong>Reflection analytics</strong> showing growth patterns</li>
                <li>• <strong>Integration tools</strong> connecting insights across modules</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-center">
                <strong>💡 Key Feature:</strong> Step-back questions help facilitators connect training concepts to personal experience, creating deeper learning and professional growth.
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-center text-sm">
                <strong>Sample Reflection Question:</strong><br/>
                &quot;Think back to a time when you received helpful feedback. What made it work? How did it impact you?&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </PagePaper>
  );
}