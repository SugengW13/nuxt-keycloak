/* eslint-disable @typescript-eslint/no-unused-vars */

export const useKeycloak = () => {
  const { $csrfFetch } = useNuxtApp()

  const user = useState<null | any>('keycloak:user', () => null)
  const isLoading = useState<boolean>('keycloak:is-loading', () => false)

  const isAuthenticated = computed(() => !!user.value)

  const fetchUser = async () => {
    isLoading.value = true

    try {
      const res: any = await $csrfFetch('/api/auth/sso/user')

      if (res.success) user.value = res.data

      return res
    }
    catch (_) {
      user.value = null
    }
    finally {
      isLoading.value = false
    }
  }

  const refresh = async () => {
    isLoading.value = true

    try {
      await $csrfFetch('/api/auth/sso/refresh', { method: 'POST' })
    }
    catch (e) {
      throw e
    }
    finally {
      isLoading.value = false
    }
  }

  const login = async (form: { username: string, password: string }, redirectTo?: string) => {
    isLoading.value = true

    try {
      const res: any = await $csrfFetch('/api/auth/sso/login', {
        method: 'POST',
        body: { ...form },
      })

      if (res.success) {
        await fetchUser()
        navigateTo(redirectTo)
      }

      return res
    }
    catch (e) {
      throw e
    }
    finally {
      isLoading.value = false
    }
  }

  const logout = async (redirectTo?: string) => {
    isLoading.value = true

    try {
      const res: any = await $csrfFetch('/api/auth/sso/logout', { method: 'POST' })

      if (res.success) {
        user.value = null
        navigateTo(redirectTo)
      }

      return res
    }
    catch (e) {
      throw e
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    fetchUser,
    refresh,
    login,
    logout,
  }
}
