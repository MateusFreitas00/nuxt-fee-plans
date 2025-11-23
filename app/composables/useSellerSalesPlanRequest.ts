import type { SalesPlanData, SellerSalesPlanResponse } from '~/types/fee-plans'

export function useSellerSalesPlanRequest() {
  async function get(sellerId: string): Promise<SalesPlanData> {
    try {
      const response = await $fetch<SellerSalesPlanResponse>(
        `/api/sellers/${sellerId}/fee-plans`,
        {
          method: 'GET',
        }
      )
      return response.data
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to fetch sales plan'
      throw new Error(errorMessage)
    }
  }

  return {
    get,
  }
}
