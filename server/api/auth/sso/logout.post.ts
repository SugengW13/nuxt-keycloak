export default defineEventHandler(defineKeycloakHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  const refreshToken = getCookie(event, 'refresh_token')

  if (!accessToken || !refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const { keycloak } = event.context

  const url = `${keycloak.baseUrl}/realms/${keycloak.realm}/protocol/openid-connect/logout`

  const params = new URLSearchParams()

  params.append('client_id', keycloak.clientId)
  params.append('client_secret', keycloak.clientSecret)
  params.append('refresh_token', refreshToken);

  await $fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  })

  deleteCookie(event, 'access_token')
  deleteCookie(event, 'refresh_token')

  return {
    success: true,
    code: 200,
    data: null
  }
}))
