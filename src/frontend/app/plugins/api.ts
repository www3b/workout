/**
 * API plugin providing authenticated $fetch instance.
 * Routes requests through server proxy to include auth token from session.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
    baseURL: '/api/proxy',
    async onResponseError({ response }) {
      if (response.status === 401 && process.client) {
        await nuxtApp.runWithContext(async () => {
          const route = useRoute()
          if (route.path !== '/login' && route.path !== '/register') {
            await navigateTo('/login')
          }
        })
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
