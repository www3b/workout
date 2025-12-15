/**
 * API proxy endpoint.
 * Forwards requests to Laravel backend with authentication token from session.
 * This allows client-side code to make authenticated API calls without
 * exposing the token.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const session = await getUserSession(event)
  const path = getRouterParam(event, 'path')
  const method = getMethod(event)

  // Build headers
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }

  // Add auth token if session exists
  if (session.secure?.apiToken) {
    headers['Authorization'] = `Bearer ${session.secure.apiToken}`
  }

  // Get request body for non-GET requests
  let body: any = undefined
  if (method !== 'GET' && method !== 'HEAD') {
    body = await readBody(event)
  }

  // Get query parameters
  const query = getQuery(event)
  const queryString = new URLSearchParams(query as Record<string, string>).toString()
  const url = `${config.apiBase}/${path}${queryString ? `?${queryString}` : ''}`

  try {
    return await $fetch(url, {
      method,
      headers,
      body,
    })
  } catch (error: any) {
    // Handle 401 - clear session if token is invalid
    if (error.statusCode === 401 || error.status === 401) {
      await clearUserSession(event)
    }

    throw createError({
      statusCode: error.statusCode || error.status || 500,
      statusMessage: error.data?.message || error.message || 'API request failed',
      data: error.data,
    })
  }
})
