/**
 * Login API endpoint.
 * Authenticates user with Laravel backend and creates a secure session.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<{ email: string; password: string }>(event)

  // Validate required fields
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required',
    })
  }

  try {
    // Authenticate with Laravel backend
    const response = await $fetch<{
      access_token: string
      user: {
        id: number
        name: string
        email: string
        permissions?: string[]
        roles?: string[]
      }
    }>(`${config.apiBase}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        email: body.email,
        password: body.password,
      },
    })

    // Create secure session with user data
    await setUserSession(event, {
      user: {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        permissions: response.user.permissions,
        roles: response.user.roles,
      },
      loggedInAt: new Date(),
      secure: {
        apiToken: response.access_token,
      },
    })

    return {
      success: true,
      user: response.user,
    }
  } catch (error: any) {
    const statusCode = error.statusCode || error.status || 401
    const message = error.data?.message || error.message || 'Invalid credentials'

    throw createError({
      statusCode,
      statusMessage: message,
    })
  }
})
