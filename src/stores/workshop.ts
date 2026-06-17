import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { OilUsageRecord, ProductionRecord } from '@/types'
import { oilUsageList, productionList } from '@/mock/workshopData'
import { LampType } from '@/types'

export const useWorkshopStore = defineStore('workshop', () => {
  const oilUsages = ref<OilUsageRecord[]>([...oilUsageList])
  const productions = ref<ProductionRecord[]>([...productionList])

  const monthlyOilUsage = computed(() => {
    return oilUsages.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const monthlyProduction = computed(() => {
    return productions.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const productionByType = computed(() => {
    const result: Record<string, number> = {}
    productions.value.forEach(item => {
      if (!result[item.type]) {
        result[item.type] = 0
      }
      result[item.type] += item.quantity
    })
    return result
  })

  function addOilUsage(record: Omit<OilUsageRecord, 'id'>) {
    const newRecord: OilUsageRecord = {
      ...record,
      id: `oil_${Date.now()}`
    }
    oilUsages.value.unshift(newRecord)
  }

  function addProduction(record: Omit<ProductionRecord, 'id'>) {
    const newRecord: ProductionRecord = {
      ...record,
      id: `prod_${Date.now()}`
    }
    productions.value.unshift(newRecord)
  }

  function deleteOilUsage(id: string) {
    const index = oilUsages.value.findIndex(item => item.id === id)
    if (index > -1) {
      oilUsages.value.splice(index, 1)
    }
  }

  function deleteProduction(id: string) {
    const index = productions.value.findIndex(item => item.id === id)
    if (index > -1) {
      productions.value.splice(index, 1)
    }
  }

  return {
    oilUsages,
    productions,
    monthlyOilUsage,
    monthlyProduction,
    productionByType,
    addOilUsage,
    addProduction,
    deleteOilUsage,
    deleteProduction
  }
})
