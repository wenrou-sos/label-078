<script setup lang="ts">
import { computed } from 'vue'
import { useStatisticsStore } from '@/stores/statistics'
import { useLampStore } from '@/stores/lamp'
import { useWorkshopStore } from '@/stores/workshop'
import LineChart from '@/components/LineChart/LineChart.vue'
import { TrendingUp, BarChart3, Activity, Flame } from 'lucide-vue-next'

const statsStore = useStatisticsStore()
const lampStore = useLampStore()
const workshopStore = useWorkshopStore()

const chartData = computed(() => {
  const xData = statsStore.dateList.map(d => d.slice(5))
  const colors = ['#D4A853', '#4CAF50', '#2196F3', '#9C27B0']
  
  const series = lampStore.hallList.map((hall, index) => ({
    name: hall.name,
    data: statsStore.consumptionByHall[hall.id] || [],
    color: colors[index % colors.length]
  }))

  return { xData, series }
})

const totalConsumption = computed(() => {
  return statsStore.dailyTotalConsumption.reduce((sum, item) => sum + item.value, 0)
})

const avgDailyConsumption = computed(() => {
  if (statsStore.dailyTotalConsumption.length === 0) return 0
  return Math.round(totalConsumption.value / statsStore.dailyTotalConsumption.length)
})

const rankingHalls = computed(() => {
  return lampStore.hallList
    .map(hall => ({
      ...hall,
      total: (statsStore.consumptionByHall[hall.id] || []).reduce((a, b) => a + b, 0)
    }))
    .sort((a, b) => b.total - a.total)
})
</script>

<template>
  <div class="statistics-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">消耗统计</h1>
        <p class="page-subtitle">各殿堂供灯消耗趋势与数据分析</p>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon-wrap orange">
          <Flame :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalConsumption }}</div>
          <div class="stat-label">30日总消耗 (盏)</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap green">
          <TrendingUp :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ avgDailyConsumption }}</div>
          <div class="stat-label">日均消耗 (盏)</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap blue">
          <BarChart3 :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ workshopStore.monthlyProduction }}</div>
          <div class="stat-label">本月制作 (盏)</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap purple">
          <Activity :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ workshopStore.monthlyOilUsage }}</div>
          <div class="stat-label">本月灯油 (升)</div>
        </div>
      </div>
    </div>

    <div class="chart-card">
      <LineChart
        title="各殿堂供灯每日消耗趋势"
        :x-data="chartData.xData"
        :series="chartData.series"
      />
    </div>

    <div class="bottom-cards">
      <div class="info-card">
        <h3 class="card-title">消耗排行</h3>
        <div class="ranking-list">
          <div
            v-for="(hall, index) in rankingHalls"
            :key="hall.id"
            class="ranking-item"
          >
            <span class="rank-num" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
            <span class="rank-name">{{ hall.name }}</span>
            <span class="rank-value">
              {{ hall.total }} 盏
            </span>
          </div>
        </div>
      </div>

      <div class="info-card">
        <h3 class="card-title">生产消耗对比</h3>
        <div class="compare-item">
          <span class="compare-label">制作数量</span>
          <span class="compare-value">{{ workshopStore.monthlyProduction }} 盏</span>
        </div>
        <div class="compare-item">
          <span class="compare-label">消耗数量</span>
          <span class="compare-value consumption">{{ totalConsumption }} 盏</span>
        </div>
        <div class="compare-divider"></div>
        <div class="compare-item highlight">
          <span class="compare-label">净变化</span>
          <span
            class="compare-value"
            :class="{ positive: workshopStore.monthlyProduction - totalConsumption >= 0, negative: workshopStore.monthlyProduction - totalConsumption < 0 }"
          >
            {{ workshopStore.monthlyProduction - totalConsumption >= 0 ? '+' : '' }}{{ workshopStore.monthlyProduction - totalConsumption }} 盏
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.statistics-view {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
}

.stat-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  &.orange {
    background: linear-gradient(135deg, #FFB74D 0%, #F57C00 100%);
  }

  &.green {
    background: linear-gradient(135deg, #81C784 0%, #388E3C 100%);
  }

  &.blue {
    background: linear-gradient(135deg, #64B5F6 0%, #1976D2 100%);
  }

  &.purple {
    background: linear-gradient(135deg, #BA68C8 0%, #7B1FA2 100%);
  }
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.chart-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #f0f0f0;
}

.bottom-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.info-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 24px;
  border: 1px solid #f0f0f0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }
}

.rank-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  background: #e0e0e0;
  color: #666;

  &.rank-1 {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    color: #fff;
  }

  &.rank-2 {
    background: linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%);
    color: #fff;
  }

  &.rank-3 {
    background: linear-gradient(135deg, #CD7F32 0%, #A0522D 100%);
    color: #fff;
  }
}

.rank-name {
  flex: 1;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.rank-value {
  font-size: 14px;
  font-weight: 600;
  color: #D4A853;
}

.compare-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.compare-label {
  font-size: 14px;
  color: #666;
}

.compare-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;

  &.consumption {
    color: #F44336;
  }

  &.positive {
    color: #4CAF50;
  }

  &.negative {
    color: #F44336;
  }
}

.compare-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 8px 0;
}

.compare-item.highlight {
  padding-top: 16px;

  .compare-label {
    font-weight: 600;
    color: #333;
  }

  .compare-value {
    font-size: 20px;
  }
}
</style>
