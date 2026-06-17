<script setup lang="ts">
import { computed } from 'vue'
import type { LampPosition } from '@/types'
import { LampType, LampStatus, LampTypeLabel, LampStatusLabel } from '@/types'
import { daysBetween, getTodayStr } from '@/lib/utils'

const props = defineProps<{
  lamp: LampPosition
}>()

const emit = defineEmits<{
  click: [lamp: LampPosition]
}>()

const statusClass = computed(() => {
  switch (props.lamp.status) {
    case LampStatus.ON:
      return 'lamp-on'
    case LampStatus.WARNING:
      return 'lamp-warning'
    case LampStatus.OFF:
      return 'lamp-off'
    default:
      return ''
  }
})

const lampIcon = computed(() => {
  switch (props.lamp.type) {
    case LampType.GHEE:
      return '🪔'
    case LampType.LOTUS:
      return '🪷'
    case LampType.ELECTRONIC:
      return '💡'
    case LampType.ETERNAL:
      return '🕯️'
    default:
      return '🔆'
  }
})

const daysLeft = computed(() => {
  return daysBetween(getTodayStr(), props.lamp.endDate)
})
</script>

<template>
  <div
    class="lamp-cell"
    :class="statusClass"
    @click="emit('click', lamp)"
  >
    <div class="lamp-icon">{{ lampIcon }}</div>
    <div class="lamp-type">{{ LampTypeLabel[lamp.type] }}</div>
    <div class="lamp-devotee">{{ lamp.devoteeName }}</div>
    <div class="lamp-days" v-if="lamp.status !== LampStatus.OFF">
      {{ daysLeft >= 0 ? `剩${daysLeft}天` : '已结束' }}
    </div>
    <div class="lamp-days" v-else>已熄灭</div>
    <div class="lamp-glow" v-if="lamp.status === LampStatus.ON"></div>
  </div>
</template>

<style lang="scss" scoped>
.lamp-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  border: 2px solid transparent;
  min-height: 110px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  &.lamp-on {
    border-color: #4CAF50;
    background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%);

    .lamp-icon {
      filter: drop-shadow(0 0 8px rgba(76, 175, 80, 0.6));
    }
  }

  &.lamp-warning {
    border-color: #FFC107;
    background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);

    .lamp-icon {
      animation: pulse-warning 1.5s ease-in-out infinite;
    }
  }

  &.lamp-off {
    border-color: #E0E0E0;
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
    opacity: 0.7;

    .lamp-icon {
      filter: grayscale(100%);
    }
  }
}

.lamp-icon {
  font-size: 28px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.lamp-type {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
}

.lamp-devotee {
  font-size: 13px;
  color: #333;
  font-weight: 600;
  margin-bottom: 4px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.lamp-days {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.05);
  color: #888;
}

.lamp-on .lamp-days {
  background: rgba(76, 175, 80, 0.1);
  color: #388E3C;
}

.lamp-warning .lamp-days {
  background: rgba(255, 193, 7, 0.15);
  color: #F57F17;
}

.lamp-off .lamp-days {
  background: rgba(244, 67, 54, 0.1);
  color: #D32F2F;
}

@keyframes pulse-warning {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}
</style>
