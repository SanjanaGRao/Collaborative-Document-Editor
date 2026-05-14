# DocCollab - Collaborative Document Editor

A lightweight collaborative document editor inspired by Google Docs, built with Next.js 16, Supabase, and TipTap.

## Live Demo

The application is deployed and accessible via Vercel.

## Features

### 1. Document Creation and Editing
- Create new documents with automatic naming
- Rename documents inline
- Rich text editing with TipTap editor supporting:
  - **Bold**, *Italic*, and Underline formatting
  - Headings (H1, H2, H3)
  - Bulleted and numbered lists
- Auto-save functionality (saves on blur and content changes)
- Documents persist across sessions

### 2. File Upload and Import
Supported file types:
- `.txt` - Plain text files (converted to document)
- `.md` - Markdown files (parsed with basic heading/bold support)
- `.docx` - Microsoft Word documents (extracted using mammoth.js)

Files are converted to editable documents upon upload.

### 3. Document Sharing
- Share documents with other users by email
- Two permission levels: **View** (read-only) and **Edit** (full editing)
- Dashboard shows clear distinction between:
  - "My Documents" - documents you own
  - "Shared with Me" - documents others have shared with you
- Document owners can manage shares (add/remove collaborators)

### 4. Persistence
- PostgreSQL database via Supabase
- Row Level Security (RLS) for data protection
- Content stored as JSON (TipTap format) preserving all formatting
- Automatic profile creation on signup

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Editor**: TipTap (ProseMirror-based rich text editor)
- **Backend**: Supabase (PostgreSQL + Auth)
- **File Parsing**: mammoth.js for DOCX
- **Testing**: Vitest with React Testing Library
- **UI Components**: shadcn/ui

## Setup Instructions

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd doccollab
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Run the development server:
```bash
pnpm dev
```

5. Run tests:
```bash
pnpm vitest run
```

## Database Schema

```sql
-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content JSONB,
  owner_id UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- Document shares table
CREATE TABLE document_shares (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents,
  shared_with_email TEXT,
  shared_with_user_id UUID REFERENCES auth.users,
  permission TEXT CHECK (permission IN ('view', 'edit')),
  created_at TIMESTAMPTZ
);

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ
);
```

## Architecture Notes

### Prioritization Decisions

1. **Rich Text Editor**: Chose TipTap over alternatives (Slate, Draft.js) because:
   - First-class TypeScript support
   - ProseMirror foundation provides robust document model
   - Excellent extension system for formatting features
   - JSON-serializable content perfect for database storage

2. **Authentication**: Used Supabase Auth because:
   - Built-in email/password flow
   - Automatic session management
   - RLS integration for secure data access

3. **Sharing Model**: Implemented email-based sharing because:
   - Users can share before recipient has an account
   - Simple UX without user directory lookup
   - Shares link to user_id when recipient signs up

4. **File Import**: Prioritized .txt/.md/.docx because:
   - Covers most common document formats
   - mammoth.js handles complex DOCX structures
   - Markdown popular for technical users

### What I Would Add with More Time

1. **Real-time Collaboration**: WebSocket-based cursor presence and live editing
2. **Version History**: Track and restore document versions
3. **Comments and Suggestions**: Inline commenting system
4. **Export Options**: PDF, HTML export
5. **Folders/Organization**: Document hierarchy and tags
6. **Search**: Full-text search across documents

## AI-Native Workflow Note

### Tools Used
- **v0 by Vercel**: Primary development environment for scaffolding and iteration
- **Claude**: Architecture decisions and code review

### Where AI Accelerated Development
- Database schema design and RLS policy generation
- TipTap editor configuration and extension setup
- Supabase client boilerplate and auth flow
- Test file structure and mock setup

### What I Changed/Rejected
- Initial AI-generated RLS policies were overly permissive; tightened to require explicit ownership checks
- Rejected suggestion to use localStorage for persistence; insisted on proper database integration
- Modified auto-save logic to debounce more aggressively (prevent excessive API calls)
- Rewrote file upload dialog UI for better error handling and validation feedback

### Verification Process
- Manual testing of all CRUD operations
- Tested sharing flow with multiple accounts
- Verified RLS policies block unauthorized access
- Ran automated test suite (11 tests passing)
- Checked responsive design on mobile/tablet breakpoints

## License

MIT
