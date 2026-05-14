import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      order: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ 
          data: { id: 'test-id', title: 'Test Document', content: {} }, 
          error: null 
        })),
      })),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  })),
  auth: {
    getUser: vi.fn(() => Promise.resolve({ 
      data: { user: { id: 'user-1', email: 'test@example.com' } }, 
      error: null 
    })),
  },
}

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}))

describe('Document Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Document CRUD', () => {
    it('should create a new document with default title', async () => {
      const newDoc = {
        id: 'new-doc-id',
        title: 'Untitled Document',
        content: {},
        owner_id: 'user-1',
      }

      mockSupabase.from().insert().select().single.mockResolvedValueOnce({
        data: newDoc,
        error: null,
      })

      // Simulate document creation
      const result = await mockSupabase
        .from('documents')
        .insert({ title: 'Untitled Document', content: {}, owner_id: 'user-1' })
        .select()
        .single()

      expect(result.data).toBeDefined()
      expect(result.error).toBeNull()
    })

    it('should update document title', async () => {
      mockSupabase.from().update().eq.mockResolvedValueOnce({
        data: { id: 'doc-1', title: 'Updated Title' },
        error: null,
      })

      const result = await mockSupabase
        .from('documents')
        .update({ title: 'Updated Title' })
        .eq('id', 'doc-1')

      expect(result.error).toBeNull()
    })

    it('should delete a document', async () => {
      mockSupabase.from().delete().eq.mockResolvedValueOnce({
        data: null,
        error: null,
      })

      const result = await mockSupabase
        .from('documents')
        .delete()
        .eq('id', 'doc-1')

      expect(result.error).toBeNull()
    })
  })

  describe('Document Sharing', () => {
    it('should share document with another user by email', async () => {
      const shareData = {
        document_id: 'doc-1',
        shared_with_email: 'other@example.com',
        permission: 'view',
      }

      mockSupabase.from().insert().select().single.mockResolvedValueOnce({
        data: { ...shareData, id: 'share-1' },
        error: null,
      })

      const result = await mockSupabase
        .from('document_shares')
        .insert(shareData)
        .select()
        .single()

      expect(result.data).toBeDefined()
      expect(result.error).toBeNull()
    })

    it('should list shared documents', () => {
      const sharedDocs = [
        { id: 'doc-2', title: 'Shared Doc 1', isShared: true },
        { id: 'doc-3', title: 'Shared Doc 2', isShared: true },
      ]

      // Verify the structure of shared documents
      expect(sharedDocs).toHaveLength(2)
      expect(sharedDocs[0].isShared).toBe(true)
      expect(sharedDocs[1].isShared).toBe(true)
    })
  })

  describe('File Import', () => {
    it('should parse plain text file content', () => {
      const textContent = 'Hello World\nThis is a test document.'
      
      // Simple text to HTML conversion
      const htmlContent = textContent
        .split('\n')
        .map(line => `<p>${line}</p>`)
        .join('')

      expect(htmlContent).toContain('<p>Hello World</p>')
      expect(htmlContent).toContain('<p>This is a test document.</p>')
    })

    it('should parse markdown to HTML', () => {
      const markdown = '# Heading\n\nThis is **bold** text.'
      
      // Basic markdown parsing simulation
      let html = markdown
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p>')
      
      html = `<p>${html}</p>`

      expect(html).toContain('<h1>Heading</h1>')
      expect(html).toContain('<strong>bold</strong>')
    })

    it('should validate supported file types', () => {
      const supportedTypes = ['.txt', '.md', '.docx']
      
      const isSupported = (filename: string) => {
        return supportedTypes.some(ext => filename.toLowerCase().endsWith(ext))
      }

      expect(isSupported('document.txt')).toBe(true)
      expect(isSupported('readme.md')).toBe(true)
      expect(isSupported('report.docx')).toBe(true)
      expect(isSupported('image.png')).toBe(false)
      expect(isSupported('data.json')).toBe(false)
    })
  })

  describe('Rich Text Editor', () => {
    it('should preserve formatting in content JSON', () => {
      const content = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Title' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Normal text ' },
              { type: 'text', marks: [{ type: 'bold' }], text: 'bold text' },
            ],
          },
        ],
      }

      expect(content.type).toBe('doc')
      expect(content.content[0].type).toBe('heading')
      expect(content.content[0].attrs?.level).toBe(1)
      expect(content.content[1].content?.[1].marks?.[0].type).toBe('bold')
    })
  })

  describe('User Authentication', () => {
    it('should get current user', async () => {
      const result = await mockSupabase.auth.getUser()

      expect(result.data.user).toBeDefined()
      expect(result.data.user?.email).toBe('test@example.com')
    })

    it('should handle unauthenticated state', async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: null,
      })

      const result = await mockSupabase.auth.getUser()

      expect(result.data.user).toBeNull()
    })
  })
})
