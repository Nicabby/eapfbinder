'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Section {
  id: string;
  title: string;
  color: string;
  description: string;
  lessons: Array<{
    id: string;
    title: string;
    order: number;
  }>;
}

export default function SectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        const response = await fetch('/data/course.json');
        const data = await response.json();
        setSections(data.sections);
      } catch (error) {
        console.error('Failed to load course data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#cdb483' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#467edd' }}></div>
      </div>
    );
  }

  const currentSectionId = pathname.split('/')[2];
  const currentSection = sections.find(s => s.id === currentSectionId);
  
  // Get current section color for background
  const getCurrentSectionColors = () => {
    if (!currentSection) return { bg: '#cdb48333', transparent: '#cdb48310' };
    
    const colors = [
      { bg: '#467edd', transparent: '#467edd10' },
      { bg: '#b1b4e5', transparent: '#b1b4e510' },
      { bg: '#8fbc8f', transparent: '#8fbc8f10' },
      { bg: '#dda0dd', transparent: '#dda0dd10' },
      { bg: '#f4a460', transparent: '#f4a46010' },
      { bg: '#87ceeb', transparent: '#87ceeb10' },
      { bg: '#ffb6c1', transparent: '#ffb6c110' },
      { bg: '#98fb98', transparent: '#98fb9810' },
    ];
    
    const sectionIndex = sections.findIndex(s => s.id === currentSectionId);
    return sectionIndex >= 0 ? colors[sectionIndex % colors.length] : { bg: '#cdb48333', transparent: '#cdb48310' };
  };

  const currentColors = getCurrentSectionColors();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-3 px-4 text-sm font-medium shadow-lg">
        🎯 <strong>DEMO VERSION</strong> - This is a sample of the EAP Facilitator Training Platform. Full functionality available in the complete version.
      </div>
      
      <div className="flex flex-1" style={{ background: currentColors.transparent }}>
        {/* Left Tab Rail */}
      <aside className="w-72 relative">
        {/* Binder Ring Divider */}
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300 rounded-full shadow-inner">
          {/* Ring holes */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gray-500 rounded-full shadow-inner border border-gray-600"
              style={{
                left: '-6px',
                top: `${8 + i * 8}%`,
              }}
            />
          ))}
        </div>
        
        {/* EAP Logo - positioned to align with main title */}
        <div className="absolute top-4 left-12 right-4 text-center mb-6">
          <img 
            src="/NewLogoTrans.png" 
            alt="EAP Logo" 
            className="w-[120px] h-[120px] mx-auto mb-1 object-contain"
          />
        </div>
        
        {/* Tab Navigation */}
        <div className="pl-12 pt-32 space-y-1">
          <h2 className="text-lg font-bold text-gray-800 text-center mb-4">Training Sections</h2>
          {sections.map((section, index) => {
            const isActive = currentSectionId === section.id;
            const colors = [
              { bg: '#467edd', bgTransparent: '#467edd20', text: '#1e3a8a' },
              { bg: '#b1b4e5', bgTransparent: '#b1b4e520', text: '#4c1d95' },
              { bg: '#8fbc8f', bgTransparent: '#8fbc8f20', text: '#15803d' },
              { bg: '#dda0dd', bgTransparent: '#dda0dd20', text: '#86198f' },
              { bg: '#f4a460', bgTransparent: '#f4a46020', text: '#c2410c' },
              { bg: '#87ceeb', bgTransparent: '#87ceeb20', text: '#0369a1' },
              { bg: '#ffb6c1', bgTransparent: '#ffb6c120', text: '#be185d' },
              { bg: '#98fb98', bgTransparent: '#98fb9820', text: '#166534' },
            ];
            const colorScheme = colors[index % colors.length];

            return (
              <div key={section.id} className="relative">
                {/* Tab with connection to page */}
                <div className="relative">
                  {/* Tab extension that connects to page */}
                  {isActive && (
                    <div 
                      className="absolute -right-4 top-0 bottom-0 w-8 transition-all duration-200 rounded-r-xl"
                      style={{ backgroundColor: colorScheme.bg }}
                    />
                  )}
                  
                  {/* Tab backing */}
                  <div 
                    className={`absolute -left-4 top-0 bottom-0 w-2 rounded-r-xl transition-all duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-50'
                    }`}
                    style={{ backgroundColor: colorScheme.bg }}
                  />
                  
                  {/* Tab content */}
                  <a
                    href={`/sections/${section.id}`}
                    className={`block p-3 rounded-r-xl transition-all duration-200 border-l-4 relative z-10 ${
                      isActive 
                        ? 'shadow-md font-semibold rounded-t-xl rounded-b-xl' 
                        : 'hover:shadow-sm font-medium rounded-r-xl'
                    }`}
                    style={{
                      backgroundColor: isActive ? colorScheme.bg : 'transparent',
                      borderLeftColor: colorScheme.bg,
                      color: isActive ? '#ffffff' : '#374151'
                    }}
                  >
                    <div className="text-sm leading-tight">{section.title}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {section.lessons?.length || 0} lessons
                    </div>
                  </a>
                </div>
              </div>
            );
          })}
          
          {/* Your Notes Tab */}
          <div className="mt-4 pt-4 border-t border-gray-300 space-y-1">
            <a
              href="/your-notes"
              className="block p-3 rounded-r-xl transition-all duration-200 border-l-4 hover:shadow-sm font-medium"
              style={{
                backgroundColor: 'transparent',
                borderLeftColor: '#6b7280',
                color: '#374151'
              }}
            >
              <div className="text-sm leading-tight">📝 Your Notes</div>
              <div className="text-xs opacity-75 mt-1">
                All your learning notes
              </div>
            </a>
            
            <a
              href="/step-back-journal"
              className="block p-3 rounded-r-xl transition-all duration-200 border-l-4 hover:shadow-sm font-medium"
              style={{
                backgroundColor: 'transparent',
                borderLeftColor: '#7c3aed',
                color: '#374151'
              }}
            >
              <div className="text-sm leading-tight">🤔 Step Back Journal</div>
              <div className="text-xs opacity-75 mt-1">
                Reflection responses
              </div>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area with Paper Surface */}
      <div className="flex-1 relative">
        {/* Paper page surface */}
        <div 
          className="min-h-screen ml-0 mr-4 mt-4 mb-4 rounded-r-lg shadow-lg relative"
          style={{ 
            backgroundColor: currentSection ? currentColors.bg + '15' : '#fefdf8',
            borderLeft: currentSection ? `4px solid ${currentColors.bg}` : 'none'
          }}
        >
          {/* Paper texture overlay */}
          <div className="absolute inset-0 opacity-5 rounded-lg" 
               style={{
                 backgroundImage: `repeating-linear-gradient(
                   0deg,
                   transparent,
                   transparent 24px,
                   #ccc 24px,
                   #ccc 25px
                 )`
               }}
          />
          
          {/* Content area */}
          <div className="relative z-10 p-8">
            {/* Page Title */}
            <div className="border-b-2 border-gray-300 pb-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                EAP Facilitator Training: Supporting Materials
              </h1>
              <p className="text-gray-600">
                Professional development resources and training modules
              </p>
            </div>
            
            {/* Page content */}
            {children}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}