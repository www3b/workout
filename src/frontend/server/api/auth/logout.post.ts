/**
 * Logout API endpoint.
 * Clears the session and invalidates the token on Laravel backend.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const session = await getUserSession(event)

  // Attempt to invalidate token on Laravel backend
  if (session.secure?.apiToken) {
    try {
      await $fetch(`${config.apiBase}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.secure.apiToken}`,
          'Accept': 'application/json',
        },
      })
    } catch (error) {
      // Log but don't fail - we still want to clear the local session
      console.warn('Failed to invalidate token on backend:', error)
    }
  }

  // Clear local session
  await clearUserSession(event)

  return {
    success: true,
  }
})
