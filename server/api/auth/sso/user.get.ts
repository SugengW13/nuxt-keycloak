export default defineEventHandler(defineKeycloakHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')

  const { keycloak } = event.context

  const url = `${keycloak.baseUrl}/realms/${keycloak.realm}/protocol/openid-connect/userinfo`

  const res = await $fetch(url, {
    headers: { Authorization: `Bearer ${accessToken!}` },
  })

  return {
    success: true,
    code: 200,
    data: res,
  }
}))
