<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBillStore } from '@/stores/bill'
import { useLampStore } from '@/stores/lamp'
import { BillStatus, BillStatusLabel, LampTypeLabel } from '@/types'
import type { Bill } from '@/types'
import {
  FileText, Calendar, User, Search, Filter, CheckCircle,
  AlertCircle, RefreshCw, Receipt, Users, CreditCard, ChevronDown, ChevronUp
} from 'lucide-vue-next'

const billStore = useBillStore()
const lampStore = useLampStore()

const startDate = computed({
  get: () => billStore.filterStartDate,
  set: (val: string) => billStore.setDateRange(val, endDate.value)
})

const endDate = computed({
  get: () => billStore.filterEndDate,
  set: (val: string) => billStore.setDateRange(startDate.value, val)
})

const devoteeName = ref('')
const selectedLampId = ref('')
const selectedStatus = ref<BillStatus | ''>('')
const expandedDevotee = ref<string | null>(null)

const statusOptions = [
  { value: '', label: '全部' },
  { value: BillStatus.UNPAID, label: BillStatusLabel[BillStatus.UNPAID] },
  { value: BillStatus.PAID, label: BillStatusLabel[BillStatus.PAID] }
]

function handleSearch() {
  billStore.setDevoteeFilter(devoteeName.value)
  billStore.setLampFilter(selectedLampId.value)
  billStore.setStatusFilter(selectedStatus.value)
}

function handleReset() {
  devoteeName.value = ''
  selectedLampId.value = ''
  selectedStatus.value = ''
  billStore.resetFilters()
}

function toggleDevotee(name: string) {
  expandedDevotee.value = expandedDevotee.value === name ? null : name
}

function payBill(bill: Bill) {
  if (confirm(`确认收款 ¥${bill.totalAmount}？`)) {
    billStore.markAsPaid(bill.id)
  }
}

function payMergedDevotee(name: string, amount: number) {
  if (confirm(`确认收取 ${name} 的全部未付款 ¥${amount}？`)) {
    billStore.markMergedAsPaid(name)
    if (expandedDevotee.value === name) {
      expandedDevotee.value = null
    }
  }
}
</script>

<template>
  <div class="bill-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">账单管理</h1>
        <p class="page-subtitle">管理所有供灯续费账单，支持筛选和合并对账</p>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon-wrap total">
          <Receipt :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ billStore.totalAmount }}</div>
          <div class="stat-label">账单总金额</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap paid">
          <CheckCircle :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ billStore.paidAmount }}</div>
          <div class="stat-label">已收款</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap unpaid">
          <AlertCircle :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ billStore.unpaidAmount }}</div>
          <div class="stat-label">待收款 ({{ billStore.unpaidCount }}笔)</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap merge">
          <Users :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">
            <label class="merge-switch">
              <input type="checkbox" v-model="billStore.mergeByDevotee" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="stat-label">按供奉人合并</div>
        </div>
      </div>
    </div>

    <div class="filter-bar">
      <div class="filter-label">
        <Filter :size="16" />
        筛选条件
      </div>
      <div class="filter-items">
        <div class="filter-group">
          <span class="filter-tag">日期</span>
          <input v-model="startDate" type="date" class="filter-input" @change="handleSearch" />
          <span class="filter-sep">至</span>
          <input v-model="endDate" type="date" class="filter-input" @change="handleSearch" />
        </div>
        <div class="filter-group">
          <span class="filter-tag">供奉人</span>
          <div class="search-input-wrap">
            <Search :size="14" class="search-icon" />
            <input
              v-model="devoteeName"
              type="text"
              class="filter-input search"
              placeholder="输入供奉人姓名"
              @input="handleSearch"
            />
          </div>
        </div>
        <div class="filter-group">
          <span class="filter-tag">灯位</span>
          <select v-model="selectedLampId" class="filter-input select" @change="handleSearch">
            <option value="">全部灯位</option>
            <option v-for="lamp in lampStore.lamps" :key="lamp.id" :value="lamp.id">
              {{ lamp.devoteeName }} - {{ lamp.id }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <span class="filter-tag">状态</span>
          <select v-model="selectedStatus" class="filter-input select" @change="handleSearch">
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>
      <button class="reset-btn" @click="handleReset">
        <RefreshCw :size="14" />
        重置
      </button>
    </div>

    <div class="table-card">
      <template v-if="!billStore.mergeByDevotee">
        <table class="data-table">
          <thead>
            <tr>
              <th>日期</th>
              <th>供奉人</th>
              <th>殿堂/灯位</th>
              <th>灯型</th>
              <th>续供天数</th>
              <th>单价</th>
              <th>金额</th>
              <th>状态</th>
              <th>收款日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="billStore.filteredBills.length === 0">
              <td colspan="10" class="empty-cell">暂无账单记录</td>
            </tr>
            <tr v-for="bill in billStore.filteredBills" :key="bill.id" :class="{ 'row-unpaid': bill.status === BillStatus.UNPAID }">
              <td>{{ bill.date }}</td>
              <td class="devotee-cell">{{ bill.devoteeName }}</td>
              <td>{{ bill.hallName }} · {{ bill.lampPosition }}</td>
              <td>{{ LampTypeLabel[bill.lampType] }}</td>
              <td>{{ bill.days }}天</td>
              <td>¥{{ bill.unitPrice }}</td>
              <td class="amount-cell">¥{{ bill.totalAmount }}</td>
              <td>
                <span class="status-badge" :class="bill.status">
                  {{ BillStatusLabel[bill.status] }}
                </span>
              </td>
              <td>{{ bill.paidDate || '-' }}</td>
              <td>
                <button
                  v-if="bill.status === BillStatus.UNPAID"
                  class="pay-btn"
                  @click="payBill(bill)"
                >
                  <CreditCard :size="14" />
                  收款
                </button>
                <span v-else class="paid-tag">已完成</span>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-else>
        <div class="merged-list">
          <div v-if="billStore.mergedBills.length === 0" class="empty-cell">暂无账单记录</div>
          <div
            v-for="entry in billStore.mergedBills"
            :key="entry.devoteeName"
            class="merged-item"
          >
            <div class="merged-header" @click="toggleDevotee(entry.devoteeName)">
              <div class="merged-main">
                <span class="merged-icon"><Users :size="18" /></span>
                <span class="merged-name">{{ entry.devoteeName }}</span>
                <span class="merged-count">{{ entry.bills.length }} 笔账单</span>
              </div>
              <div class="merged-amounts">
                <span class="total">合计 ¥{{ entry.totalAmount }}</span>
                <span class="paid">已收 ¥{{ entry.paidAmount }}</span>
                <span class="unpaid" v-if="entry.unpaidAmount > 0">待收 ¥{{ entry.unpaidAmount }}</span>
                <button
                  v-if="entry.unpaidAmount > 0"
                  class="pay-all-btn"
                  @click.stop="payMergedDevotee(entry.devoteeName, entry.unpaidAmount)"
                >
                  <CreditCard :size="14" />
                  全部收款
                </button>
                <ChevronDown v-if="expandedDevotee !== entry.devoteeName" :size="18" class="expand-icon" />
                <ChevronUp v-else :size="18" class="expand-icon" />
              </div>
            </div>
            <div v-if="expandedDevotee === entry.devoteeName" class="merged-detail">
              <table class="data-table inner">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>殿堂/灯位</th>
                    <th>灯型</th>
                    <th>天数</th>
                    <th>金额</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="bill in entry.bills" :key="bill.id">
                    <td>{{ bill.date }}</td>
                    <td>{{ bill.hallName }} · {{ bill.lampPosition }}</td>
                    <td>{{ LampTypeLabel[bill.lampType] }}</td>
                    <td>{{ bill.days }}天</td>
                    <td class="amount-cell">¥{{ bill.totalAmount }}</td>
                    <td>
                      <span class="status-badge" :class="bill.status">
                        {{ BillStatusLabel[bill.status] }}
                      </span>
                    </td>
                    <td>
                      <button
                        v-if="bill.status === BillStatus.UNPAID"
                        class="pay-btn small"
                        @click="payBill(bill)"
                      >
                        收款
                      </button>
                      <span v-else class="paid-tag">已完成</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bill-page {
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

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
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
}

.stat-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  &.total { background: linear-gradient(135deg, #64B5F6 0%, #1976D2 100%); }
  &.paid { background: linear-gradient(135deg, #81C784 0%, #388E3C 100%); }
  &.unpaid { background: linear-gradient(135deg, #FFB74D 0%, #F57C00 100%); }
  &.merge { background: linear-gradient(135deg, #BA68C8 0%, #7B1FA2 100%); }
}

.stat-content { flex: 1; }

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
  display: flex;
  align-items: center;
}

.stat-label {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.merge-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #ccc;
    border-radius: 24px;
    transition: 0.3s;

    &::before {
      content: '';
      position: absolute;
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background: #fff;
      border-radius: 50%;
      transition: 0.3s;
    }
  }

  input:checked + .slider {
    background: #D4A853;
  }

  input:checked + .slider::before {
    transform: translateX(20px);
  }
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  flex-wrap: wrap;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #666;
}

.filter-items {
  display: flex;
  gap: 16px;
  flex: 1;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-tag {
  font-size: 12px;
  color: #888;
  white-space: nowrap;
}

.filter-input {
  padding: 7px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  min-width: 120px;
  transition: all 0.2s ease;

  &:focus {
    border-color: #D4A853;
    box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.1);
  }

  &.search {
    min-width: 160px;
  }

  &.select {
    cursor: pointer;
    background: #fff;
  }
}

.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;

  .search-icon {
    position: absolute;
    left: 10px;
    color: #bbb;
    pointer-events: none;
  }

  .filter-input.search {
    padding-left: 32px;
  }
}

.filter-sep {
  font-size: 13px;
  color: #999;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #666;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #D4A853;
    color: #D4A853;
  }
}

.table-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 14px 18px;
    background: #fafafa;
    font-size: 13px;
    font-weight: 600;
    color: #666;
    border-bottom: 1px solid #f0f0f0;
  }

  td {
    padding: 12px 18px;
    font-size: 13px;
    color: #333;
    border-bottom: 1px solid #f5f5f5;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: #fafafa;
  }

  &.inner {
    th, td {
      padding: 10px 16px;
      font-size: 12px;
    }
  }
}

.row-unpaid td {
  background: #fffbf0;
}

.empty-cell {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
}

.devotee-cell {
  font-weight: 600;
  color: #5C4033;
}

.amount-cell {
  font-weight: 600;
  color: #D4A853;
}

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;

  &.unpaid {
    background: #fff3e0;
    color: #e65100;
  }

  &.paid {
    background: #e8f5e9;
    color: #2e7d32;
  }
}

.pay-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #D4A853 0%, #c49a45 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(212, 168, 83, 0.35);
  }

  &.small {
    padding: 4px 10px;
    font-size: 11px;
  }
}

.paid-tag {
  font-size: 12px;
  color: #4caf50;
  font-weight: 500;
}

.merged-list {
  display: flex;
  flex-direction: column;
}

.merged-item {
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.merged-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #fafafa;
  }
}

.merged-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.merged-icon {
  color: #9c27b0;
}

.merged-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.merged-count {
  font-size: 12px;
  color: #888;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 10px;
}

.merged-amounts {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;

  .total {
    font-weight: 600;
    color: #333;
  }

  .paid {
    color: #4caf50;
  }

  .unpaid {
    color: #ff9800;
    font-weight: 600;
  }
}

.pay-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #FF7043 0%, #E64A19 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(230, 74, 25, 0.35);
  }
}

.expand-icon {
  color: #999;
}

.merged-detail {
  padding: 0 20px 16px 20px;
  background: #fafafa;
}
</style>
