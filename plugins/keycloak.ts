export default defineNuxtPlugin(async (nuxtApp) => {
  const { user, fetchUser, refresh } = useKeycloak()

  await fetchUser()

  if (user.value) await refresh()

  const visibilityHandler = () => {
    if (document.visibilityState === 'visible') fetchUser()
  }

  let refreshInterval: NodeJS.Timeout

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
