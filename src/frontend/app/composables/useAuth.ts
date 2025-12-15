import type { User } from '#auth-utils'

/**
 * Authentication composable using nuxt-auth-utils.
 * Provides a clean interface for authentication operations
 * with secure cookie-based sessions.
 */
export const useAuth = () => {
  const { loggedIn, user, session, fetch: fetchSession, clear } = useUserSession()

  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Register a new user account.
   */
  const register = async (credentials: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; user: User }>('/api/auth/register', {
        method: 'POST',
        body: credentials,
      })

      // Refresh session to get updated user data
      await fetchSession()

      return response
    } catch (err: any) {
      error.value = err.data?.message || err.statusMessage || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Login with email and password.
   */
  const login = async (credentials: { email: string; password: string }) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; user: User }>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      })

      // Refresh session to get updated user data
      await fetchSession()

      return response
    } catch (err: any) {
      error.value = err.data?.message || err.statusMessage || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Logout the current user.
   */
  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      await clear()
    } catch (err: any) {
      console.error('Logout error:', err)
      // Still clear local session even if API call fails
      await clear()
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch fresh user profile from the server.
   */
  const getProfile = async () => {
    if (!loggedIn.value) return null

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ user: User }>('/api/auth/user')

      // Refresh session to get updated user data
      await fetchSession()

      return response
    } catch (err: any) {
      error.value = err.data?.message || err.statusMessage || 'Failed to get profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update user profile information.
   */
  const updateProfile = async (data: { name?: string; email?: string }) => {
    if (!loggedIn.value) throw new Error('Not authenticated')

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; user: User }>('/api/auth/user', {
        method: 'PUT',
        body: data,
      })

      // Refresh session to get updated user data
      await fetchSession()

      return response
    } catch (err: any) {
      error.value = err.data?.message || err.statusMessage || 'Failed to update profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Change user password. User will be logged out after success.
   */
  const changePassword = async (data: { current_password: string; password: string }) => {
    if (!loggedIn.value) throw new Error('Not authenticated')

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; message: string }>('/api/auth/change-password', {
        method: 'POST',
        body: data,
      })

      // Session is cleared by the server
      await fetchSession()

      return response
    } catch (err: any) {
      error.value = err.data?.message || err.statusMessage || 'Failed to change password'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    /** Current user data (null if not logged in) */
    user,
    /** Whether the user is currently authenticated */
    loggedIn,
    /** Alias for loggedIn for backward compatibility */
    isAuthenticated: loggedIn,
    /** Current session data */
    session,
    /** Loading state for async operations */
    loading: readonly(loading),
    /** Error message from the last failed operation */
    error: readonly(error),
    /** Register a new user */
    register,
    /** Login with credentials */
    login,
    /** Logout the current user */
    logout,
    /** Fetch fresh user profile */
    getProfile,
    /** Update user profile */
    updateProfile,
    /** Change user password */
    changePassword,
    /** Refresh session from server */
    fetchSession,
  }
}
