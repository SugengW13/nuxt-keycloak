// Interface to support meta-based route control for authentication
interface MiddlewareMeta {
  unauthenticatedOnly?: boolean // Route should only be accessed by unauthenticated users
  navigateAuthenticatedTo?: string // Redirect authenticated users to this path if route is unauthenticatedOnly
  navigateUnauthenticatedTo?: string // Redirect unauthenticated users to this path
}

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware logic on the server side
  if (import.meta.server) return

  // Normalize the `to.meta.auth` value into a boolean or structured object
  const metaAuth: boolean | MiddlewareMeta = typeof to.meta.auth === 'object'
    ? { ...to.meta.auth }
    : to.meta.auth

  // If no auth rules are set for this route, skip the middleware
  if (metaAuth === false) return

  // Get the current auth state from the Keycloak composable
  const { isAuthenticated } = useKeycloak()

  // Check if the route is meant only for unauthenticated users
  const isUnauthenticatedOnly = typeof metaAuth === 'object' && metaAuth.unauthenticatedOnly

  // Allow unauthenticated-only routes to proceed when user is not authenticated
  if (isUnauthenticatedOnly && !isAuthenticated.value) return

  // Allow routes with metaAuth object (but not restricted to unauthenticatedOnly) to proceed
  if (typeof metaAuth === 'object' && !isUnauthenticatedOnly) return

  // If user is authenticated and tries to access an unauthenticated-only route, redirect them
  if (isAuthenticated.value) {
    if (isUnauthenticatedOnly) {
      return navigateTo(metaAuth.navigateAuthenticatedTo ?? '/') // Redirect to defined path or home
    }
    return // User is authenticated and allowed on this route
  }

  // Define the login route path
  const loginRoute = '/login'

  // If the current path is already the login route, don't redirect again
  if (loginRoute && loginRoute === to.path) return

  // Prevent redirecting if the route doesn't match any known route
  const mathedRoute = to.matched.length > 0
  if (!mathedRoute) return

  // User is not authenticated and trying to access a protected route — redirect to login
  return navigateTo('/login')
})
