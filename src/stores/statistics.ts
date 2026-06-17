import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DailyConsumption } from '@/types'
import { dailyConsumptionList } from '@/mock/statsData'
import { halls } from '@/mock/lampData'

export const useStatisticsStore = defineStore('statistics', () => {
  const consumptions = ref<DailyConsumption[]>(dailyConsumptionList)

  const dateList = computed(() => {
    const dates = [...new Set(consumptions.value.map(item => item.date))]
    return dates.sort()
  })

  const consumptionByHall = computed(() => {
    const result: Record<string, number[]> = {}
    halls.forEach(hall => {
      result[hall.id] = dateList.value.map(date => {
        const item = consumptions.value.find(
          c => c.date === date && c.hallId === hall.id
        )
        return item ? item.consumption : 0
      })
    })
    return result
  })

  const totalConsumption = computed(() => {
    return consumptions.value.reduce((sum, item) => sum + item.consumption, 0)
  })

  const dailyTotalConsumption = computed(() => {
    return dateList.value.map(date => {
      const dayTotal = consumptions.value
        .filter(item => item.date === date)
        .reduce((sum, item) => sum + item.consumption, 0)
      return {
        date,
        value: dayTotal
      }
    })
  })

  return {
    consumptions,
    dateList,
    consumptionByHall,
    totalConsumption,
    dailyTotalConsumption
  }
})
