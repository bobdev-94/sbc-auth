import { InvoiceStatus, PaymentTypes, Product } from '@/util/constants'
import { LineItem } from '.'

export interface Transaction {
  businessIdentifier: string
  createdName: string
  createdOn: string
  details?: { label: string, value: string }[]
  folioNumber: string
  id: number
  invoiceNumber: string
  lineItems: LineItem[]
  paid: number
  paymentAccount: {
    accountId: string
    accountName: string
    billable: boolean
  }
  paymentMethod: PaymentTypes
  product: Product
  refund: number
  statusCode: InvoiceStatus
  total: number
  updatedOn: string
  refundDate: string
}

export interface TransactionFilter {
  accountName?: string,
  businessIdentifier?: string,
  createdBy?: string,
  createdName?: string,
  dateFilter?: {
    startDate: string
    endDate: string
    isDefault: boolean
  },
  details?: string,
  folioNumber?: string,
  id?: string,
  invoiceNumber?: string,
  lineItems?: string,
  lineItemsAndDetails?: string,
  paymentMethod?: PaymentTypes,
  product?: string,
  statusCode?: InvoiceStatus
  excludeCount?: boolean
}

export interface TransactionFilterParams {
  isActive: boolean
  filterPayload: TransactionFilter
  pageNumber?: number
  pageLimit?: number
}

export interface TransactionListResponse {
  items: Transaction[]
  limit: number
  page: number
  hasMore: boolean
}

export interface TransactionState {
  filters: TransactionFilterParams
  loading: boolean
  results: Transaction[]
  totalResults: number
}
