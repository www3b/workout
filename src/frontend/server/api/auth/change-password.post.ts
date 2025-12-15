/**
 * Change password endpoint.
 * Updates password on Laravel backend and clears session for re-authentication.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const session = await requireUserSession(event)
  const body = await readBody<{
    current_password: string
    password: string
  }>(event)

  // Validate required fields
  if (!body.current_password || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Current password and new password are required',
    })
  }

  try {
    // Change password on Laravel backend
    await $fetch(`${config.apiBase}/user/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.secure?.apiToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    })

    // Clear session - user must re-authenticate
    await clearUserSession(event)

    return {
      success: true,
      message: 'Password changed successfully. Please log in again.',
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Failed to change password',
    })
  }
})
