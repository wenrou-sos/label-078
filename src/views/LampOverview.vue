<script setup lang="ts">
import { useLampStore } from '@/stores/lamp'
import HallSelector from '@/components/HallSelector/HallSelector.vue'
import LampGrid from '@/components/LampGrid/LampGrid.vue'
import LampDetailModal from '@/components/LampDetail/LampDetailModal.vue'
import type { LampPosition } from '@/types'
import { LampStatus } from '@/types'

const lampStore = useLampStore()

function handleLampClick(lamp: LampPosition) {
  lampStore.selectLamp(lamp.id)
}
</script>

<template>
  <div class="lamp-overview">
    <div class="page-header">
      <div>
        <h1 class="page-title">供灯总览</h1>
        <p class="page-subtitle">实时查看各殿堂供灯状态与供奉信息</p>
      </div>
      <div class="stats-cards">
        <div class="stat-card stat-on">
          <div class="stat-icon">🟢</div>
          <div class="stat-info">
            <div class="stat-value">{{ lampStore.statusCount.on }}</div>
            <div class="stat-label">常亮</div>
          </div>
        </div>
        <div class="stat-card stat-warning">
          <div class="stat-icon">🟡</div>
          <div class="stat-info">
            <div class="stat-value">{{ lampStore.statusCount.warning }}</div>
            <div class="stat-label">即将燃尽</div>
          </div>
        </div>
        <div class="stat-card stat-off">
          <div class="stat-icon">🔴</div>
          <div class="stat-info">
            <div class="stat-value">{{ lampStore.statusCount.off }}</div>
            <div class="stat-label">已灭</div>
          </div>
        </div>
        <div class="stat-card stat-total">
          <div class="stat-icon">🏮</div>
          <div class="stat-info">
            <div class="stat-value">{{ lampStore.statusCount.total }}</div>
            <div class="stat-label">总计</div>
          </div>
        </div>
      </div>
    </div>

    <HallSelector />

    <div class="legend-bar">
      <div class="legend-item">
        <span class="legend-dot dot-on"></span>
        <span>常亮 (绿色)</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot dot-warning"></span>
        <span>即将燃尽 - 距结束&lt;3天 (黄色)</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot dot-off"></span>
        <span>已灭 (红色)</span>
      </div>
    </div>

    <LampGrid @lamp-click="handleLampClick" />

    <LampDetailModal />
  </div>
</template>

<style lang="scss" scoped>
.lamp-overview {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  gap: 24px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 6px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #888;
  margin: 0;
}

.stats-cards {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  min-width: 120px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
}

.stat-icon {
  font-size: 28px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.stat-on .stat-value {
  color: #4CAF50;
}

.stat-warning .stat-value {
  color: #FFC107;
}

.stat-off .stat-value {
  color: #F44336;
}

.stat-total .stat-value {
  color: #D4A853;
}

.legend-bar {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding: 12px 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;

  &.dot-on {
    background: #4CAF50;
  }

  &.dot-warning {
    background: #FFC107;
  }

  &.dot-off {
    background: #F44336;
  }
}
</style>
