/**
 * Authentication middleware using nuxt-auth-utils.
 * Protects routes that require authentication.
 */
export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
