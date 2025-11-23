export interface ApiResponse<T = unknown> {
  status: number
  message: string | null
  data: T
}

export interface CreditTransaction {
  number_installments: number
  percent_amount: number
}

export interface CreditOptions {
  online?: CreditTransaction
  chip?: CreditTransaction
}

export interface PlanDetails {
  id: string
  name: string
}

export interface BoletoFee {
  percent_amount: number
  dollar_amount: number
}

export interface PixFee {
  percent_amount: number
  dollar_amount: number
}

export interface DebitFee {
  percent_amount: number
}

export interface SalesPlanData {
  plan_details: PlanDetails
  boleto: BoletoFee
  credit: Record<string, CreditOptions[]>
  debit: Record<string, DebitFee>
  pix: PixFee
}

export type SellerSalesPlanResponse = ApiResponse<SalesPlanData>
