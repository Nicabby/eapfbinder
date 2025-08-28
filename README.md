# EAP Facilitator Binder

A production-ready, no-login web application designed as a digital binder for the EAP Facilitator Development Program. Features side tabs for sections/competencies, page-flip animations, integrated note-taking, and comprehensive progress tracking.

## ✨ Features

- **📚 Digital Binder Experience**: Clean, paper-like interface with vertical tabs and binder ring aesthetics
- **✏️ Integrated Note-Taking**: Auto-saving notes on each lesson page with word count and timestamps  
- **📊 Progress Tracking**: Visual progress indicators for lessons and sections
- **🔍 Global Search**: Search across all lesson content and personal notes using Fuse.js
- **📤 Export Options**: Export all notes as Markdown or print-friendly format
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **♿ Accessibility**: Fully keyboard navigable with screen reader support
- **🔄 PWA Ready**: Service worker for offline note access (when enabled)
- **🎨 Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd binder

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Building for Production

```bash
# Build the application
npm run build

# Start production server locally
npm start
```

## 🌐 Deployment on Vercel

### Option 1: Deploy from GitHub (Recommended)

1. Push your code to a GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure build settings (auto-detected for Next.js)
6. Deploy

### Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# For production deployment
vercel --prod
```

## 📁 Project Structure

```
├── public/
│   ├── data/
│   │   └── course.json          # Course content and structure
│   └── resources/               # PDF resources and downloads
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── sections/
│   │       ├── layout.tsx       # Sections layout with tab rail
│   │       ├── [section]/
│   │       │   ├── page.tsx     # Section index page
│   │       │   └── [lesson]/
│   │       │       └── page.tsx # Individual lesson page
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── TabRail.tsx          # Main navigation component
│   │   ├── PagePaper.tsx        # Paper texture wrapper
│   │   └── NotesEditor.tsx      # Note-taking component
│   └── lib/
│       ├── storage.ts           # Storage adapter (localStorage/Supabase)
│       ├── store.ts             # Zustand state management
│       ├── courseData.ts        # Course data utilities
│       └── utils.ts             # Utility functions
├── components.json              # shadcn/ui configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── vercel.json                  # Vercel deployment configuration
```

## 📝 Content Management

### Adding New Lessons

1. Edit `/public/data/course.json`
2. Add lesson objects to the appropriate section's `lessons` array:

```json
{
  "id": "unique-lesson-id",
  "title": "Lesson Title", 
  "order": 1,
  "summary": "Brief description of the lesson content",
  "whyItMatters": "Explanation of lesson importance",
  "strategies": [
    "Key strategy or tool 1",
    "Key strategy or tool 2"
  ],
  "resources": [
    {
      "label": "Resource Name",
      "href": "/resources/filename.pdf",
      "type": "pdf"
    }
  ]
}
```

### Adding PDF Resources

1. Place PDF files in `/public/resources/`
2. Update the lesson's `resources` array with the correct file path
3. Ensure the `href` matches: `/resources/filename.pdf`

## 🔧 Storage Adapter Configuration

### Current: localStorage (Default)

Data is stored in the browser's localStorage with the prefix `binder.v1.`

### Switching to Supabase

1. Install Supabase client:
```bash
npm install @supabase/supabase-js
```

2. Create Supabase table:
```sql
CREATE TABLE user_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, key)
);
```

3. Update storage adapter in `/src/lib/storage.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'your-supabase-url';
const supabaseKey = 'your-supabase-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Replace the default export
export const storage = createSupabaseStorage(supabase, 'user-id');
```

## 📄 License

This project is designed for educational and professional development use.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS for modern facilitator development programs.
