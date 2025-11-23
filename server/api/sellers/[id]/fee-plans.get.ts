import type { SellerSalesPlanResponse } from '~/types/fee-plans'

export default defineEventHandler(async (event): Promise<SellerSalesPlanResponse> => {
  const sellerId = getRouterParam(event, 'id')
  const config = useRuntimeConfig()

  if (!sellerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Seller ID is required',
    })
  }

  if (!config.public.impayBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API base URL is not configured',
    })
  }

  try {
    const response = await $fetch<SellerSalesPlanResponse>(
      `${config.public.impayBaseUrl}/sellers/${sellerId}/sales-plan`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    return response
  } catch (error: any) {
    const statusCode = error.response?.status || 500
    const statusMessage = error.response?.statusText || 'Failed to fetch sales plan'
    const errorData = error.response?.data || error.message

    throw createError({
      statusCode,
      statusMessage,
      data: {
        message: statusMessage,
        error: errorData,
      },
    })
  }
})
