'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'
import { DocumentCard } from '@/components/documents/document-card'
import { ShareDialog } from '@/components/documents/share-dialog'
import { FileUploadDialog } from '@/components/documents/file-upload-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Upload, Search, FileText, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import type { DocumentWithShares } from '@/lib/types'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [ownedDocuments, setOwnedDocuments] = useState<DocumentWithShares[]>([])
  const [sharedDocuments, setSharedDocuments] = useState<DocumentWithShares[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithShares | null>(null)
  const router = useRouter()

  const fetchDocuments = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    setUser(user)

    // Fetch owned documents with shares
    const { data: owned } = await supabase
      .from('documents')
      .select(`
        *,
        document_shares (*)
      `)
      .eq('owner_id', user.id)
      .order('updated_at', { ascending: false })

    // Fetch documents shared with the user
    const { data: shares } = await supabase
      .from('document_shares')
      .select(`
        *,
        documents (
          *,
          profiles:owner_id (*)
        )
      `)
      .or(`shared_with_user_id.eq.${user.id},shared_with_email.eq.${user.email}`)

    const ownedWithShareFlag = (owned || []).map(doc => ({
      ...doc,
      is_shared: doc.document_shares && doc.document_shares.length > 0,
    }))

    const sharedDocs = (shares || [])
      .filter(share => share.documents)
      .map(share => ({
        ...share.documents,
        can_edit: share.permission === 'edit',
        profiles: share.documents.profiles,
      }))

    setOwnedDocuments(ownedWithShareFlag)
    setSharedDocuments(sharedDocs)
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleCreateDocument = async () => {
    console.log('[v0] handleCreateDocument called')
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    console.log('[v0] User:', user?.id, 'Error:', userError)
    if (!user) {
      console.log('[v0] No user found, returning')
      return
    }

    console.log('[v0] Creating document for user:', user.id)
    const { data: document, error } = await supabase
      .from('documents')
      .insert({
        title: 'Untitled Document',
        content: {
          type: 'doc',
          content: [{ type: 'paragraph', content: [] }],
        },
        owner_id: user.id,
      })
      .select()
      .single()

    console.log('[v0] Insert result:', document, 'Error:', error)
    if (error) {
      console.error('[v0] Error creating document:', error)
      alert(`Failed to create document: ${error.message}`)
      return
    }

    console.log('[v0] Redirecting to document:', document.id)
    router.push(`/documents/${document.id}`)
  }

  const handleDeleteDocument = async (id: string) => {
    const supabase = createClient()
    await supabase.from('documents').delete().eq('id', id)
    setOwnedDocuments(ownedDocuments.filter(doc => doc.id !== id))
  }

  const handleShareDocument = (document: DocumentWithShares) => {
    setSelectedDocument(document)
    setShareDialogOpen(true)
  }

  const filteredOwned = ownedDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredShared = sharedDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-muted/30">
      <Header user={user} />
      
      <main className="container px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="text-muted-foreground">Create, edit, and share your documents</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button onClick={handleCreateDocument}>
              <Plus className="mr-2 h-4 w-4" />
              New document
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs defaultValue="owned" className="space-y-6">
          <TabsList>
            <TabsTrigger value="owned" className="gap-2">
              <FileText className="h-4 w-4" />
              My documents ({filteredOwned.length})
            </TabsTrigger>
            <TabsTrigger value="shared" className="gap-2">
              <Users className="h-4 w-4" />
              Shared with me ({filteredShared.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="owned">
            {filteredOwned.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">No documents yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Create your first document to get started
                </p>
                <Button onClick={handleCreateDocument}>
                  <Plus className="mr-2 h-4 w-4" />
                  New document
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredOwned.map(doc => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    isOwner={true}
                    onDelete={handleDeleteDocument}
                    onShare={handleShareDocument}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shared">
            {filteredShared.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
                <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">No shared documents</h3>
                <p className="text-sm text-muted-foreground">
                  Documents shared with you will appear here
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredShared.map(doc => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    isOwner={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <ShareDialog
        document={selectedDocument}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onSharesUpdated={fetchDocuments}
      />

      <FileUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={fetchDocuments}
      />
    </div>
  )
}
