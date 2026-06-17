<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  title?: string
  xData: string[]
  series: {
    name: string
    data: number[]
    color?: string
  }[]
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance) return

  const option: echarts.EChartsOption = {
    title: {
      text: props.title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e0e0',
      borderWidth: 1,
      textStyle: {
        color: '#333',
        fontSize: 13
      },
      formatter: (params: any) => {
        let result = `<div style="font-weight:600;margin-bottom:6px;">${params[0].axisValue}</div>`
        params.forEach((item: any) => {
          result += `<div style="display:flex;align-items:center;gap:8px;margin:4px 0;">
            <span style="width:10px;height:10px;border-radius:50%;background:${item.color};"></span>
            <span>${item.seriesName}：</span>
            <span style="font-weight:600;">${item.value} 盏</span>
          </div>`
        })
        return result
      }
    },
    legend: {
      top: 30,
      itemWidth: 16,
      itemHeight: 10,
      textStyle: {
        fontSize: 13,
        color: '#666'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.xData,
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#888',
        fontSize: 12
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      name: '数量（盏）',
      nameTextStyle: {
        color: '#888',
        fontSize: 12
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#888',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: props.series.map(s => ({
      name: s.name,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      data: s.data,
      lineStyle: {
        width: 3,
        color: s.color
      },
      itemStyle: {
        color: s.color,
        borderWidth: 2,
        borderColor: '#fff'
      },
      areaStyle: s.color ? {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: s.color + '30' },
          { offset: 1, color: s.color + '05' }
        ])
      } : undefined,
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 10,
          shadowColor: s.color || 'rgba(0, 0, 0, 0.3)'
        }
      }
    }))
  }

  chartInstance.setOption(option)
}

function handleResize() {
  chartInstance?.resize()
}

watch(() => [props.xData, props.series], () => {
  updateChart()
}, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<template>
  <div ref="chartRef" class="line-chart"></div>
</template>

<style lang="scss" scoped>
.line-chart {
  width: 100%;
  height: 400px;
}
</style>
