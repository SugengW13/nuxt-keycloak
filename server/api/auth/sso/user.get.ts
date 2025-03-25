export default defineEventHandler(defineKeycloakHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')

  // if (!accessToken) {
  //   throw createError({
  //     statusCode: 401,
  //     statusMessage: 'Unauthorized',
  //   })
  // }

  const { keycloak } = event.context

  const url = `${keycloak.baseUrl}/realms/${keycloak.realm}/protocol/openid-connect/userinfo`

  const res = await $fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  return {
    success: true,
    code: 200,
    data: res,
  }
}))
