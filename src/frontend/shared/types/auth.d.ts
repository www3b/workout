/**
 * Type declarations for nuxt-auth-utils session data.
 * These types define the structure of user and session data
 * stored in encrypted cookies.
 */
declare module '#auth-utils' {
  /**
   * User data stored in the session.
   * Keep minimal to stay within cookie size limits.
   */
  interface User {
    id: number
    name: string
    email: string
    permissions?: string[]
    roles?: string[]
  }

  /**
   * Public session data accessible on both client and server.
   */
  interface UserSession {
    loggedInAt: Date
  }

  /**
   * Private session data only accessible on the server.
   * Used for sensitive information like API tokens.
   */
  interface SecureSessionData {
    apiToken: string
  }
}

export {}
