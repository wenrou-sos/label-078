export enum LampType {
  GHEE = 'ghee',
  LOTUS = 'lotus',
  ELECTRONIC = 'electronic',
  ETERNAL = 'eternal'
}

export const LampTypeLabel: Record<LampType, string> = {
  [LampType.GHEE]: '酥油灯',
  [LampType.LOTUS]: '莲花灯',
  [LampType.ELECTRONIC]: '电子灯',
  [LampType.ETERNAL]: '长明灯'
}

export const LampOilConsumption: Record<LampType, number> = {
  [LampType.GHEE]: 0.5,
  [LampType.LOTUS]: 0.3,
  [LampType.ELECTRONIC]: 0,
  [LampType.ETERNAL]: 0
}

export interface LampPriceConfig {
  unit: 'day' | 'year'
  price: number
}

export const LampPrice: Record<LampType, LampPriceConfig> = {
  [LampType.GHEE]: { unit: 'day', price: 5 },
  [LampType.LOTUS]: { unit: 'day', price: 8 },
  [LampType.ELECTRONIC]: { unit: 'day', price: 3 },
  [LampType.ETERNAL]: { unit: 'year', price: 2000 }
}

export enum BillStatus {
  UNPAID = 'unpaid',
  PAID = 'paid'
}

export const BillStatusLabel: Record<BillStatus, string> = {
  [BillStatus.UNPAID]: '未付款',
  [BillStatus.PAID]: '已付款'
}

export interface Bill {
  id: string
  date: string
  lampId: string
  devoteeName: string
  lampType: LampType
  hallName: string
  lampPosition: string
  days: number
  unitPrice: number
  totalAmount: number
  status: BillStatus
  paidDate?: string
  operator: string
}

export enum LampStatus {
  ON = 'on',
  WARNING = 'warning',
  OFF = 'off'
}

export const LampStatusLabel: Record<LampStatus, string> = {
  [LampStatus.ON]: '常亮',
  [LampStatus.WARNING]: '即将燃尽',
  [LampStatus.OFF]: '已灭'
}

export interface RenewalRecord {
  id: string
  date: string
  days: number
  amount: number
  operator: string
}

export interface LampPosition {
  id: string
  hallId: string
  row: number
  col: number
  type: LampType
  status: LampStatus
  devoteeName: string
  startDate: string
  endDate: string
  renewalRecords: RenewalRecord[]
}

export interface Hall {
  id: string
  name: string
  rows: number
  cols: number
}

export interface OilUsageRecord {
  id: string
  date: string
  quantity: number
  receiver: string
  purpose: string
}

export interface ProductionRecord {
  id: string
  date: string
  type: LampType
  quantity: number
  operator: string
}

export interface DailyConsumption {
  date: string
  hallId: string
  hallName: string
  consumption: number
}
