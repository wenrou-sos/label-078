import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Bill, LampPosition } from '@/types'
import { LampType, BillStatus, LampPrice } from '@/types'
import { billList } from '@/mock/billData'
import { getTodayStr } from '@/lib/utils'
import { useLampStore } from './lamp'

export interface MergedBill {
  devoteeName: string
  bills: Bill[]
  totalAmount: number
  paidAmount: number
  unpaidAmount: number
}

export function calculateRenewalAmount(lampType: LampType, days: number): number {
  const config = LampPrice[lampType]
  if (config.unit === 'year') {
    return config.price * Math.ceil(days / 365)
  }
  return config.price * days
}

export const useBillStore = defineStore('bill', () => {
  const bills = ref<Bill[]>([...billList])

  const filterStartDate = ref<string>('')
  const filterEndDate = ref<string>('')
  const filterLampId = ref<string>('')
  const filterDevoteeName = ref<string>('')
  const filterStatus = ref<BillStatus | ''>('')
  const mergeByDevotee = ref<boolean>(false)

  const isDateInRange = (date: string): boolean => {
    if (filterStartDate.value && date < filterStartDate.value) return false
    if (filterEndDate.value && date > filterEndDate.value) return false
    return true
  }

  const filteredBills = computed(() => {
    return bills.value.filter(bill => {
      if (!isDateInRange(bill.date)) return false
      if (filterLampId.value && bill.lampId !== filterLampId.value) return false
      if (filterDevoteeName.value && !bill.devoteeName.includes(filterDevoteeName.value.trim())) return false
      if (filterStatus.value && bill.status !== filterStatus.value) return false
      return true
    })
  })

  const mergedBills = computed<MergedBill[]>(() => {
    const map = new Map<string, MergedBill>()
    filteredBills.value.forEach(bill => {
      const key = bill.devoteeName
      if (!map.has(key)) {
        map.set(key, {
          devoteeName: bill.devoteeName,
          bills: [],
          totalAmount: 0,
          paidAmount: 0,
          unpaidAmount: 0
        })
      }
      const entry = map.get(key)!
      entry.bills.push(bill)
      entry.totalAmount += bill.totalAmount
      if (bill.status === BillStatus.PAID) {
        entry.paidAmount += bill.totalAmount
      } else {
        entry.unpaidAmount += bill.totalAmount
      }
    })
    return Array.from(map.values()).sort((a, b) => b.unpaidAmount - a.unpaidAmount)
  })

  const totalAmount = computed(() => filteredBills.value.reduce((s, b) => s + b.totalAmount, 0))
  const paidAmount = computed(() => filteredBills.value.filter(b => b.status === BillStatus.PAID).reduce((s, b) => s + b.totalAmount, 0))
  const unpaidAmount = computed(() => filteredBills.value.filter(b => b.status === BillStatus.UNPAID).reduce((s, b) => s + b.totalAmount, 0))
  const unpaidCount = computed(() => filteredBills.value.filter(b => b.status === BillStatus.UNPAID).length)

  function setDateRange(start: string, end: string) {
    filterStartDate.value = start
    filterEndDate.value = end
  }

  function setLampFilter(lampId: string) {
    filterLampId.value = lampId
  }

  function setDevoteeFilter(name: string) {
    filterDevoteeName.value = name
  }

  function setStatusFilter(status: BillStatus | '') {
    filterStatus.value = status
  }

  function setMergeByDevotee(merge: boolean) {
    mergeByDevotee.value = merge
  }

  function resetFilters() {
    filterStartDate.value = ''
    filterEndDate.value = ''
    filterLampId.value = ''
    filterDevoteeName.value = ''
    filterStatus.value = ''
  }

  function createBillFromRenewal(lamp: LampPosition, days: number, amount: number): Bill {
    const lampStore = useLampStore()
    const hall = lampStore.hallList.find(h => h.id === lamp.hallId)

    return {
      id: `bill_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      date: getTodayStr(),
      lampId: lamp.id,
      devoteeName: lamp.devoteeName,
      lampType: lamp.type,
      hallName: hall?.name || '未知殿堂',
      lampPosition: `${lamp.row + 1}排${lamp.col + 1}号`,
      days,
      unitPrice: LampPrice[lamp.type].price,
      totalAmount: amount,
      status: BillStatus.UNPAID,
      operator: '香灯师-释悟'
    }
  }

  function addBill(bill: Bill) {
    bills.value.unshift(bill)
  }

  function markAsPaid(billId: string) {
    const bill = bills.value.find(b => b.id === billId)
    if (bill && bill.status === BillStatus.UNPAID) {
      bill.status = BillStatus.PAID
      bill.paidDate = getTodayStr()
    }
  }

  function markMergedAsPaid(devoteeName: string) {
    bills.value.forEach(bill => {
      if (bill.devoteeName === devoteeName && bill.status === BillStatus.UNPAID) {
        bill.status = BillStatus.PAID
        bill.paidDate = getTodayStr()
      }
    })
  }

  return {
    bills,
    filterStartDate,
    filterEndDate,
    filterLampId,
    filterDevoteeName,
    filterStatus,
    mergeByDevotee,
    filteredBills,
    mergedBills,
    totalAmount,
    paidAmount,
    unpaidAmount,
    unpaidCount,
    setDateRange,
    setLampFilter,
    setDevoteeFilter,
    setStatusFilter,
    setMergeByDevotee,
    resetFilters,
    createBillFromRenewal,
    addBill,
    markAsPaid,
    markMergedAsPaid
  }
})
