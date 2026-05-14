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
    <div className="sidebar-panel fixed right-0 top-16 bottom-0 z-40 flex flex-col">
      <div className="sidebar-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} />
          <span>Comments</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded">
          <X size={18} />
        </button>
      </div>

      <div className="sidebar-content flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center text-neutral-500 py-4">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-neutral-500 py-4">No comments yet</div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="flex items-start justify-between">
                <span className="comment-author">{comment.author || 'Anonymous'}</span>
                {comment.status === 'open' && (
                  <button
                    onClick={() => handleResolveComment(comment.id)}
                    className="p-1 hover:bg-neutral-200 rounded text-neutral-600"
                    title="Resolve"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
              <p className="comment-text">{comment.content}</p>
              {comment.suggested_text && (
                <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200 text-sm">
                  <strong>Suggested:</strong> {comment.suggested_text}
                </div>
              )}
              <span className={`comment-status status-${comment.status}`}>
                {comment.status}
              </span>
              <div className="comment-time">
                {new Date(comment.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-neutral-200 p-4">
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border border-neutral-200 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <button
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          className="w-full mt-2 px-3 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-neutral-300 transition-colors"
        >
          Add Comment
        </button>
      </div>
    </div>
  )
}
