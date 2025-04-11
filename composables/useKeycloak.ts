/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Keycloak composable for handling SSO-based authentication.
 * Provides methods to login, logout, fetch user, refresh token, and get user auth status.
 *
 * ⚠️ This composable depends on the `nuxt-csurf` module to provide CSRF protection for all API calls.
 */
export const useKeycloak = () => {
  // Inject Nuxt's app instance to access plugins like $csrfFetch (provided by nuxt-csurf)
  const { $csrfFetch } = useNuxtApp()

  /**
   * Reactive state holding the authenticated user's info.
   * It's set after a successful login or fetchUser call.
   */
  const user = useState<null | User>('keycloak:user', () => null)

  /**
   * Reactive loading state to track ongoing auth operations.
   * Useful for showing loading indicators during login, logout, etc.
   */
  const loading = useState('keycloak:loading', () => false)

  /**
   * Computed value indicating whether the user is authenticated.
   * Returns `true` if a user object exists in state.
   */
  const isAuthenticated = computed(() => !!user.value)

  /**
   * Fetches the current authenticated user's data from the server.
   * This is used to rehydrate session state (e.g. on page reload).
   *
   * @returns {Promise<{ success: boolean; data?: User }>} - Server response with user data if successful.
   */
  const fetchUser = async () => {
    loading.value = true

    try {
      const res: any = await $csrfFetch('/api/auth/sso/user', { method: 'GET' })

      if (res.success) user.value = res.data

      return res
    }
    catch (e) {
      user.value = null
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Refreshes the authentication token to extend the session.
   * Should be called periodically or when user returns to the app after inactivity.
   *
   * @returns {Promise<void>}
   */
  const refresh = async () => {
    loading.value = true

    try {
      await $csrfFetch('/api/auth/sso/refresh', { method: 'POST' })
    }
    catch (e) {
      throw e
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Logs in the user using a username and password.
   * After successful login, user data is fetched and navigation is performed if a redirect is specified.
   *
   * @param {Object} form - Login credentials.
   * @param {string} form.username - Username.
   * @param {string} form.password - Password.
   * @param {string} [redirectTo] - Optional path to navigate to after successful login.
   * @returns {Promise<{ success: boolean; data?: User }>} - Server response indicating login result.
   */
  const login = async (form: { username: string, password: string }, redirectTo?: string) => {
    loading.value = true

    try {
      const res = await $csrfFetch('/api/auth/sso/login', {
        method: 'POST',
        body: { ...form },
      })

      if (res.success) {
        await fetchUser()
        if (redirectTo) navigateTo(redirectTo)
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

  /**
   * Logs out the current user by calling the backend logout API.
   * Clears user state and optionally redirects to a specific route.
   *
   * @param {string} [redirectTo] - Optional path to navigate to after logout (e.g. login page).
   * @returns {Promise<{ success: boolean }>} - Server response indicating logout result.
   */
  const logout = async (redirectTo?: string) => {
    loading.value = true

    try {
      const res = await $csrfFetch('/api/auth/sso/logout', { method: 'POST' })

      if (res.success) {
        user.value = null
        if (redirectTo) navigateTo(redirectTo)
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
