'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#cdb48333' }}>
      <div className="text-center max-w-2xl mx-auto p-8 -mt-12">
        {/* EAP Logo */}
        <div className="mb-4">
          <img 
            src="/NewLogoTrans.png" 
            alt="EAP Logo" 
            className="mx-auto w-[240px] h-[240px] object-contain"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          EAP Facilitator Binder
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A comprehensive development program<br />
          for effective facilitation skills.
        </p>
        <button 
          className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
          style={{ backgroundColor: '#467edd' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#467edd'}
          onClick={() => router.push('/sections/orientation')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}