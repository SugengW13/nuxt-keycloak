// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint', 'nuxt-csurf'],
  devtools: { enabled: true },
  routeRules: {
    '/': { redirect: '/login' },
    '/api/auth/sso/*': {
      csurf: { methodsToProtect: ['GET', 'POST'] },
    },
  },
  devServer: { port: 3030 },
  compatibilityDate: '2024-11-01',
  csurf: {
    https: process.env.CSURF_HTTPS === 'true',
    methodsToProtect: [],
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
