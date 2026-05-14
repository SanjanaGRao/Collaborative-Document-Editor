'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { RichTextEditor } from '@/components/editor/rich-text-editor'
import { ShareDialog } from '@/components/documents/share-dialog'
import { CommentsPanel } from '@/components/documents/comments-panel'
import { VersionHistoryPanel } from '@/components/documents/version-history-panel'
import { ExportMenu } from '@/components/documents/export-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  Share2,
  Save,
  Check,
  Cloud,
  AlertCircle,
  MessageSquare,
  History,
} from 'lucide-react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import type { DocumentWithShares } from '@/lib/types'
import type { JSONContent } from '@tiptap/react'

export default function DocumentPage() {
  const params = useParams()
  const router = useRouter()
  const editorRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<User | null>(null)
  const [document, setDocument] = useState<DocumentWithShares | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<JSONContent>({ type: 'doc', content: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | 'idle'>('idle')
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchDocument = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    setUser(user)

    const { data: doc, error } = await supabase
      .from('documents')
      .select(`
        *,
        document_shares (*)
      `)
      .eq('id', params.id)
      .single()

    if (error || !doc) {
      router.push('/dashboard')
      return
    }

    const isDocOwner = doc.owner_id === user.id
    setIsOwner(isDocOwner)

    // Check if user has edit permission
    if (!isDocOwner) {
      const share = doc.document_shares?.find(
        (s: { shared_with_email: string; shared_with_user_id: string | null }) =>
          s.shared_with_email === user.email || s.shared_with_user_id === user.id
      )
      setCanEdit(share?.permission === 'edit')
    } else {
      setCanEdit(true)
    }

    setDocument(doc)
    setTitle(doc.title)
    setContent(doc.content || { type: 'doc', content: [] })
    setIsLoading(false)
  }, [params.id, router])

  useEffect(() => {
    fetchDocument()
  }, [fetchDocument])

  const saveDocument = useCallback(async (newTitle: string, newContent: JSONContent) => {
    if (!document || !canEdit) return

    setIsSaving(true)
    setSaveStatus('saving')

    const supabase = createClient()

    const { error } = await supabase
      .from('documents')
      .update({
        title: newTitle,
        content: newContent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', document.id)

    if (error) {
      console.error('Error saving document:', error)
      setSaveStatus('error')
    } else {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }

    setIsSaving(false)
  }, [document, canEdit])

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    debouncedSave(newTitle, content)
  }

  const handleContentChange = (newContent: JSONContent) => {
    setContent(newContent)
    debouncedSave(title, newContent)
  }

  const debouncedSave = useCallback((newTitle: string, newContent: JSONContent) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveDocument(newTitle, newContent)
    }, 1000)
  }, [saveDocument])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user || !document) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container flex h-16 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="hover:bg-neutral-100">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5 text-neutral-600" />
              </Link>
            </Button>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="h-10 w-80 border-none bg-neutral-50 px-3 text-lg font-semibold shadow-none focus-visible:ring-0 focus-visible:bg-white"
              placeholder="Untitled Document"
              disabled={!canEdit}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Save status indicator */}
            <div className="flex items-center gap-1 text-sm text-neutral-500 min-w-24">
              {saveStatus === 'saving' && (
                <>
                  <Cloud className="h-4 w-4 animate-pulse" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="hidden sm:inline">Saved</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="hidden sm:inline">Error</span>
                </>
              )}
            </div>

            {/* Toolbar Buttons */}
            <div className="flex items-center gap-2">
              <ExportMenu
                documentTitle={title}
                documentContent={content}
                editorRef={editorRef}
              />
              
              {canEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCommentsOpen(!commentsOpen)}
                  className="flex items-center gap-2 hover:bg-neutral-100"
                >
                  <MessageSquare size={18} className="text-neutral-600" />
                  <span className="hidden sm:inline text-sm">Comments</span>
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVersionHistoryOpen(!versionHistoryOpen)}
                className="flex items-center gap-2 hover:bg-neutral-100"
              >
                <History size={18} className="text-neutral-600" />
                <span className="hidden sm:inline text-sm">History</span>
              </Button>

              {canEdit && (
                <Button
                  size="sm"
                  onClick={() => saveDocument(title, content)}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save size={18} className="mr-2" />
                  Save
                </Button>
              )}

              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShareDialogOpen(true)}
                  className="border-neutral-300 hover:bg-neutral-50"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Editor and Panels */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Main Editor */}
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-4xl px-4 py-8">
            {!canEdit && (
              <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800 border border-blue-200">
                You have view-only access to this document.
              </div>
            )}
            <div ref={editorRef}>
              <RichTextEditor
                content={content}
                onChange={handleContentChange}
                editable={canEdit}
              />
            </div>
          </div>
        </main>

        {/* Comments Panel */}
        {commentsOpen && (
          <CommentsPanel
            documentId={params.id as string}
            onClose={() => setCommentsOpen(false)}
            isOpen={commentsOpen}
          />
        )}

        {/* Version History Panel */}
        {versionHistoryOpen && (
          <VersionHistoryPanel
            documentId={params.id as string}
            onClose={() => setVersionHistoryOpen(false)}
            isOpen={versionHistoryOpen}
            onSelectVersion={() => {}}
          />
        )}
      </div>

      <ShareDialog
        document={document}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onSharesUpdated={fetchDocument}
      />
    </div>
  )
}
