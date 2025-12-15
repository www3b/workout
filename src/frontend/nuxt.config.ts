// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},

    modules: [
      '@nuxt/eslint',
      '@nuxt/ui',
      '@nuxt/image',
      '@nuxt/hints',
      'nuxt-auth-utils'
    ],

    css: [
        '~/assets/main.css'
    ],

    runtimeConfig: {
        // Server-side Laravel API URL
        apiBase: process.env.API_BASE_URL || 'http://localhost:8080/api',
        public: {
            // Client-side API base (proxied through Nuxt server)
            apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api/proxy',
        },
    },

    // Add development server configuration
    devServer: {
        host: process.env.NUXT_HOST || 'localhost',
        port: 3000
    }
})