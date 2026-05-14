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
  const editorRef = useRef<HTMLDivElement | null>(null)
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

  const saveDocument = useCallback(async (newTitle: string, newContent: JSONContent, createVersion = false) => {
    if (!document || !canEdit || !user) return

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
      // Create a version entry when manually saving (not auto-save)
      if (createVersion) {
        // Get the current version count
        const { data: versions } = await supabase
          .from('document_versions')
          .select('version_number')
          .eq('document_id', document.id)
          .order('version_number', { ascending: false })
          .limit(1)
        
        const nextVersionNumber = versions && versions.length > 0 
          ? versions[0].version_number + 1 
          : 1

        await supabase.from('document_versions').insert({
          document_id: document.id,
          user_id: user.id,
          title: newTitle,
          content: newContent,
          version_number: nextVersionNumber,
        })
      }

      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }

    setIsSaving(false)
  }, [document, canEdit, user])

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
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="h-9 w-48 border-none bg-transparent px-2 text-lg font-medium shadow-none focus-visible:ring-0 sm:w-64"
              placeholder="Untitled Document"
              disabled={!canEdit}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Save status indicator */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {saveStatus === 'saving' && (
                <>
                  <Cloud className="h-4 w-4 animate-pulse" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="hidden sm:inline">Saved</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="hidden sm:inline">Error</span>
                </>
              )}
            </div>

            {/* Toolbar Buttons */}
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
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Comments</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVersionHistoryOpen(!versionHistoryOpen)}
            >
              <History className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </Button>

            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => saveDocument(title, content, true)}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            )}

            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareDialogOpen(true)}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Editor and Panels */}
      <div className="flex h-[calc(100vh-56px)]">
        {/* Main Editor */}
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-4xl px-4 py-8">
            {!canEdit && (
              <div className="mb-4 rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground">
                You have view-only access to this document.
              </div>
            )}
            <div ref={editorRef} className="bg-card rounded-lg border p-6 min-h-[500px]">
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
            canEdit={canEdit}
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
