'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Check, MessageSquare } from 'lucide-react'

interface Comment {
  id: string
  content: string
  author: string
  created_at: string
  status: 'open' | 'resolved' | 'accepted' | 'rejected'
  is_suggestion: boolean
  suggested_text?: string
}

interface CommentsPanelProps {
  documentId: string
  onClose: () => void
  isOpen: boolean
}

export function CommentsPanel({ documentId, onClose, isOpen }: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [newComment, setNewComment] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      loadComments()
    }
  }, [isOpen, documentId])

  const loadComments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user_id,
          created_at
        `)
        .eq('document_id', documentId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments(data as Comment[])
    } catch (err) {
      console.error('Error loading comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from('comments').insert({
        document_id: documentId,
        user_id: user.id,
        content: newComment,
      })

      if (error) throw error

      setNewComment('')
      await loadComments()
    } catch (err) {
      console.error('Error adding comment:', err)
    }
  }

  const handleResolveComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ status: 'resolved' })
        .eq('id', commentId)

      if (error) throw error
      await loadComments()
    } catch (err) {
      console.error('Error resolving comment:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <MessageSquare size={20} />
          <span>Comments</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center text-muted-foreground py-4">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">No comments yet. Add one below!</div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="mb-4 p-3 bg-muted rounded-lg border border-border">
              <div className="flex items-start justify-between">
                <span className="text-sm font-semibold">{comment.author || 'Anonymous'}</span>
                {comment.status === 'open' && (
                  <button
                    onClick={() => handleResolveComment(comment.id)}
                    className="p-1 hover:bg-background rounded text-muted-foreground"
                    title="Resolve"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
              <p className="text-sm mt-2">{comment.content}</p>
              {comment.suggested_text && (
                <div className="mt-2 p-2 bg-purple-100 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800 text-sm">
                  <strong>Suggested:</strong> {comment.suggested_text}
                </div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  comment.status === 'open' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                  comment.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {comment.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-border p-4">
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border border-input bg-background rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          rows={3}
        />
        <button
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          className="w-full mt-2 px-3 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          Add Comment
        </button>
      </div>
    </div>
  )
}
