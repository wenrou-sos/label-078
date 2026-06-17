<script setup lang="ts">
import { useLampStore } from '@/stores/lamp'
import { LampStatus } from '@/types'

const lampStore = useLampStore()
</script>

<template>
  <div class="hall-selector">
    <button
      v-for="hall in lampStore.hallList"
      :key="hall.id"
      class="hall-tab"
      :class="{ active: lampStore.currentHallId === hall.id }"
      @click="lampStore.selectHall(hall.id)"
    >
      <span class="hall-name">{{ hall.name }}</span>
      <span class="hall-info">
        {{ hall.rows * hall.cols }} 盏
      </span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.hall-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.hall-tab {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border: 2px solid #e8dfc8;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;

  &:hover {
    border-color: #D4A853;
    background: #fffdf5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 168, 83, 0.15);
  }

  &.active {
    border-color: #D4A853;
    background: linear-gradient(135deg, #D4A853 0%, #c49a45 100%);
    color: #fff;
    box-shadow: 0 4px 15px rgba(212, 168, 83, 0.4);

    .hall-info {
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
    }
  }
}

.hall-name {
  font-size: 15px;
  font-weight: 600;
}

.hall-info {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 20px;
  background: #f5efe3;
  color: #8b7355;
  font-weight: 500;
  transition: all 0.3s ease;
}
</style>
