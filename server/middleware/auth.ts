export default defineEventHandler((event) => {
  const accessToken = getCookie(event, 'access_token')
  const refreshToken = getCookie(event, 'refresh_token')

  const path = getRequestURL(event).pathname

  const protectedRoutes = [
    '/api/auth/sso/logout',
    '/api/auth/sso/refresh',
    '/api/auth/sso/user',
  ]

  if (protectedRoutes.includes(path)) {
    if (!accessToken || !refreshToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }
  }
})
