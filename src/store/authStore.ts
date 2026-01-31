import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '../api/client'

export type UserRole = 'owner' | 'investor' | 'support' | 'teamlead' | 'trader'

export interface User {
  id: string
  username: string
  role: UserRole
  teamId?: string
  teamName?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string, email?: string) => Promise<boolean>
  logout: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      initializeAuth: () => {
        const { token } = get()
        if (token) {
          apiClient.setToken(token)
        }
      },

      login: async (username: string, password: string) => {
        // Hardcoded credentials
        if (username === 'admin' && password === 'admin') {
          const user: User = {
            id: '1',
            username: 'admin',
            role: 'owner',
          }

          set({
            user,
            token: 'fake-token-admin',
            isAuthenticated: true,
          })

          return true
        }

        return false
      },

      register: async (username: string, password: string, email?: string) => {
        // Hardcoded - registration disabled, just try to login
        return await get().login(username, password)
      },

      logout: () => {
        apiClient.setToken(null)
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'advancepay-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          apiClient.setToken(state.token)
        }
      },
    }
  )
)
