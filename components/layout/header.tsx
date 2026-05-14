'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileText, LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface HeaderProps {
  user: SupabaseUser
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/logo.jpg" alt="Scribe" className="h-8 w-8 rounded" />
          <span className="font-bold text-neutral-900 text-lg">Scribe</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 hover:bg-neutral-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-neutral-900">{displayName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-neutral-200">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <User className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
