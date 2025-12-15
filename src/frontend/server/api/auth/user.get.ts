/**
 * Get current user profile endpoint.
 * Fetches fresh user data from Laravel backend and updates session.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const session = await requireUserSession(event)

  try {
    // Fetch fresh user data from Laravel backend
    const response = await $fetch<{
      user: {
        id: number
        name: string
        email: string
        permissions?: string[]
        roles?: string[]
      }
    }>(`${config.apiBase}/user`, {
      headers: {
        'Authorization': `Bearer ${session.secure?.apiToken}`,
        'Accept': 'application/json',
      },
    })

    // Update session with fresh user data
    await setUserSession(event, {
      user: {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        permissions: response.user.permissions,
        roles: response.user.roles,
      },
      loggedInAt: session.loggedInAt,
    })

    return {
      user: response.user,
    }
  } catch (error: any) {
    // If unauthorized, clear the session
    if (error.statusCode === 401 || error.status === 401) {
      await clearUserSession(event)
      throw createError({
        statusCode: 401,
        statusMessage: 'Session expired',
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch user profile',
    })
  }
})
