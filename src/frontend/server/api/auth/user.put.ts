/**
 * Update user profile endpoint.
 * Updates user data on Laravel backend and refreshes session.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const session = await requireUserSession(event)
  const body = await readBody<{ name?: string; email?: string }>(event)

  try {
    // Update user on Laravel backend
    const response = await $fetch<{
      user: {
        id: number
        name: string
        email: string
        permissions?: string[]
        roles?: string[]
      }
    }>(`${config.apiBase}/user`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.secure?.apiToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    })

    // Update session with new user data
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
      success: true,
      user: response.user,
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Failed to update profile',
    })
  }
})
