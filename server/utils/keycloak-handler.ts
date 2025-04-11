import type { EventHandler } from 'h3'

/**
 * Wrapper to inject Keycloak configuration into the H3 event context
 * and standardize error handling for Keycloak-based API routes.
 *
 * @param handler - The actual request handler function to execute
 * @returns A new handler wrapped with Keycloak context and error handling
 */
export const defineKeycloakHandler = (handler: EventHandler): EventHandler => (
  defineEventHandler(async (event) => {
    // Skip execution if Keycloak is explicitly disabled via env variable
    if (process.env.KEYCLOAK_DISABLED === 'true') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Keycloak authentication is disabled',
      })
    }

    // Attach Keycloak configuration values to the H3 event context.
    // These will be available to any downstream logic within the handler.
    event.context.keycloak = {
      baseUrl: process.env.KEYCLOAK_BASE_URL || '',
      realm: process.env.KEYCLOAK_REALM || '',
      clientId: process.env.KEYCLOAK_CLIENT_ID || '',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
    }

    try {
      // Proceed to execute the provided handler function with the enriched context
      return await handler(event)
    }
    catch (e: any) {
      // Log any errors encountered during handler execution
      console.error(e)

      // Re-throw a formatted error with a more meaningful message and status
      throw createError({
        statusCode: e?.response?.status || 500,
        statusMessage: e?.response?.statusText || 'Failed to authenticate with Keycloak',
      })
    }
  })
)
