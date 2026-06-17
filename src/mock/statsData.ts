import type { DailyConsumption } from '@/types'
import { halls } from './lampData'

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

export const dailyConsumptionList: DailyConsumption[] = []

for (let i = 29; i >= 0; i--) {
  const date = addDays(formatDate(today), -i)
  halls.forEach(hall => {
    dailyConsumptionList.push({
      date,
      hallId: hall.id,
      hallName: hall.name,
      consumption: Math.floor(Math.random() * 20) + 10
    })
  })
}

export function getConsumptionByHall(): Record<string, { date: string; value: number }[]> {
  const result: Record<string, { date: string; value: number }[]> = {}
  halls.forEach(hall => {
    result[hall.id] = dailyConsumptionList
      .filter(item => item.hallId === hall.id)
      .map(item => ({
        date: item.date.slice(5),
        value: item.consumption
      }))
  })
  return result
}

export function getDateRange(): string[] {
  const dates = [...new Set(dailyConsumptionList.map(item => item.date))]
  return dates.sort()
}
