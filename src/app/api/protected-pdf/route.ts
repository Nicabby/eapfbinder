import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pdfName = searchParams.get('pdf');
    const token = searchParams.get('token');

    if (!pdfName || !token) {
      return NextResponse.json(
        { message: 'PDF name and access token are required' },
        { status: 400 }
      );
    }

    // Verify the access token
    try {
      const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
      
      if (tokenData.expires < Date.now()) {
        return NextResponse.json(
          { message: 'Access token has expired' },
          { status: 401 }
        );
      }

      if (tokenData.pdfName !== pdfName) {
        return NextResponse.json(
          { message: 'Invalid access token for this PDF' },
          { status: 401 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid access token' },
        { status: 401 }
      );
    }

    // Serve the PDF file
    const pdfPath = join(process.cwd(), 'public', 'resources', pdfName);
    
    try {
      const pdfBuffer = await readFile(pdfPath);
      
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${pdfName}"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      });
    } catch (fileError) {
      return NextResponse.json(
        { message: 'PDF file not found' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Protected PDF serving error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}