'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children }: { children: React.ReactNode }) {
  const fetchUser = useAuthStore((state) => state.fetchUser)

  useEffect(() => {
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run once on mount

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
