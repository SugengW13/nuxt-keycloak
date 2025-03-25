/* eslint-disable @typescript-eslint/no-unused-vars */

export const useKeycloak = () => {
  const user = ref(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => Boolean(user.value))

  const fetchUser = async () => {
    loading.value = true

    try {
      const res: any = await $fetch('/api/auth/sso/user')

      if (res.success) user.value = res.data

      return res
    }
    catch (_) {
      user.value = null
    }
    finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    loading.value = true

    try {
      await $fetch('/api/auth/sso/refresh', { method: 'POST' })
    }
    catch (e) {
      throw e
    }
    finally {
      loading.value = false
    }
  }

  const login = async (username: string, password: string) => {
    loading.value = true

    try {
      const res: any = await $fetch('/api/auth/sso/login', {
        method: 'POST',
        body: { username, password },
      })

      if (res.success) {
        await fetchUser()
        navigateTo('/authenticated')
      }

      return res
    }
    catch (e) {
      throw e
    }
    finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true

    try {
      const res: any = await $fetch('/api/auth/sso/logout', { method: 'POST' })

      if (res.success) {
        user.value = null
        navigateTo('/login/sso')
      }

      return res
    }
    catch (e) {
      throw e
    }
    finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    fetchUser,
    refresh,
    login,
    logout,
  }
}
