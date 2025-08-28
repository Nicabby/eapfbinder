'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PagePaper from '@/components/PagePaper';

interface CourseData {
  title: string;
  description: string;
  sections: Array<{
    id: string;
    title: string;
    color: string;
    lessons: Array<{ id: string; title: string }>;
  }>;
}

export default function HomePage() {
  const router = useRouter();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        const response = await fetch('/data/course.json');
        const data = await response.json();
        setCourseData(data);
      } catch (error) {
        console.error('Failed to load course data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, []);

  const handleGetStarted = () => {
    router.push('/sections/orientation');
  };

  if (loading) {
    return (
      <PagePaper showRings={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </PagePaper>
    );
  }

  if (!courseData) {
    return (
      <PagePaper showRings={false}>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Unable to Load Course Data
          </h1>
          <p className="text-slate-600">
            Please check your connection and try again.
          </p>
        </div>
      </PagePaper>
    );
  }

  return (
    <PagePaper showRings={false}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900">
              EAP Facilitator Binder
            </h1>
          </div>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {courseData.description}
          </p>
          
          <Button
            onClick={handleGetStarted}
            className="text-lg px-8 py-6 h-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            Get Started →
          </Button>
        </div>

        {/* Program Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 rounded-lg bg-white border border-slate-200">
            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Competency-Based</h3>
            <p className="text-sm text-slate-600">
              Develop skills across 8 core competency areas with practical application.
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-white border border-slate-200">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Self-Paced</h3>
            <p className="text-sm text-slate-600">
              Progress through lessons at your own pace with integrated note-taking.
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-white border border-slate-200">
            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Practice-Focused</h3>
            <p className="text-sm text-slate-600">
              Build, practice, and strengthen skills through guided exercises.
            </p>
          </div>
        </div>

        {/* Sections Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Program Sections</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courseData.sections.map((section, index) => (
              <div
                key={section.id}
                className="p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group bg-white"
                style={{ borderLeftColor: section.color, borderLeftWidth: '4px' }}
                onClick={() => router.push(`/sections/${section.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">
                    {section.title}
                  </h3>
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: section.color }}
                  />
                </div>
                
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  {section.lessons.length} lesson{section.lessons.length !== 1 ? 's' : ''}
                </p>
                
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Key Features</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="p-4">
              <h4 className="font-semibold mb-2">📝 Integrated Notes</h4>
              <p className="text-slate-600">
                Take notes directly on each lesson page with auto-save functionality.
              </p>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold mb-2">📊 Progress Tracking</h4>
              <p className="text-slate-600">
                Track your completion progress across all sections and lessons.
              </p>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold mb-2">🔍 Global Search</h4>
              <p className="text-slate-600">
                Search across all content and your personal notes.
              </p>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold mb-2">📤 Export Options</h4>
              <p className="text-slate-600">
                Export your notes as Markdown or print-friendly format.
              </p>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold mb-2">📱 Responsive Design</h4>
              <p className="text-slate-600">
                Works seamlessly on desktop, tablet, and mobile devices.
              </p>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold mb-2">🎯 Accessibility</h4>
              <p className="text-slate-600">
                Fully keyboard navigable with screen reader support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PagePaper>
  );
}
