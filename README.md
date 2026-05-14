# Scribe - Collaborative Document Editor

A modern, dark-themed collaborative document editor built with Next.js 16, Supabase, and TipTap. Create, edit, share, and collaborate on documents with real-time synchronization and rich text formatting.

![Scribe](https://img.shields.io/badge/Status-Production%20Ready-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B6A8)

## 🎯 Features

### Core Document Editing
- **Rich Text Editing** - Bold, italic, underline, headings (H1-H3), bullet/numbered lists, blockquotes, and code blocks
- **Auto-Save** - Automatic saving with debounced intervals to prevent data loss
- **Document Management** - Create, rename, and organize documents with timestamps
- **Clean Dark UI** - Purple accent colors with near-black backgrounds for reduced eye strain

### Collaboration & Sharing
- **Email-Based Sharing** - Share documents by email with two permission levels:
  - **View** - Read-only access
  - **Edit** - Full editing permissions
- **Comments System** - Add, resolve, and track comments (edit access required)
- **Version History** - Track document versions with timestamps and rollback capability
- **Real-Time Sync** - Changes persist immediately to Supabase

### Export & Integration
- **PDF Export** - Generate professional PDFs with proper formatting
- **Multiple Export Options** - Markdown, HTML, and text exports
- **Session Persistence** - Documents sync across browser sessions and devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)
- Supabase account

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/SanjanaGRao/collaborative-document-editor.git
cd collaborative-document-editor
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Set up environment variables:**
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server:**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

### tables
- **profiles** - User profiles with display names
- **documents** - Document storage with JSON content (TipTap format)
- **document_shares** - Sharing permissions by email
- **document_versions** - Version snapshots with content history
- **document_comments** - Comments with status tracking

### Key Features
- Row Level Security (RLS) - Users can only access their own documents or shared documents
- JSONB Content Storage - Preserves all TipTap formatting
- Audit Trail - All operations tracked with timestamps

## 🏗️ Architecture

### Tech Stack
| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4 (design tokens system) |
| **Editor** | TipTap (ProseMirror-based) |
| **Backend** | Supabase (PostgreSQL + Auth) |
| **Export** | jsPDF for PDF generation |
| **Deployment** | Vercel |
| **Components** | shadcn/ui |

### Design Decisions

**1. Dark Purple Theme**
- CSS custom properties (design tokens) for consistency
- Semantic color system: `bg-background`, `text-foreground`, `text-primary`
- Single point of truth in `globals.css` for easy theming

**2. Permission Model**
- Server-side permission checks on every request
- Email-based sharing allows pre-account invitations
- Automatic permission validation during document access

**3. Rich Text Storage**
- TipTap JSON format for flexible, typeable content
- Preserves all formatting in database
- Easy version diffing and restoration

**4. Error Handling**
- Client-side validation for all forms
- Graceful fallbacks (e.g., PDF export with jsPDF native rendering)
- User-friendly error messages throughout

## 📝 Usage

### Creating Documents
1. Sign up or log in with email/password
2. Navigate to Dashboard
3. Click "New Document"
4. Start typing with rich text formatting

### Sharing Documents
1. Open a document you own
2. Click "Share" button
3. Enter email address and select permission level
4. Recipient sees document in "Shared with Me" tab

### Accessing Shared Documents
1. Log in with your account
2. Go to Dashboard
3. View "Shared with Me" tab
4. Open shared documents (with appropriate permissions)

### Adding Comments (Edit Access Required)
1. Click "Comments" in the toolbar
2. Type your comment and click "Add Comment"
3. Other editors can resolve comments
4. View-only users cannot see comments

### Viewing Version History
1. Click "History" in the toolbar
2. Select a previous version to view
3. Versions are created when you click "Save"

### Exporting Documents
1. Click "Export" menu
2. Choose format:
   - **PDF** - Professional document with formatting
   - **Markdown** - For use in other apps
   - **Text** - Plain text extraction

## 🧪 Testing

### Run Tests
```bash
pnpm test
```

### Test Coverage
- Document sharing validation
- Permission enforcement (edit vs view)
- Comment access restrictions
- Version history creation

## 🚢 Deployment

### Deploy to Vercel
1. Push changes to GitHub
2. Vercel automatically deploys on push
3. Environment variables configured in Vercel dashboard

### Environment Setup
Vercel automatically injects these from Supabase integration:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🎨 Customization

### Theme Colors
Edit `/app/globals.css` to customize:
- `--background` - Primary background
- `--foreground` - Primary text
- `--primary` - Accent color (purple by default)
- `--card` - Card surfaces

All components automatically inherit theme changes.

## 🔒 Security

- **Authentication** - Supabase Auth with email verification
- **Row Level Security** - PostgreSQL RLS policies prevent unauthorized access
- **Server-Side Validation** - All permissions checked server-side
- **Secure Sessions** - HTTP-only cookies for session management
- **Content Sanitization** - TipTap prevents XSS via content validation

## 🎯 Architecture Priorities

### What We Optimized For
1. **Real-Time UX** - Debounced auto-save, instant UI feedback
2. **Data Integrity** - Server-side permission checks, RLS policies
3. **Maintainability** - Semantic tokens, component reusability, clear patterns
4. **User Experience** - Progressive enhancement, graceful degradation

### Future Enhancements
- Real-time cursor presence and live collaboration
- Advanced search across documents
- Document folders and tags
- Webhook integrations
- API for third-party integrations
- Offline support with sync

## 📚 Documentation

- **[ENGINEERING.md](./ENGINEERING.md)** - In-depth architecture, setup, and AI workflow notes
- **API Documentation** - See API route files in `/app/api/`
- **Component Documentation** - See component files in `/components/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Editor powered by [TipTap](https://tiptap.dev/)
- Backend by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Deployment via [Vercel](https://vercel.com/)

---

**Ready to collaborate?** [Get started now](https://scribe-collaborative-editor.vercel.app)
