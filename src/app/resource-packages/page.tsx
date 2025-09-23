'use client';

import { useEffect, useState } from 'react';
import PagePaper from '@/components/PagePaper';
import ProtectedPDFLink from '@/components/ProtectedPDFLink';
import { Download, Package, FileText, Users, Target, BookOpen, Heart, Brain, Lightbulb, Lock } from 'lucide-react';

interface Resource {
  label: string;
  href: string;
  type: string;
  category?: string;
}

interface Section {
  id: string;
  title: string;
  color: string;
  description: string;
  lessons: Array<{
    id: string;
    title: string;
    order: number;
    resources?: Resource[];
  }>;
}

interface CourseData {
  sections: Section[];
}

const getSectionIcon = (sectionId: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
    orientation: BookOpen,
    leadership: Users,
    communication: Target,
    facilitation: Heart,
    'group-dynamics': Brain,
    'conflict-resolution': Lightbulb,
    'program-management': Package,
    evaluation: FileText,
  };
  return icons[sectionId] || Package;
};

export default function ResourcePackagesPage() {
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

  const getAllResources = () => {
    if (!courseData) return [];

    return courseData.sections.map(section => {
      const allResources = section.lessons.flatMap(lesson => lesson.resources || []);
      return {
        section,
        resources: allResources,
        totalResources: allResources.length
      };
    }).filter(item => item.totalResources > 0);
  };


  if (loading) {
    return (
      <PagePaper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </PagePaper>
    );
  }

  const resourceSections = getAllResources();

  return (
    <PagePaper pageTitle="Resource Packages">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="border-b-2 border-emerald-200 pb-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-800">Resource Packages</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Download training materials and resources organized by module. Each package contains
            PDFs, handouts, and reference materials for the corresponding training section.
          </p>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-amber-600" />
              <span className="font-semibold text-amber-800">Password Protected Resources</span>
            </div>
            <p className="text-amber-700 text-sm">
              All resource documents are password protected. When prompted, use the password: <code className="bg-amber-100 px-2 py-1 rounded font-mono">EAPF2025</code>
            </p>
          </div>
        </div>

        {/* Resource Sections */}
        <div className="space-y-8">
          {resourceSections.map(({ section, resources, totalResources }) => {
            const IconComponent = getSectionIcon(section.id);

            return (
              <div
                key={section.id}
                className="bg-white rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow duration-200"
                style={{ borderColor: section.color + '40' }}
              >
                {/* Section Header */}
                <div
                  className="p-6 rounded-t-lg border-b border-gray-200"
                  style={{ backgroundColor: section.color + '10' }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: section.color + '20' }}
                    >
                      <IconComponent className="h-6 w-6" style={{ color: section.color }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
                      <p className="text-gray-600 text-sm mt-1">{section.description}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {totalResources} resource{totalResources !== 1 ? 's' : ''} available
                      </p>
                    </div>
                  </div>
                </div>

                {/* Resources List */}
                <div className="p-6">
                  <div className="grid gap-3">
                    {resources.map((resource, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <h3 className="font-medium text-gray-800">{resource.label}</h3>
                            {resource.category && (
                              <p className="text-xs text-gray-500 mt-1">{resource.category}</p>
                            )}
                          </div>
                        </div>

                        <ProtectedPDFLink
                          href={resource.href}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors duration-200"
                        >
                          <Lock className="h-3 w-3" />
                          <Download className="h-4 w-4" />
                          Download
                        </ProtectedPDFLink>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {resourceSections.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Resources Available</h3>
            <p className="text-gray-500">
              Resource packages will appear here as they become available for each training module.
            </p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 p-6 bg-emerald-50 rounded-lg border border-emerald-200">
          <h3 className="font-semibold text-emerald-800 mb-2">About Resource Packages</h3>
          <ul className="text-emerald-700 text-sm space-y-1">
            <li>• Each package contains all supplementary materials for a training module</li>
            <li>• Files are organized by category: Reference Handouts, Worksheets, Templates</li>
            <li>• Download individual files or entire module packages</li>
            <li>• All resources are in PDF format for easy printing and sharing</li>
            <li>• <strong>All downloads are password protected</strong> - use password: <code className="bg-emerald-100 px-1 rounded font-mono">EAPF2025</code></li>
          </ul>
        </div>
      </div>
    </PagePaper>
  );
}