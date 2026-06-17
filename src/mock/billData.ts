import type { Bill } from '@/types'
import { LampType, BillStatus, LampPrice } from '@/types'
import { halls, lampList } from './lampData'

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

function getHallName(hallId: string): string {
  const hall = halls.find(h => h.id === hallId)
  return hall?.name || '未知殿堂'
}

function generateBills(): Bill[] {
  const bills: Bill[] = []
  let billIndex = 0

  lampList.slice(0, 35).forEach((lamp, lampIdx) => {
    const renewalCount = Math.floor(Math.random() * 3) + 1
    let billDate = addDays(formatDate(today), -(Math.floor(Math.random() * 60) + 5))

    for (let i = 0; i < renewalCount; i++) {
      const priceConfig = LampPrice[lamp.type]
      let days: number
      if (priceConfig.unit === 'year') {
        days = 365
      } else {
        days = Math.floor(Math.random() * 60) + 7
      }

      const unitPrice = priceConfig.price
      const totalAmount = priceConfig.unit === 'year'
        ? unitPrice * Math.ceil(days / 365)
        : unitPrice * days

      const isPaid = Math.random() > 0.25

      bills.push({
        id: `bill_${billIndex++}_${Math.random().toString(36).slice(2, 8)}`,
        date: billDate,
        lampId: lamp.id,
        devoteeName: lamp.devoteeName,
        lampType: lamp.type,
        hallName: getHallName(lamp.hallId),
        lampPosition: `${lamp.row + 1}排${lamp.col + 1}号`,
        days,
        unitPrice,
        totalAmount,
        status: isPaid ? BillStatus.PAID : BillStatus.UNPAID,
        paidDate: isPaid ? addDays(billDate, Math.floor(Math.random() * 3)) : undefined,
        operator: '香灯师-释悟'
      })

      billDate = addDays(billDate, Math.floor(Math.random() * 20) + 10)
    }
  })

  return bills.sort((a, b) => b.date.localeCompare(a.date))
}

export const billList: Bill[] = generateBills()
