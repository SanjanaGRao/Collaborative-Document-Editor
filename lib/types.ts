export interface Document {
  id: string
  title: string
  content: Record<string, unknown>
  owner_id: string
  created_at: string
  updated_at: string
}

export interface DocumentShare {
  id: string
  document_id: string
  shared_with_email: string
  shared_with_user_id: string | null
  permission: 'view' | 'edit'
  created_at: string
}

export interface Profile {
  id: string
  email: string
  display_name: string
  created_at: string
}

export interface DocumentWithShares extends Document {
  document_shares?: DocumentShare[]
  profiles?: Profile
  is_shared?: boolean
  can_edit?: boolean
}
