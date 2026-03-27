'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FolderKanban, CheckSquare, Bell, Settings, LogOut, Sparkles } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'project_manager', 'client'] },
  { name: 'Projects', href: '/projects', icon: FolderKanban, roles: ['admin', 'project_manager', 'client'] },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare, roles: ['admin', 'project_manager'] },
  { name: 'Notifications', href: '/notifications', icon: Bell, roles: ['admin', 'project_manager', 'client'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'project_manager', 'client'] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user?.role || 'client')
  )

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="surface-dark flex flex-col overflow-y-auto border-r border-white/10 px-4 pb-4 pt-5 text-white">
        <div className="flex items-center gap-3 px-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur">
            <span className="font-display text-xl font-bold text-white">P</span>
          </div>
          <div>
            <span className="font-display text-2xl font-bold tracking-tight text-white">ProSync</span>
            <p className="text-xs uppercase tracking-[0.28em] text-blue-200/75">Delivery Control</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-cyan-400/15 p-2 text-cyan-200">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Client-ready workspace</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                Keep projects, approvals, and updates in one polished hub.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col flex-grow">
          <nav className="flex-1 space-y-2 px-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-white text-slate-950 shadow-lg shadow-blue-950/20'
                      : 'text-slate-200/88 hover:bg-white/8 hover:text-white'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-cyan-200'
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 flex-shrink-0 rounded-3xl border border-white/10 bg-white/6 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 font-semibold text-white shadow-lg shadow-blue-950/30">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300/80">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto rounded-xl p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
