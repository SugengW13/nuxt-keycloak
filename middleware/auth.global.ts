interface MiddlewareMeta {
  unauthenticatedOnly?: boolean
  navigateAuthenticatedTo?: string
  navigateUnauthenticatedTo?: string
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const metaAuth: boolean | MiddlewareMeta = typeof to.meta.auth === 'object'
    ? { ...to.meta.auth }
    : to.meta.auth

  if (metaAuth === false) return

  const { isAuthenticated } = useKeycloak()

  const isUnauthenticatedOnly = typeof metaAuth === 'object' && metaAuth.unauthenticatedOnly

  if (isUnauthenticatedOnly && !isAuthenticated.value) return

  if (typeof metaAuth === 'object' && !isUnauthenticatedOnly) return

  if (isAuthenticated.value) {
    if (isUnauthenticatedOnly) return navigateTo(metaAuth.navigateAuthenticatedTo ?? '/')
    return
  }

  const loginRoute = '/login'

  if (loginRoute && loginRoute === to.path) return

  const mathedRoute = to.matched.length > 0

  if (!mathedRoute) return

  return navigateTo('/login')
})
