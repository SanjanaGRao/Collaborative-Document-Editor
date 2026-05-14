'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, History } from 'lucide-react'

interface Version {
  id: string
  version_number: number
  created_at: string
  user_id: string
  title: string
}

interface VersionHistoryPanelProps {
  documentId: string
  onClose: () => void
  isOpen: boolean
  onSelectVersion: (version: Version) => void
}

export function VersionHistoryPanel({
  documentId,
  onClose,
  isOpen,
  onSelectVersion,
}: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      loadVersions()
    }
  }, [isOpen, documentId])

  const loadVersions = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setVersions(data as Version[])
    } catch (err) {
      console.error('Error loading versions:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <History size={20} />
          <span>Version History</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center text-muted-foreground py-4">Loading versions...</div>
        ) : versions.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            <p>No versions yet.</p>
            <p className="text-xs mt-2">Click &quot;Save&quot; to create a version.</p>
          </div>
        ) : (
          versions.map(version => (
            <button
              key={version.id}
              onClick={() => onSelectVersion(version)}
              className="w-full mb-2 p-3 bg-muted rounded-lg border border-border hover:bg-muted/80 transition-colors text-left"
            >
              <div className="text-sm font-semibold">
                Version {version.version_number}: {version.title}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(version.created_at).toLocaleString()}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
