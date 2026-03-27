'use client'

import { useRouter } from 'next/navigation'
import { Bell, Search, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'

export function Header() {
  const router = useRouter()
  const { user } = useAuthStore()
  const workspaceTarget =
    user?.role === 'admin' || user?.role === 'project_manager' ? '/projects/new' : '/projects'

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/65 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="surface-panel hidden items-center gap-3 rounded-2xl px-4 py-3 md:flex">
            <div className="rounded-xl bg-slate-950 p-2 text-white">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Workspace</p>
              <p className="text-sm font-medium text-slate-700">Track delivery, approvals, and client momentum</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-2.5 shadow-sm md:block">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Signed in as</p>
            <p className="text-sm font-semibold text-slate-900">{user?.name || 'ProSync User'}</p>
          </div>

          <button
            type="button"
            onClick={() => router.push(workspaceTarget)}
            className="hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-white shadow-lg shadow-blue-200/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 lg:block"
            title="Open workspace"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Live workspace</span>
            </div>
          </button>

          <Button variant="ghost" size="icon" className="relative rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm hover:bg-slate-50">
            <Bell className="h-5 w-5 text-slate-700" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-4 ring-white"></span>
          </Button>
        </div>
      </div>
    </header>
  )
}
