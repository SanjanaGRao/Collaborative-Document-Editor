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
    <div className="sidebar-panel fixed right-0 top-16 bottom-0 z-40 flex flex-col">
      <div className="sidebar-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={20} />
          <span>Version History</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded">
          <X size={18} />
        </button>
      </div>

      <div className="sidebar-content flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center text-neutral-500 py-4">Loading versions...</div>
        ) : versions.length === 0 ? (
          <div className="text-center text-neutral-500 py-4">No versions yet</div>
        ) : (
          versions.map(version => (
            <button
              key={version.id}
              onClick={() => onSelectVersion(version)}
              className="version-item w-full"
            >
              <div className="version-number">
                Version {version.version_number}: {version.title}
              </div>
              <div className="version-date">
                {new Date(version.created_at).toLocaleString()}
              </div>
              <div className="version-author text-xs text-neutral-500">
                ID: {version.user_id.substring(0, 8)}...
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
