export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, initializeAuth } = useAuth()

  // Initialize auth state before checking authentication
  initializeAuth()

  // Small delay to ensure state is updated
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
