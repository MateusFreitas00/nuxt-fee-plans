<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div v-if="isLoading" class="space-y-6">
        <div v-for="i in 5" :key="i" class="bg-gray-100 rounded p-6 animate-pulse">
          <div class="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div class="h-8 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <p class="text-red-800 font-medium mb-2">Erro ao carregar o plano de vendas</p>
        <p class="text-red-600 text-sm mb-4">{{ error }}</p>
        <button
          @click="fetchSalesPlan"
          class="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Tentar Novamente
        </button>
      </div>

      <div v-else-if="salesPlan" class="space-y-8">
        <div class="border-b border-gray-200 pb-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">
            Pix <span class="text-gray-600 font-normal">| Recebimento em <span class="font-semibold">1 dia</span></span>
          </h2>
          <p class="text-lg font-semibold text-gray-900">Taxa: {{ formatPercent(salesPlan.pix.percent_amount) }}</p>
        </div>

        <div class="border-b border-gray-200 pb-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">
            Boleto <span class="text-gray-600 font-normal">| Recebimento em <span class="font-semibold">1 dia</span></span>
          </h2>
          <p class="text-lg font-semibold text-gray-900">Tarifa: {{ formatCurrency(salesPlan.boleto.dollar_amount) }}</p>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-6">
            Crédito Online <span class="text-gray-600 font-normal">| Recebimento em <span class="font-semibold">{{ creditReceiptDays }}</span></span>
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-gray-300"></th>
                  <th v-for="brand in onlineBrands" :key="brand" class="px-4 py-3 text-center border-b border-gray-300">
                    <div v-if="brand !== 'default'" class="flex justify-center h-8">
                      <img
                        :src="getBrandLogo(brand)"
                        :alt="brand"
                        class="h-full w-auto"
                      />
                    </div>
                    <div v-else class="text-xs font-medium text-gray-600">Outras</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(_, index) in maxCreditInstallments" :key="index">
                  <td class="px-4 py-4 text-sm font-semibold text-gray-900 border-b border-gray-200">
                    {{ index === 0 ? 'À vista' : `${index + 1}x` }}
                  </td>
                  <td
                    v-for="brand in onlineBrands"
                    :key="brand"
                    class="px-4 py-4 text-center text-sm font-medium text-gray-900 border-b border-gray-200"
                    :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
                  >
                    {{ getOnlineCreditFee(brand, index) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-6">
            Crédito Físico <span class="text-gray-600 font-normal">| Recebimento em <span class="font-semibold">{{ creditReceiptDays }}</span></span>
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-gray-300"></th>
                  <th v-for="brand in chipBrands" :key="brand" class="px-4 py-3 text-center border-b border-gray-300">
                    <div v-if="brand !== 'default'" class="flex justify-center h-8">
                      <img
                        :src="getBrandLogo(brand)"
                        :alt="brand"
                        class="h-full w-auto"
                      />
                    </div>
                    <div v-else class="text-xs font-medium text-gray-600">Outras</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(_, index) in maxCreditInstallments" :key="index">
                  <td class="px-4 py-4 text-sm font-semibold text-gray-900 border-b border-gray-200">
                    {{ index === 0 ? 'À vista' : `${index + 1}x` }}
                  </td>
                  <td
                    v-for="brand in chipBrands"
                    :key="brand"
                    class="px-4 py-4 text-center text-sm font-medium text-gray-900 border-b border-gray-200"
                    :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
                  >
                    {{ getChipCreditFee(brand, index) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-6">
            Débito <span class="text-gray-600 font-normal">| Recebimento em <span class="font-semibold">1 dia</span></span>
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-gray-300"></th>
                  <th v-for="brand in debitBrands" :key="brand" class="px-4 py-3 text-center border-b border-gray-300">
                    <div v-if="brand !== 'default'" class="flex justify-center h-8">
                      <img
                        :src="getBrandLogo(brand)"
                        :alt="brand"
                        class="h-full w-auto"
                      />
                    </div>
                    <div v-else class="text-xs font-medium text-gray-600">Outras</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="px-4 py-4 text-sm font-semibold text-gray-900 border-b border-gray-200">À vista</td>
                  <td
                    v-for="brand in debitBrands"
                    :key="brand"
                    class="px-4 py-4 text-center text-sm font-medium text-gray-900 border-b border-gray-200 bg-gray-50"
                  >
                    {{ getDebitFee(brand) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-gray-600">Nenhum plano de vendas disponível</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SalesPlanData } from '~/types/fee-plans'
import { useSellerSalesPlanRequest } from '~/composables/useSellerSalesPlanRequest'

const route = useRoute()
const { get: getSalesPlan } = useSellerSalesPlanRequest()

const sellerId = computed(() => route.params.id as string)
const salesPlan = ref<SalesPlanData | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const PREFERRED_CREDIT_BRANDS = ['mastercard', 'visa', 'hipercard', 'elo', 'american-express', 'hiper']
const PREFERRED_DEBIT_BRANDS = ['maestro', 'visa-electron', 'hipercard', 'elo', 'hiper']

const creditReceiptDays = computed(() => {
  if (!salesPlan.value) return '30 dias'
  const planId = salesPlan.value.plan_details.id
  return planId.includes('d1') ? '1 dia' : '30 dias'
})

const onlineBrands = computed(() => {
  if (!salesPlan.value?.credit) return []
  const brands = Object.keys(salesPlan.value.credit)
  return sortBrands(brands, PREFERRED_CREDIT_BRANDS)
})

const chipBrands = computed(() => {
  if (!salesPlan.value?.credit) return []
  const brands = Object.keys(salesPlan.value.credit)
  return sortBrands(brands, PREFERRED_CREDIT_BRANDS)
})

const debitBrands = computed(() => {
  if (!salesPlan.value?.debit) return []
  const brands = Object.keys(salesPlan.value.debit)
  return sortBrands(brands, PREFERRED_DEBIT_BRANDS)
})

const maxCreditInstallments = computed(() => {
  if (!salesPlan.value?.credit || onlineBrands.value.length === 0) return 0
  const firstBrand = onlineBrands.value[0] as string
  return salesPlan.value.credit[firstBrand]?.length ?? 0
})

const getOnlineCreditFee = (brand: string, index: number): string => {
  if (!salesPlan.value?.credit[brand]?.[index]?.online) return '-'
  return formatPercent(salesPlan.value.credit[brand][index].online.percent_amount)
}

const getChipCreditFee = (brand: string, index: number): string => {
  if (!salesPlan.value?.credit[brand]?.[index]?.chip) return '-'
  return formatPercent(salesPlan.value.credit[brand][index].chip.percent_amount)
}

const getDebitFee = (brand: string): string => {
  if (!salesPlan.value?.debit[brand]) return '-'
  return formatPercent(salesPlan.value.debit[brand].percent_amount)
}

const sortBrands = (brands: string[], preferredBrands: string[]): string[] => {
  const preferred = brands.filter(b => preferredBrands.includes(b))
  const others = brands.filter(b => !preferredBrands.includes(b))

  preferred.sort((a, b) => preferredBrands.indexOf(a) - preferredBrands.indexOf(b))

  return [...preferred, ...others]
}

const formatPercent = (value: number): string => {
  return `${(value / 100).toFixed(2)}%`
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100)
}

const getBrandLogo = (brand: string): string => {
  return `/brands/${brand}.svg`
}

const fetchSalesPlan = async () => {
  if (!sellerId.value) return

  isLoading.value = true
  error.value = null

  try {
    const data = await getSalesPlan(sellerId.value)
    salesPlan.value = data
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar o plano de vendas'
    console.error('Error fetching sales plan:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSalesPlan()
})
</script>