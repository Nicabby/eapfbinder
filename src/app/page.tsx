'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to orientation section
    router.push('/sections/orientation');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#cdb48333' }}>
      <div className="text-center max-w-2xl mx-auto p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#467edd' }}></div>
        <p className="mt-4 text-gray-600">Redirecting to Orientation section...</p>
      </div>
    </div>
  );
}