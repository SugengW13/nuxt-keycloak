export default defineNuxtPlugin(async (nuxtApp) => {
  // Ensure this plugin runs only on the client side
  if (import.meta.server) return

  // Destructure key methods and state from the Keycloak composable
  const { user, fetchUser, refresh } = useKeycloak()

  let refreshInterval: NodeJS.Timeout

  /**
   * Called when the tab or window becomes visible again.
   * Useful for revalidating user session after returning to the tab.
   */
  const visibilityHandler = () => {
    if (document.visibilityState === 'visible') fetchUser()
  }

  // Fetch user data immediately when the app loads
  await fetchUser()

  // If a user is authenticated, immediately refresh their token to extend the session
  if (user.value) await refresh()

  // Hook into Nuxt's app lifecycle - when the app is fully mounted on the client
  nuxtApp.hook('app:mounted', () => {
    // Attach visibility handler to track when user returns to the tab
    document.addEventListener('visibilitychange', visibilityHandler, false)

    // Set up a periodic refresh every 3 minutes (180,000 ms)
    refreshInterval = setInterval(() => {
      if (user.value) refresh()
    }, 3 * 6e4)
  })

  // Override the default Vue unmount function to clean up event listeners and intervals
  const _unmount = nuxtApp.vueApp.unmount

  nuxtApp.vueApp.unmount = () => {
    // Remove event listener when app is unmounted
    document.removeEventListener('visibilitychange', visibilityHandler, false)
    // Clear interval to avoid memory leaks
    clearInterval(refreshInterval)
    // Call original unmount
    _unmount()
  }
})
