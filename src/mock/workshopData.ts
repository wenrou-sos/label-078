import type { OilUsageRecord, ProductionRecord } from '@/types'
import { LampType } from '@/types'

const today = new Date()

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return formatDate(d)
}

const receivers = ['释悟法师', '释明心', '释慧能', '陈居士', '王居士']
const purposes = ['制作酥油灯', '供灯添加', '法会供灯', '日常维护']

export const oilUsageList: OilUsageRecord[] = Array.from({ length: 30 }, (_, i) => {
  const date = addDays(formatDate(today), -(29 - i))
  return {
    id: `oil_${i}`,
    date,
    quantity: Math.floor(Math.random() * 20) + 5,
    receiver: receivers[Math.floor(Math.random() * receivers.length)],
    purpose: purposes[Math.floor(Math.random() * purposes.length)]
  }
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const operators = ['李师傅', '王师傅', '张师傅']
const prodTypes = [LampType.GHEE, LampType.LOTUS]

export const productionList: ProductionRecord[] = Array.from({ length: 30 }, (_, i) => {
  const date = addDays(formatDate(today), -(29 - i))
  const type = prodTypes[Math.floor(Math.random() * prodTypes.length)]
  return {
    id: `prod_${i}`,
    date,
    type,
    quantity: Math.floor(Math.random() * 50) + 20,
    operator: operators[Math.floor(Math.random() * operators.length)]
  }
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
