'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, UserPlus } from 'lucide-react'
import type { DocumentWithShares, DocumentShare } from '@/lib/types'

interface ShareDialogProps {
  document: DocumentWithShares | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSharesUpdated: () => void
}

export function ShareDialog({ document, open, onOpenChange, onSharesUpdated }: ShareDialogProps) {
  const [email, setEmail] = useState('')
  const [permission, setPermission] = useState<'view' | 'edit'>('view')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shares, setShares] = useState<DocumentShare[]>(document?.document_shares || [])

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!document || !email.trim()) return

    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: insertError } = await supabase
        .from('document_shares')
        .insert({
          document_id: document.id,
          shared_with_email: email.toLowerCase().trim(),
          permission,
        })

      if (insertError) {
        if (insertError.code === '23505') {
          setError('This document is already shared with this email')
        } else {
          throw insertError
        }
        return
      }

      // Fetch updated shares
      const { data: updatedShares } = await supabase
        .from('document_shares')
        .select('*')
        .eq('document_id', document.id)

      setShares(updatedShares || [])
      setEmail('')
      onSharesUpdated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share document')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveShare = async (shareId: string) => {
    const supabase = createClient()

    try {
      await supabase.from('document_shares').delete().eq('id', shareId)
      setShares(shares.filter(s => s.id !== shareId))
      onSharesUpdated()
    } catch (err) {
      console.error('Failed to remove share:', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share document</DialogTitle>
          <DialogDescription>
            Share &quot;{document?.title}&quot; with others by entering their email address.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleShare} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Select value={permission} onValueChange={(v: 'view' | 'edit') => setPermission(v)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="edit">Edit</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={isLoading || !email.trim()}>
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

        {shares.length > 0 && (
          <div className="space-y-2">
            <Label>Shared with</Label>
            <div className="space-y-2">
              {shares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div className="flex flex-col">
                    <span className="text-sm">{share.shared_with_email}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {share.permission}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveShare(share.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
