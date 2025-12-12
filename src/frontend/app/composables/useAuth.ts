export const useAuth = () => {
  const config = useRuntimeConfig()
  const user = ref<Record<string, any>|null>(null)
  const token = ref<string|null>(null)
  const loading = ref(false)
  const error = ref(null)

  // Helper function to store auth data
  const storeAuthData = (response: Record<string, any>) => {
    token.value = response.access_token
    user.value = response.user
    console.log('User data fetched from API:', response.user)

    if (import.meta.client) {
      localStorage.setItem('auth_token', response.access_token)
      localStorage.setItem('auth_user', JSON.stringify(response.user))
    }
  }

  // Initialize auth state from localStorage
  const initializeAuth = () => {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')

      if (storedToken) {
        token.value = storedToken
      }
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
          console.log('User data loaded from localStorage:', user.value)
        } catch (error) {
          console.error('Failed to parse stored user data:', error)
          localStorage.removeItem('auth_user')
        }
      }
    }
  }

  // Register new user
  const register = async (credentials: { name: string; email: string; password: string; password_confirmation: string }) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<Record<string, any>>(`${config.public.apiBase}/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: credentials
      })

      // Store token and user
      storeAuthData(response)

      return response

    } catch (err: any) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Login user
  const login = async (credentials: { email: string; password: string }) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<Record<string, any>>(`${config.public.apiBase}/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: credentials
      })

      // Store token and user
      storeAuthData(response)

      return response
    } catch (err: any) {
      error.value = err.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout user
  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      if (token.value) {
        await $fetch<Record<string, any>>(`${config.public.apiBase}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.value}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      }
    } catch (err: any) {
      console.error('Logout error:', err)
    } finally {
      // Clear auth state regardless of API call success
      token.value = null
      user.value = null

      if (import.meta.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }

      loading.value = false
    }
  }

  // Get user profile
  const getProfile = async () => {
    if (!token.value) return null

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<Record<string, any>>(`${config.public.apiBase}/user`, {
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      user.value = response.user
      console.log('User data fetched from API:', response.user)

      if (import.meta.client) {
        localStorage.setItem('auth_user', JSON.stringify(response.user))
      }

      return response
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to get profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update profile
  const updateProfile = async (data: { name?: string; email?: string }) => {
    if (!token.value) throw new Error('Not authenticated')

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<Record<string, any>>(`${config.public.apiBase}/user`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: data
      })

      user.value = response.user
      console.log('User data fetched from API:', response.user)

      if (import.meta.client) {
        localStorage.setItem('auth_user', JSON.stringify(response.user))
      }

      return response
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to update profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Change password
  const changePassword = async (data: { current_password: string; password: string }) => {
    if (!token.value) throw new Error('Not authenticated')

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<Record<string, any>>(`${config.public.apiBase}/user/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: data
      })

      // Logout user after password change as required by backend
      await logout()

      return response
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to change password'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Check if user is authenticated
  const isAuthenticated = computed(() => !!token.value)

  return {
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    initializeAuth,
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword
  }
}
