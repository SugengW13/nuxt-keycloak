import type { EventHandler } from 'h3'

export const defineKeycloakHandler = (handler: EventHandler): EventHandler => (
  defineEventHandler(async (event) => {
    if (process.env.KEYCLOAK_DISABLED === 'true') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Keycloak authentication is disabled',
      })
    }

    event.context.keycloak = {
      baseUrl: process.env.KEYCLOAK_BASE_URL || '',
      realm: process.env.KEYCLOAK_REALM || '',
      clientId: process.env.KEYCLOAK_CLIENT_ID || '',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
    }

    try {
      return await handler(event)
    }
    catch (e: any) {
      console.error(e)

      throw createError({
        statusCode: e?.response?.status || 500,
        statusMessage: e?.response?.statusText || 'Failed to authenticate with Keycloak',
      })
    }
  })
)
