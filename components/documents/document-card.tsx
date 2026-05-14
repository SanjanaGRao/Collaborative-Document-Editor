'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileText, MoreVertical, Trash2, Share2, Users } from 'lucide-react'
import Link from 'next/link'
import type { DocumentWithShares } from '@/lib/types'

interface DocumentCardProps {
  document: DocumentWithShares
  isOwner: boolean
  onDelete?: (id: string) => void
  onShare?: (document: DocumentWithShares) => void
}

export function DocumentCard({ document, isOwner, onDelete, onShare }: DocumentCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <CardTitle className="line-clamp-1 text-base">
              <Link 
                href={`/documents/${document.id}`}
                className="hover:underline"
              >
                {document.title}
              </Link>
            </CardTitle>
            <CardDescription className="text-xs">
              {isOwner ? 'Owned by you' : `Shared by ${document.profiles?.display_name || document.profiles?.email || 'Unknown'}`}
            </CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/documents/${document.id}`}>
                <FileText className="mr-2 h-4 w-4" />
                Open
              </Link>
            </DropdownMenuItem>
            {isOwner && (
              <>
                <DropdownMenuItem onClick={() => onShare?.(document)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete?.(document.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Updated {formatDate(document.updated_at)}</span>
          {document.is_shared && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Shared</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
