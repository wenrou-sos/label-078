<script setup lang="ts">
import { computed } from 'vue'
import { useLampStore } from '@/stores/lamp'
import LampCell from './LampCell.vue'
import type { LampPosition } from '@/types'

const lampStore = useLampStore()

const emit = defineEmits<{
  lampClick: [lamp: LampPosition]
}>()

const gridStyle = computed(() => {
  const hall = lampStore.currentHall
  if (!hall) return {}
  return {
    gridTemplateColumns: `repeat(${hall.cols}, 1fr)`,
    gridTemplateRows: `repeat(${hall.rows}, 1fr)`
  }
})

const lampMap = computed(() => {
  const map = new Map<string, LampPosition>()
  lampStore.currentHallLamps.forEach(lamp => {
    map.set(`${lamp.row}-${lamp.col}`, lamp)
  })
  return map
})

const cells = computed(() => {
  const hall = lampStore.currentHall
  if (!hall) return []
  const result: { row: number; col: number; lamp?: LampPosition }[] = []
  for (let row = 0; row < hall.rows; row++) {
    for (let col = 0; col < hall.cols; col++) {
      const lamp = lampMap.value.get(`${row}-${col}`)
      result.push({ row, col, lamp })
    }
  }
  return result
})
</script>

<template>
  <div class="lamp-grid-wrapper">
    <div class="lamp-grid" :style="gridStyle">
      <template v-for="cell in cells" :key="`${cell.row}-${cell.col}`">
        <LampCell
          v-if="cell.lamp"
          :lamp="cell.lamp"
          @click="emit('lampClick', cell.lamp)"
        />
        <div v-else class="empty-cell">
          <span class="empty-text">空置</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lamp-grid-wrapper {
  width: 100%;
  overflow: auto;
  padding: 20px;
  background: linear-gradient(135deg, #faf7f0 0%, #f5efe3 100%);
  border-radius: 16px;
  border: 1px solid #e8dfc8;
  box-shadow: inset 0 2px 10px rgba(92, 64, 51, 0.05);
}

.lamp-grid {
  display: grid;
  gap: 12px;
  min-width: 700px;
}

.empty-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 110px;
  border-radius: 10px;
  border: 2px dashed #d9cfb5;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    border-color: #D4A853;
    background: rgba(212, 168, 83, 0.1);
  }
}

.empty-text {
  font-size: 13px;
  color: #b8ad90;
  font-weight: 500;
}
</style>
