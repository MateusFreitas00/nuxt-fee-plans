export default defineEventHandler((event) => {
const url = event.node.req.url || ''
const publicRoutes = ['/error']
  if (publicRoutes.some((route) => url.startsWith(route))) {
    return
  }

  const parsedUrl = new URL(url, `http://${event.node.req.headers.host}`)
  const authKey = parsedUrl.searchParams.get('key')
  const expectedKey = process.env.NUXT_AUTH_KEY

  if (!expectedKey) {
    console.warn('NUXT_AUTH_KEY is not configured')
    return
  }

  if (!authKey || authKey !== expectedKey) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
})
