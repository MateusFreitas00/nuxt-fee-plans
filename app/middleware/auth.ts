export default defineNuxtRouteMiddleware((to) => {
  const authKey = to.query.key

  if (!authKey) {
    return navigateTo('/')
  }
})