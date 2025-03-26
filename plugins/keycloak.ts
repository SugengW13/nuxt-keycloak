export default defineNuxtPlugin(async (nuxtApp) => {
  if (import.meta.server) return

  const { user, fetchUser, refresh } = useKeycloak()

  let refreshInterval: NodeJS.Timeout

  const visibilityHandler = () => {
    if (document.visibilityState === 'visible') fetchUser()
  }

  await fetchUser()

  if (user.value) await refresh()

  nuxtApp.hook('app:mounted', () => {
    document.addEventListener('visibilitychange', visibilityHandler, false)

    refreshInterval = setInterval(() => {
      if (user.value) refresh()
    }, 3 * 6e4)
  })

  const _unmount = nuxtApp.vueApp.unmount

  nuxtApp.vueApp.unmount = () => {
    document.removeEventListener('visibilitychange', visibilityHandler, false)
    clearInterval(refreshInterval)
    _unmount()
  }
})
