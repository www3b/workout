/**
 * Registration API endpoint.
 * Creates new user via Laravel backend and establishes a session.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<{
    name: string
    email: string
    password: string
    password_confirmation: string
  }>(event)

  // Validate required fields
  if (!body.name || !body.email || !body.password || !body.password_confirmation) {
    throw createError({
      statusCode: 400,
      statusMessage: 'All fields are required',
    })
  }

  if (body.password !== body.password_confirmation) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Passwords do not match',
    })
  }

  try {
    // Register with Laravel backend
    const response = await $fetch<{
      access_token: string
      user: {
        id: number
        name: string
        email: string
        permissions?: string[]
        roles?: string[]
      }
    }>(`${config.apiBase}/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        name: body.name,
        email: body.email,
        password: body.password,
        password_confirmation: body.password_confirmation,
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
    const statusCode = error.statusCode || error.status || 400
    const message = error.data?.message || error.message || 'Registration failed'

    throw createError({
      statusCode,
      statusMessage: message,
    })
  }
})
