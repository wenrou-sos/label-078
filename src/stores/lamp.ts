import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LampPosition, Hall, RenewalRecord } from '@/types'
import { LampStatus } from '@/types'
import { halls, lampList, getLampsByHall } from '@/mock/lampData'
import { daysBetween, formatDate, getTodayStr } from '@/lib/utils'

export const useLampStore = defineStore('lamp', () => {
  const hallList = ref<Hall[]>(halls)
  const currentHallId = ref<string>(halls[0].id)
  const lamps = ref<LampPosition[]>(lampList)
  const selectedLampId = ref<string | null>(null)
  const searchKeyword = ref<string>('')

  const currentHall = computed(() => {
    return hallList.value.find(h => h.id === currentHallId.value)
  })

  const currentHallLamps = computed(() => {
    return getLampsByHall(currentHallId.value)
  })

  const matchedLampIds = computed(() => {
    if (!searchKeyword.value.trim()) return new Set<string>()
    const keyword = searchKeyword.value.trim().toLowerCase()
    const ids = new Set<string>()
    lamps.value.forEach(lamp => {
      if (lamp.devoteeName.toLowerCase().includes(keyword)) {
        ids.add(lamp.id)
      }
    })
    return ids
  })

  const isSearching = computed(() => searchKeyword.value.trim().length > 0)

  const selectedLamp = computed(() => {
    if (!selectedLampId.value) return null
    return lamps.value.find(l => l.id === selectedLampId.value) || null
  })

  const statusCount = computed(() => {
    const current = currentHallLamps.value
    return {
      total: current.length,
      on: current.filter(l => l.status === LampStatus.ON).length,
      warning: current.filter(l => l.status === LampStatus.WARNING).length,
      off: current.filter(l => l.status === LampStatus.OFF).length
    }
  })

  const warningLamps = computed(() => {
    return lamps.value.filter(l => l.status === LampStatus.WARNING)
  })

  function selectHall(hallId: string) {
    currentHallId.value = hallId
    selectedLampId.value = null
  }

  function selectLamp(lampId: string | null) {
    selectedLampId.value = lampId
  }

  function renewLamp(lampId: string, days: number, amount: number) {
    const lamp = lamps.value.find(l => l.id === lampId)
    if (!lamp) return

    const todayStr = getTodayStr()

    const renewalRecord: RenewalRecord = {
      id: `r_${Date.now()}`,
      date: todayStr,
      days,
      amount,
      operator: '香灯师-释悟'
    }

    lamp.renewalRecords.push(renewalRecord)

    const endDate = new Date(lamp.endDate)
    endDate.setDate(endDate.getDate() + days)
    lamp.endDate = formatDate(endDate)

    const daysLeft = daysBetween(todayStr, lamp.endDate)

    if (daysLeft < 0) {
      lamp.status = LampStatus.OFF
    } else if (daysLeft < 3) {
      lamp.status = LampStatus.WARNING
    } else {
      lamp.status = LampStatus.ON
    }
  }

  function getLampByPosition(row: number, col: number): LampPosition | undefined {
    return currentHallLamps.value.find(l => l.row === row && l.col === col)
  }

  function setSearchKeyword(keyword: string) {
    searchKeyword.value = keyword
  }

  function isLampMatched(lampId: string): boolean {
    if (!isSearching.value) return true
    return matchedLampIds.value.has(lampId)
  }

  return {
    hallList,
    currentHallId,
    currentHall,
    currentHallLamps,
    selectedLampId,
    selectedLamp,
    statusCount,
    warningLamps,
    searchKeyword,
    matchedLampIds,
    isSearching,
    selectHall,
    selectLamp,
    renewLamp,
    getLampByPosition,
    setSearchKeyword,
    isLampMatched
  }
})
