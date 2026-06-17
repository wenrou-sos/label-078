<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useLampStore } from '@/stores/lamp'
import { LampType, LampStatus, LampTypeLabel, LampStatusLabel } from '@/types'
import { X, Calendar, User, Clock, Coins } from 'lucide-vue-next'
import { daysBetween, getTodayStr } from '@/lib/utils'

const lampStore = useLampStore()

const showRenewForm = ref(false)
const renewDays = ref(30)
const renewAmount = ref(150)

const lamp = computed(() => lampStore.selectedLamp)

watch(showRenewForm, (val) => {
  if (val) {
    renewDays.value = 30
    renewAmount.value = renewDays.value * 5
  }
})

watch(renewDays, (days) => {
  renewAmount.value = days * 5
})

const lampIcon = computed(() => {
  if (!lamp.value) return '🔆'
  switch (lamp.value.type) {
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

const statusClass = computed(() => {
  if (!lamp.value) return ''
  switch (lamp.value.status) {
    case LampStatus.ON:
      return 'status-on'
    case LampStatus.WARNING:
      return 'status-warning'
    case LampStatus.OFF:
      return 'status-off'
    default:
      return ''
  }
})

const daysLeft = computed(() => {
  if (!lamp.value) return 0
  return daysBetween(getTodayStr(), lamp.value.endDate)
})

function closeModal() {
  lampStore.selectLamp(null)
  showRenewForm.value = false
}

function handleRenew() {
  if (!lamp.value) return
  lampStore.renewLamp(lamp.value.id, renewDays.value, renewAmount.value)
  showRenewForm.value = false
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    closeModal()
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="lamp"
      class="modal-overlay"
      @click="handleBackdropClick"
    >
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">
          <X :size="20" />
        </button>

        <div class="modal-header">
          <div class="lamp-icon-large" :class="statusClass">
            {{ lampIcon }}
          </div>
          <div class="header-info">
            <h2 class="devotee-name">{{ lamp.devoteeName }}</h2>
            <div class="lamp-type-badge" :class="statusClass">
              {{ LampTypeLabel[lamp.type] }} · {{ LampStatusLabel[lamp.status] }}
            </div>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <div class="info-icon">
              <Calendar :size="18" />
            </div>
            <div class="info-content">
              <div class="info-label">供奉日期</div>
              <div class="info-value">{{ lamp.startDate }} 至 {{ lamp.endDate }}</div>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <Clock :size="18" />
            </div>
            <div class="info-content">
              <div class="info-label">剩余天数</div>
              <div class="info-value" :class="statusClass">
                {{ daysLeft >= 0 ? `${daysLeft} 天` : '已结束' }}
              </div>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <User :size="18" />
            </div>
            <div class="info-content">
              <div class="info-label">灯位编号</div>
              <div class="info-value">{{ lamp.id }}</div>
            </div>
          </div>
        </div>

        <div class="renew-section">
          <button
            v-if="!showRenewForm"
            class="renew-btn"
            @click="showRenewForm = true"
          >
            登记续费
          </button>

          <div v-else class="renew-form">
            <h3 class="form-title">续费登记</h3>
            <div class="form-row">
              <label>续供天数</label>
              <input
                v-model.number="renewDays"
                type="number"
                min="1"
                class="form-input"
              />
              <span class="form-unit">天</span>
            </div>
            <div class="form-row">
              <label>金额</label>
              <input
                v-model.number="renewAmount"
                type="number"
                min="0"
                class="form-input"
              />
              <span class="form-unit">元</span>
            </div>
            <div class="form-actions">
              <button class="cancel-btn" @click="showRenewForm = false">
                取消
              </button>
              <button class="confirm-btn" @click="handleRenew">
                确认续费
              </button>
            </div>
          </div>
        </div>

        <div class="renewal-history">
          <h3 class="section-title">
            <Coins :size="18" />
            续费记录
          </h3>
          <div v-if="lamp.renewalRecords.length === 0" class="empty-history">
            暂无续费记录
          </div>
          <div v-else class="renewal-list">
            <div
              v-for="record in lamp.renewalRecords"
              :key="record.id"
              class="renewal-item"
            >
              <div class="renewal-date">{{ record.date }}</div>
              <div class="renewal-info">
                <span>续供 {{ record.days }} 天</span>
                <span class="renewal-amount">¥{{ record.amount }}</span>
              </div>
              <div class="renewal-operator">{{ record.operator }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: #fff;
  border-radius: 20px;
  width: 90%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 32px;
  position: relative;
  animation: slideUp 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s ease;

  &:hover {
    background: #e0e0e0;
    color: #333;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
}

.lamp-icon-large {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background: linear-gradient(135deg, #f5efe3 0%, #ebe3d0 100%);

  &.status-on {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
  }

  &.status-warning {
    background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
    box-shadow: 0 4px 20px rgba(255, 193, 7, 0.3);
  }

  &.status-off {
    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  }
}

.header-info {
  flex: 1;
}

.devotee-name {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.lamp-type-badge {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: #f5efe3;
  color: #8b7355;

  &.status-on {
    background: #e8f5e9;
    color: #388E3C;
  }

  &.status-warning {
    background: #fff8e1;
    color: #F57F17;
  }

  &.status-off {
    background: #f5f5f5;
    color: #757575;
  }
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
  padding: 20px;
  background: #fafafa;
  border-radius: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D4A853;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 2px;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;

  &.status-on {
    color: #388E3C;
  }

  &.status-warning {
    color: #F57F17;
  }

  &.status-off {
    color: #D32F2F;
  }
}

.renew-section {
  margin-bottom: 28px;
}

.renew-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #D4A853 0%, #c49a45 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 168, 83, 0.4);
  }
}

.renew-form {
  padding: 20px;
  background: #fafafa;
  border-radius: 12px;
}

.form-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;

  label {
    font-size: 13px;
    color: #666;
    width: 70px;
    flex-shrink: 0;
  }
}

.form-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #D4A853;
    box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.1);
  }
}

.form-unit {
  font-size: 13px;
  color: #999;
  width: 24px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;

  &:hover {
    background: #e0e0e0;
  }
}

.confirm-btn {
  background: linear-gradient(135deg, #D4A853 0%, #c49a45 100%);
  color: #fff;

  &:hover {
    box-shadow: 0 4px 15px rgba(212, 168, 83, 0.4);
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.renewal-history {
  border-top: 1px solid #f0f0f0;
  padding-top: 24px;
}

.empty-history {
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 30px 0;
}

.renewal-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.renewal-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }
}

.renewal-date {
  font-size: 13px;
  color: #888;
  font-weight: 500;
  min-width: 90px;
}

.renewal-info {
  flex: 1;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.renewal-amount {
  color: #D4A853;
  font-weight: 600;
  margin-left: 12px;
}

.renewal-operator {
  font-size: 12px;
  color: #aaa;
}
</style>
