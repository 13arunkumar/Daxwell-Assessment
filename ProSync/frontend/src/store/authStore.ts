import { create } from 'zustand'
import { authAPI } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'project_manager' | 'client'
  avatar?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const response = await authAPI.login({ email, password })
    set({
      user: response.data.data.user,
      isAuthenticated: true,
      isLoading: false,
    })
  },

  register: async (data: any) => {
    const response = await authAPI.register(data)
    set({
      user: response.data.data.user,
      isAuthenticated: true,
      isLoading: false,
    })
  },

  logout: async () => {
    await authAPI.logout()
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  },

  fetchUser: async () => {
    try {
      const response = await authAPI.getMe()
      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },

  updateUser: (user: User) => {
    set({ user })
  },
}))
