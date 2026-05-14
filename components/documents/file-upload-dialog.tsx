'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import mammoth from 'mammoth'

interface FileUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete: () => void
}

export function FileUploadDialog({ open, onOpenChange, onUploadComplete }: FileUploadDialogProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supportedFormats = ['.txt', '.md', '.doc', '.docx']

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      validateAndSetFile(droppedFile)
    }
  }, [])

  const validateAndSetFile = (file: File) => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!supportedFormats.includes(extension)) {
      setError(`Unsupported file format. Please upload ${supportedFormats.join(', ')} files.`)
      return
    }
    setFile(file)
    setError(null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      validateAndSetFile(selectedFile)
    }
  }

  const parseFileContent = async (file: File): Promise<{ title: string; content: Record<string, unknown> }> => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    let title = file.name.replace(/\.(txt|md|doc|docx)$/i, '')
    let textContent = ''

    if (extension === '.doc' || extension === '.docx') {
      // Handle Word documents using mammoth
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      textContent = result.value
    } else {
      // Handle plain text and markdown
      textContent = await file.text()
    }

    const lines = textContent.split('\n')
    let contentLines = lines

    // Use first line as title if it looks like a heading
    if (lines[0]?.startsWith('#')) {
      title = lines[0].replace(/^#+\s*/, '')
      contentLines = lines.slice(1)
    } else if (lines[0]?.trim() && lines[0].length < 100) {
      // Use first line as title if it's short enough
      title = lines[0].trim()
      contentLines = lines.slice(1)
    }

    // Convert to TipTap JSON format
    const content = {
      type: 'doc',
      content: contentLines
        .join('\n')
        .split('\n\n')
        .filter(p => p.trim())
        .map(paragraph => ({
          type: 'paragraph',
          content: [{ type: 'text', text: paragraph.trim() }],
        })),
    }

    // Ensure at least one paragraph
    if (content.content.length === 0) {
      content.content = [{ type: 'paragraph', content: [] }]
    }

    return { title, content }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in to upload files')
      }

      const { title, content } = await parseFileContent(file)

      const { data: document, error: insertError } = await supabase
        .from('documents')
        .insert({
          title,
          content,
          owner_id: user.id,
        })
        .select()
        .single()

      if (insertError) throw insertError

      onUploadComplete()
      onOpenChange(false)
      setFile(null)
      router.push(`/documents/${document.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import document</DialogTitle>
          <DialogDescription>
            Upload a .txt, .md, .doc, or .docx file to create a new document. The file content will be imported as an editable document.
          </DialogDescription>
        </DialogHeader>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
            file && 'border-primary bg-primary/5'
          )}
        >
          {file ? (
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => setFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                Drag and drop your file here, or
              </p>
              <label htmlFor="file-upload">
                <Button variant="outline" asChild>
                  <span>Browse files</span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".txt,.md,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="sr-only"
                  onChange={handleFileSelect}
                />
              </label>
              <p className="mt-4 text-xs text-muted-foreground">
                Supported formats: {supportedFormats.join(', ')}
              </p>
            </>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? 'Importing...' : 'Import document'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
