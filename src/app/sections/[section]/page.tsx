'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PagePaper from '@/components/PagePaper';
import { useBinderStore } from '@/lib/store';

interface Lesson {
  id: string;
  title: string;
  order: number;
  summary: string;
  whyItMatters?: string;
  strategies: string[];
  resources: Array<{
    label: string;
    href: string;
    type: string;
  }>;
}

interface ModuleIntroduction {
  summary: string;
  learningObjectives: string[];
  lessonOutline: string;
}

interface Section {
  id: string;
  title: string;
  color: string;
  description: string;
  moduleIntroduction?: ModuleIntroduction;
  lessons: Lesson[];
}

export default function SectionPage() {
  const params = useParams();
  const router = useRouter();
  const { getLessonProgress } = useBinderStore();
  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSectionData = async () => {
      try {
        const response = await fetch('/data/course.json');
        const data = await response.json();
        const foundSection = data.sections.find((s: Section) => s.id === params.section);
        
        if (foundSection) {
          foundSection.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order);
          setSection(foundSection);
        }
      } catch (error) {
        console.error('Failed to load section data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSectionData();
  }, [params.section]);

  const handleLessonClick = (lessonId: string) => {
    router.push(`/sections/${params.section}/${lessonId}`);
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

  if (!section) {
    return (
      <PagePaper>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Section Not Found
          </h1>
          <p className="text-slate-600 mb-6">
            The section you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push('/')}>
            Return Home
          </Button>
        </div>
      </PagePaper>
    );
  }

  return (
    <PagePaper>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {section.title}
          </h1>
          <p className="text-slate-600 text-lg">
            {section.description}
          </p>
        </div>

        {/* Module Introduction for Competency Modules */}
        {section.moduleIntroduction && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              Module Overview
            </h2>
            
            <div className="mb-6">
              <div className="text-blue-800 leading-relaxed">
                {section.moduleIntroduction.summary.split('\n').map((paragraph, index) => {
                  if (paragraph.trim() === '') return null;
                  
                  // Handle bullet points
                  if (paragraph.trim().startsWith('•')) {
                    return (
                      <div key={index} className="ml-4 mb-2">
                        {paragraph.trim()}
                      </div>
                    );
                  }
                  
                  // Handle regular paragraphs
                  return (
                    <p key={index} className="mb-4">
                      {paragraph.trim()}
                    </p>
                  );
                })}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">
                Learning Objectives
              </h3>
              <ul className="space-y-2">
                {section.moduleIntroduction.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3 text-blue-800">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-blue-900 mb-3">
                Module Structure
              </h3>
              <p className="text-blue-800 leading-relaxed">
                {section.moduleIntroduction.lessonOutline}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Lessons</h2>

          {(['leadership', 'communication', 'effective-listening', 'relationship-building', 'emotional-intelligence', 'equity-inclusion'].includes(section.id)) ? (
            // Grouped layout for competency modules
            <div className="space-y-8">
              {section.id === 'leadership' && (
                <>
                  {/* Providing Feedback */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Providing Feedback</h3>
                    {['build-feedback', 'practice-feedback', 'strengthen-feedback'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Fostering Independence */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Fostering Independence</h3>
                    {['build-independence', 'practice-independence', 'strengthen-independence'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Decision Making */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Decision Making</h3>
                    {['build-decision-making', 'practice-decision-making', 'strengthen-decision-making'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {section.id === 'communication' && (
                <>
                  {/* Lead by Example */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Lead by Example</h3>
                    {['build-lead-by-example', 'practice-lead-by-example', 'strengthen-lead-by-example'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Non-Verbal Awareness */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Non-Verbal Awareness</h3>
                    {['build-nonverbal-awareness', 'practice-nonverbal-awareness', 'strengthen-nonverbal-awareness'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Family Partnership */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Family Partnership</h3>
                    {['build-family-partnership', 'practice-family-partnership', 'strengthen-family-partnership'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {section.id === 'active-listening' && (
                <>
                  {/* Listening for Understanding */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Listening for Understanding</h3>
                    {['build-listening-understanding', 'practice-listening-understanding', 'strengthen-listening-understanding'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Using Open-Ended Questions */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Using Open-Ended Questions</h3>
                    {['build-open-ended-questions', 'practice-open-ended-questions', 'strengthen-open-ended-questions'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {section.id === 'effective-listening' && (
                <>
                  {/* Strategies for Effective Listening */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Strategies for Effective Listening</h3>
                    {['build-listening-strategies', 'practice-listening-strategies', 'strengthen-listening-strategies'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Asking Closed vs. Open Questions */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Asking Closed vs. Open Questions</h3>
                    {['build-open-ended-questions', 'practice-open-ended-questions', 'strengthen-open-ended-questions'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {section.id === 'relationship-building' && (
                <>
                  {/* Managing Group Dynamics */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Managing Group Dynamics</h3>
                    {['build-group-dynamics', 'practice-group-dynamics', 'strengthen-group-dynamics'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Creating Trust */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Creating Trust</h3>
                    {['build-trust', 'practice-trust', 'strengthen-trust'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {section.id === 'emotional-intelligence' && (
                <>
                  {/* Self-Reflection */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Self-Reflection</h3>
                    {['build-self-reflection', 'practice-self-reflection', 'strengthen-self-reflection'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Empathy */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Empathy</h3>
                    {['build-empathy', 'practice-empathy', 'strengthen-empathy'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {section.id === 'equity-inclusion' && (
                <>
                  {/* Bias Awareness */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Bias Awareness</h3>
                    {['build-bias-awareness', 'practice-bias-awareness', 'strengthen-bias-awareness'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Inclusion Scanning */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Inclusion Scanning</h3>
                    {['build-inclusion-scanning', 'practice-inclusion-scanning', 'strengthen-inclusion-scanning'].map((lessonId) => {
                      const lesson = section.lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;
                      const isCompleted = getLessonProgress(section.id, lesson.id);
                      const phase = lessonId.includes('build') ? 'Build' : lessonId.includes('practice') ? 'Practice' : 'Strengthen';
                      
                      return (
                        <div
                          key={lesson.id}
                          className="ml-6 bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{phase}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ) : (
            // Default layout for other modules
            section.lessons.map((lesson) => {
              const isCompleted = getLessonProgress(section.id, lesson.id);
              
              return (
                <div
                  key={lesson.id}
                  className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleLessonClick(lesson.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {isCompleted ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-slate-300 rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {lesson.title}
                          </h3>
                          <p className="text-slate-600 leading-relaxed">
                            {lesson.summary}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>

                      {lesson.resources.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>{lesson.resources.length} resource{lesson.resources.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
            >
              ← Back to Home
            </Button>
            
            {section.lessons.length > 0 && (
              <Button
                onClick={() => handleLessonClick(section.lessons[0].id)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start First Lesson →
              </Button>
            )}
          </div>
        </div>
      </div>
    </PagePaper>
  );
}