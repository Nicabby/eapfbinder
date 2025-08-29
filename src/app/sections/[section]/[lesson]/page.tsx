'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PagePaper from '@/components/PagePaper';
import { useBinderStore } from '@/lib/store';
import ProtectedPDFLink from '@/components/ProtectedPDFLink';
import StepBackSection from '@/components/StepBackSection';
import { stepBackQuestions } from '@/lib/stepBackQuestions';

interface Resource {
  label: string;
  href: string;
  type: string;
  category?: string;
}

interface Lesson {
  id: string;
  title: string;
  order: number;
  summary: string;
  whyItMatters?: string;
  strategies: string[];
  resources: Resource[];
}

interface Section {
  id: string;
  title: string;
  color: string;
  description: string;
  lessons: Lesson[];
}

// Simplified Demo Activity Component
function SimplifiedDemoActivity({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      
      <p className="text-slate-600 mb-6 leading-relaxed">
        {description}
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 font-medium mb-2">Demo Version:</p>
        <p className="text-blue-700 leading-relaxed">
          In the full version, facilitators can take notes and track their learning through interactive exercises. This would include practice activities, reflection prompts, and progress tracking.
        </p>
      </div>
    </div>
  );
}

// Simplified Note Section Component  
function SimplifiedNoteSection({ title }: { title: string }) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <div className="bg-slate-50 bg-opacity-90 p-4 border border-slate-200 rounded-lg">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 font-medium mb-2">Demo Version:</p>
          <p className="text-blue-700 leading-relaxed">
            In the full version, facilitators can take notes and track their learning. This note-taking feature would allow users to capture key insights, reflections, and action items throughout their learning journey.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { getLessonProgress, markLessonComplete } = useBinderStore();
  
  const [section, setSection] = useState<Section | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLessonData = async () => {
      try {
        const response = await fetch('/data/course.json');
        const data = await response.json();
        const foundSection = data.sections.find((s: Section) => s.id === params.section);
        
        if (foundSection) {
          foundSection.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order);
          setSection(foundSection);
          
          const foundLesson = foundSection.lessons.find((l: Lesson) => l.id === params.lesson);
          if (foundLesson) {
            setLesson(foundLesson);
          }
        }
      } catch (error) {
        console.error('Failed to load lesson data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLessonData();
  }, [params.section, params.lesson]);

  const isCompleted = section && lesson ? getLessonProgress(section.id, lesson.id) : false;

  const handleCompletionToggle = () => {
    if (section && lesson) {
      markLessonComplete(section.id, lesson.id, !isCompleted);
    }
  };

  // Find next lesson
  const getNextLesson = () => {
    if (!section || !lesson) return null;
    
    const currentIndex = section.lessons.findIndex(l => l.id === lesson.id);
    if (currentIndex === -1 || currentIndex === section.lessons.length - 1) return null;
    
    return section.lessons[currentIndex + 1];
  };

  const nextLesson = getNextLesson();

  if (loading) {
    return (
      <PagePaper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-slate-600">Loading lesson...</div>
        </div>
      </PagePaper>
    );
  }

  if (!section || !lesson) {
    return (
      <PagePaper>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Lesson not found</h1>
          <p className="text-slate-600 mb-6">The lesson you&apos;re looking for doesn&apos;t exist.</p>
          <Button
            variant="outline"
            onClick={() => router.push('/sections')}
          >
            ← Back to Sections
          </Button>
        </div>
      </PagePaper>
    );
  }

  return (
    <PagePaper>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: section.color }}
            />
            <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">
              {section.title}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {lesson.title}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {lesson.summary}
          </p>
        </div>

        <hr className="mb-8 border-slate-200" />

        {/* Introduction */}
        <div className="mb-8">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">Welcome to Your Learning Session</h2>
                <p className="text-blue-800 leading-relaxed mb-4">
                  Welcome to this lesson on {lesson.title.toLowerCase()}. In this session, you&apos;ll develop practical skills and strategies that you can immediately apply in your facilitation practice. Take your time to engage with the materials, reflect on the concepts, and make notes about how these ideas connect to your current facilitation challenges and opportunities.
                </p>
                <p className="text-blue-800 leading-relaxed">
                  Remember: Every moment of connection you create with a young person matters. Your growth as a facilitator directly impacts their experience and development.
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="mb-8 border-slate-200" />

        {/* Why This Matters */}
        {lesson.whyItMatters && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Why This Matters</h2>
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {lesson.whyItMatters}
                </p>
              </div>
            </div>
            <hr className="mb-8 border-slate-200" />
          </>
        )}

        {/* Content based on lesson type */}
        {lesson.id === 'open-ended-questions' && (
          <>
            {/* Open-Ended Questions Content */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">The Foundation: Open-Ended Questions</h2>
              
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">What Makes a Question Open-Ended?</h3>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Open-ended questions invite young people to share their thoughts, feelings, and experiences without being limited to yes/no or one-word answers. They create space for authentic expression and deeper connection.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-red-800 mb-3">Instead of asking:</h4>
                      <ul className="space-y-2 text-sm text-red-700">
                        <li>• &quot;Did you like the activity?&quot;</li>
                        <li>• &quot;Are you ready for the challenge?&quot;</li>
                        <li>• &quot;Was it hard?&quot;</li>
                        <li>• &quot;Do you understand?&quot;</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-3">Try asking:</h4>
                      <ul className="space-y-2 text-sm text-green-700">
                        <li>• &quot;What stood out to you about the activity?&quot;</li>
                        <li>• &quot;How are you feeling about the challenge?&quot;</li>
                        <li>• &quot;What was challenging about that?&quot;</li>
                        <li>• &quot;What questions do you have?&quot;</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <SimplifiedDemoActivity 
                  title="Interactive Practice Activity"
                  description="Practice rewriting closed-ended questions into open-ended ones that invite deeper reflection and dialogue."
                />
              </div>
            </div>

            <SimplifiedNoteSection title="Your Notes" />

            <hr className="mb-8 border-slate-200" />
          </>
        )}

        {lesson.id === 'active-listening' && (
          <>
            {/* Active Listening Content */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Six Key Listening Strategies</h2>
              
              <div className="space-y-6">
                <div className="grid gap-4">
                  {[
                    {
                      title: "Hold Space with Silence",
                      description: "Don&apos;t rush to fill every pause. Comfortable silence gives young people time to process and share more deeply."
                    },
                    {
                      title: "Listen with Your Body",
                      description: "Lean in slightly, make appropriate eye contact, keep arms uncrossed. Your body language shows you&apos;re truly present."
                    },
                    {
                      title: "Use Gentle Echoes & Invitations",
                      description: "Reflect back what you hear with phrases like &apos;So you felt...&apos; or &apos;It sounds like...&apos; to show understanding."
                    },
                    {
                      title: "Summarize & Paraphrase",
                      description: "Check your understanding: &apos;Let me make sure I&apos;ve got this right...&apos; This shows you&apos;re actively listening."
                    },
                    {
                      title: "Give Brief Prompts",
                      description: "Simple encouragers like &apos;Mm-hmm...&apos;, &apos;And then?&apos;, or &apos;Tell me more&apos; keep the conversation flowing."
                    },
                    {
                      title: "Acknowledge Emotions",
                      description: "When you hear feelings, name them: &apos;That sounds frustrating&apos; or &apos;I can hear the excitement in your voice.&apos;"
                    }
                  ].map((strategy, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-2">{strategy.title}</h3>
                      <p className="text-slate-700 text-sm leading-relaxed">{strategy.description}</p>
                    </div>
                  ))}
                </div>

                <SimplifiedDemoActivity 
                  title="Interactive Practice Activity"
                  description="Select a listening strategy from the left column, then click on the corresponding scenario number in the right column to match them. Each scenario demonstrates one of the six listening strategies in action."
                />
              </div>
            </div>

            <SimplifiedNoteSection title="Your Notes" />

            <hr className="mb-8 border-slate-200" />
          </>
        )}

        {/* Default content for other lessons */}
        {lesson.id !== 'open-ended-questions' && lesson.id !== 'active-listening' && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Key Strategies</h2>
              <div className="space-y-4">
                {lesson.strategies.map((strategy, index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-slate-700 leading-relaxed">{strategy}</p>
                  </div>
                ))}
              </div>
            </div>

            <SimplifiedNoteSection title="Your Notes" />

            <hr className="mb-8 border-slate-200" />
          </>
        )}

        {/* Step Back Reflection Question */}
        {stepBackQuestions[lesson.id] && (
          <>
            <StepBackSection
              question={stepBackQuestions[lesson.id]}
              sectionId={section.id}
              lessonId={lesson.id}
            />
            <hr className="mb-8 border-slate-200" />
          </>
        )}

        {/* Resources */}
        {lesson.resources && lesson.resources.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Resources & Tools</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {lesson.resources.map((resource, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    {resource.type === 'pdf' ? (
                      <ProtectedPDFLink href={resource.href}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-900">{resource.label}</h3>
                            {resource.category && (
                              <p className="text-sm text-slate-600">{resource.category}</p>
                            )}
                          </div>
                        </div>
                      </ProtectedPDFLink>
                    ) : (
                      <a 
                        href={resource.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-900">{resource.label}</h3>
                            {resource.category && (
                              <p className="text-sm text-slate-600">{resource.category}</p>
                            )}
                          </div>
                        </div>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="mb-8 border-slate-200" />
          </>
        )}

        {/* Final Reflection */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Connecting to Your Practice</h2>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-4">Take a Moment to Reflect</h3>
            <div className="space-y-3 text-blue-800">
              <p className="leading-relaxed">
                Think about your current facilitation practice. How might the concepts from this lesson enhance your interactions with young people?
              </p>
              <p className="leading-relaxed">
                Consider: What&apos;s one small change you could make in your next session that would create more space for authentic connection and dialogue?
              </p>
              <p className="leading-relaxed text-sm">
                You can do this in writing, voice notes, or even a visual map. The goal is authenticity, not perfection.
              </p>
            </div>
          </div>
          
          <SimplifiedNoteSection title="Your Notes" />
        </div>
        
        <hr className="mb-8 border-slate-200" />

        {/* Lesson Completion */}
        <div className="mb-8">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <input
              type="checkbox"
              id="lesson-complete"
              checked={isCompleted}
              onChange={handleCompletionToggle}
              className="w-5 h-5 text-green-600 rounded"
            />
            <label htmlFor="lesson-complete" className="text-sm font-medium cursor-pointer text-green-800">
              Mark lesson as complete
            </label>
            {isCompleted && (
              <span className="ml-auto text-sm text-green-600 font-medium">
                ✓ Completed
              </span>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => router.push(`/sections/${section.id}`)}
            >
              ← Back to {section.title}
            </Button>
            
            {nextLesson && (
              <Button
                onClick={() => router.push(`/sections/${section.id}/${nextLesson.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next Lesson →
              </Button>
            )}
          </div>
        </div>
      </div>
    </PagePaper>
  );
}