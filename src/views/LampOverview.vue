<script setup lang="ts">
import { ref } from 'vue'
import { useLampStore } from '@/stores/lamp'
import HallSelector from '@/components/HallSelector/HallSelector.vue'
import LampGrid from '@/components/LampGrid/LampGrid.vue'
import LampDetailModal from '@/components/LampDetail/LampDetailModal.vue'
import type { LampPosition } from '@/types'
import { LampStatus } from '@/types'

const lampStore = useLampStore()
const searchInput = ref('')

function handleSearch() {
  lampStore.setSearchKeyword(searchInput.value)
}

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

    <div class="search-bar">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchInput"
          type="text"
          class="search-input"
          placeholder="搜索供奉人姓名..."
          @input="handleSearch"
        />
        <button
          v-if="searchInput"
          class="search-clear"
          @click="searchInput = ''; handleSearch()"
        >
          ✕
        </button>
      </div>
      <div class="search-hint" v-if="lampStore.isSearching">
        找到 <span class="highlight">{{ lampStore.matchedLampIds.size }}</span> 盏匹配的灯
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

.search-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 420px;
}

.search-icon {
  position: absolute;
  left: 14px;
  font-size: 14px;
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 12px 36px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  outline: none;
  background: #fff;
  transition: all 0.25s ease;

  &:focus {
    border-color: #D4A853;
    box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.12);
  }

  &::placeholder {
    color: #bbb;
  }
}

.search-clear {
  position: absolute;
  right: 10px;
  width: 22px;
  height: 22px;
  border: none;
  background: #e0e0e0;
  color: #666;
  border-radius: 50%;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #bbb;
    color: #fff;
  }
}

.search-hint {
  font-size: 13px;
  color: #888;

  .highlight {
    color: #D4A853;
    font-weight: 600;
  }
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
