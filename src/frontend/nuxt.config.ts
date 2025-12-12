// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},

    modules: [
        '@nuxt/eslint',
        '@nuxt/ui',
        '@nuxt/image',
        '@nuxt/hints'
    ],

    css: [
        '~/assets/main.css'
    ],

    runtimeConfig: {
        apiBase: process.env.API_BASE_URL || 'http://localhost:8080/api',
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
        }
    },

    // Add development server configuration
    devServer: {
        host: process.env.NUXT_HOST || 'localhost',
        port: 3000
    }
})
