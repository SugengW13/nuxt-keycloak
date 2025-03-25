export default defineEventHandler(defineKeycloakHandler(async (event) => {
  const { keycloak } = event.context

  const body = await readBody(event)

  const url = `${keycloak.baseUrl}/realms/${keycloak.realm}/protocol/openid-connect/token`

  const params = new URLSearchParams()

  params.append('client_id', keycloak.clientId)
  params.append('client_secret', keycloak.clientSecret)
  params.append('scope', 'openid')
  params.append('grant_type', 'password')
  params.append('username', body.username)
  params.append('password', body.password)

  const res: any = await $fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  })

  setCookie(event, 'access_token', res.access_token, {
    sameSite: 'strict',
    httpOnly: true,
    secure: true,
    maxAge: 60 * 5
  })

  setCookie(event, 'refresh_token', res.refresh_token, {
    sameSite: 'strict',
    httpOnly: true,
    secure: true,
    maxAge: 60 * 5
  })

  return {
    success: true,
    code: 200,
    data: null
  }
}))
