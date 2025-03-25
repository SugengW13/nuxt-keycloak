export default defineEventHandler(defineKeycloakHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token')

  const { keycloak } = event.context

  const url = `${keycloak.baseUrl}/realms/${keycloak.realm}/protocol/openid-connect/token`

  const params = new URLSearchParams()

  params.append('client_id', keycloak.clientId)
  params.append('client_secret', keycloak.clientSecret)
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', refreshToken!)

  const res: any = await $fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  })

  setCookie(event, 'access_token', res.access_token, {
    sameSite: 'strict',
    httpOnly: true,
    secure: true,
    maxAge: 60 * 5,
  })

  setCookie(event, 'refresh_token', res.refresh_token, {
    sameSite: 'strict',
    httpOnly: true,
    secure: true,
    maxAge: 60 * 5,
  })

  return {
    success: true,
    code: 200,
    data: null,
  }
}))
