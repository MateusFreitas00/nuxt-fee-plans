// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  css: ["~/assets/css/main.css"],

  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
  ],

  sourcemap: { client: "hidden" },

  ui: {
    colorMode: false,
  },

  app: {
    head: {
      meta: [
        {
          name: 'robots',
          content: 'noindex, nofollow',
        },
      ],
    },
  },

  runtimeConfig: {
    authKey: process.env.NUXT_AUTH_KEY,
    public: {
      impayBaseUrl: process.env.NUXT_API_IMPAY_BASE_URL,
    },
  },
});