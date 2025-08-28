import { NextRequest, NextResponse } from 'next/server';

// Define password configuration for different PDFs
const PDF_PASSWORDS: Record<string, string> = {
  'EAPFacilitatorSyllabus.pdf': 'EAP2025',
  'CompetencyFrameworkGuide.pdf': 'EAP2025',
  'Communication Resource Package.pdf': 'EAP2025',
  'Effective Listening Resource Package.pdf': 'EAP2025',
  'Equity and Inclusion Resource Package.pdf': 'EAP2025',
  'Leadership Resource Package.pdf': 'EAP2025',
  'Relationship Building Resource Package.pdf': 'EAP2025',
  'Self-Reflection Resource Package.pdf': 'EAP2025',
  'STEP BACK JOURNAL.pdf': 'EAP2025',
};

export async function POST(request: NextRequest) {
  try {
    const { pdfName, password } = await request.json();

    if (!pdfName || !password) {
      return NextResponse.json(
        { message: 'PDF name and password are required' },
        { status: 400 }
      );
    }

    // Extract filename from path if needed
    const filename = pdfName.split('/').pop() || pdfName;
    
    const correctPassword = PDF_PASSWORDS[filename];
    
    if (!correctPassword) {
      return NextResponse.json(
        { message: 'PDF not found' },
        { status: 404 }
      );
    }

    if (password !== correctPassword) {
      return NextResponse.json(
        { message: 'Incorrect password' },
        { status: 401 }
      );
    }

    // Generate a temporary access token that expires in 1 hour
    const accessToken = Buffer.from(
      JSON.stringify({
        pdfName: filename,
        timestamp: Date.now(),
        expires: Date.now() + (60 * 60 * 1000) // 1 hour
      })
    ).toString('base64');

    return NextResponse.json({
      success: true,
      accessToken,
      message: 'Password verified successfully'
    });

  } catch (error) {
    console.error('PDF password verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}