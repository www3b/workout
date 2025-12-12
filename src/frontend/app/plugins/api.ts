export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    const apiFetch = $fetch.create({
        baseURL: import.meta.server
            ? config.apiBase : config.public.apiBase,

        credentials: 'include',
    })

    return {
        provide: {
            api: apiFetch
        }
    }
})
