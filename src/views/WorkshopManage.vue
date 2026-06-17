<script setup lang="ts">
import { ref } from 'vue'
import { useWorkshopStore } from '@/stores/workshop'
import { LampType, LampTypeLabel } from '@/types'
import { Plus, Trash2, Droplets, Package, TrendingUp } from 'lucide-vue-next'

const workshopStore = useWorkshopStore()

const activeTab = ref<'oil' | 'production'>('oil')
const showAddModal = ref(false)

const oilDate = ref('')
const oilQuantity = ref(10)
const oilReceiver = ref('')
const oilPurpose = ref('')

const prodDate = ref('')
const prodType = ref<LampType>(LampType.GHEE)
const prodQuantity = ref(30)
const prodOperator = ref('')

const today = new Date()
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

function openAddModal() {
  if (activeTab.value === 'oil') {
    oilDate.value = todayStr
    oilQuantity.value = 10
    oilReceiver.value = ''
    oilPurpose.value = ''
  } else {
    prodDate.value = todayStr
    prodType.value = LampType.GHEE
    prodQuantity.value = 30
    prodOperator.value = ''
  }
  showAddModal.value = true
}

function handleAdd() {
  if (activeTab.value === 'oil') {
    workshopStore.addOilUsage({
      date: oilDate.value,
      quantity: oilQuantity.value,
      receiver: oilReceiver.value || '未指定',
      purpose: oilPurpose.value || '制作酥油灯'
    })
  } else {
    workshopStore.addProduction({
      date: prodDate.value,
      type: prodType.value,
      quantity: prodQuantity.value,
      operator: prodOperator.value || '未指定'
    })
  }
  showAddModal.value = false
}

function deleteOil(id: string) {
  if (confirm('确定要删除这条记录吗？')) {
    workshopStore.deleteOilUsage(id)
  }
}

function deleteProduction(id: string) {
  if (confirm('确定要删除这条记录吗？')) {
    workshopStore.deleteProduction(id)
  }
}
</script>

<template>
  <div class="workshop-manage">
    <div class="page-header">
      <div>
        <h1 class="page-title">作坊管理</h1>
        <p class="page-subtitle">管理灯油领用与酥油灯制作记录</p>
      </div>
      <button class="add-btn" @click="openAddModal">
        <Plus :size="18" />
        新增记录
      </button>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon-wrap oil">
          <Droplets :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ workshopStore.monthlyOilUsage }}</div>
          <div class="stat-label">本月灯油领用 (升)</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap prod">
          <Package :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ workshopStore.monthlyProduction }}</div>
          <div class="stat-label">本月制作数量 (盏)</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap ghee">
          <TrendingUp :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ workshopStore.productionByType[LampType.GHEE] || 0 }}</div>
          <div class="stat-label">酥油灯制作 (盏)</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap lotus">
          <TrendingUp :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ workshopStore.productionByType[LampType.LOTUS] || 0 }}</div>
          <div class="stat-label">莲花灯制作 (盏)</div>
        </div>
      </div>
    </div>

    <div class="tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'oil' }"
        @click="activeTab = 'oil'"
      >
        灯油领用记录
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'production' }"
        @click="activeTab = 'production'"
      >
        制作数量记录
      </button>
    </div>

    <div class="table-card">
      <table v-if="activeTab === 'oil'" class="data-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>数量 (升)</th>
            <th>领用人</th>
            <th>用途</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in workshopStore.oilUsages" :key="item.id">
            <td>{{ item.date }}</td>
            <td class="number-cell">{{ item.quantity }}</td>
            <td>{{ item.receiver }}</td>
            <td>{{ item.purpose }}</td>
            <td>
              <button class="action-btn delete" @click="deleteOil(item.id)">
                <Trash2 :size="16" />
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>灯型</th>
            <th>数量 (盏)</th>
            <th>制作人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in workshopStore.productions" :key="item.id">
            <td>{{ item.date }}</td>
            <td>
              <span class="type-badge">{{ LampTypeLabel[item.type] }}</span>
            </td>
            <td class="number-cell">{{ item.quantity }}</td>
            <td>{{ item.operator }}</td>
            <td>
              <button class="action-btn delete" @click="deleteProduction(item.id)">
                <Trash2 :size="16" />
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
        <div class="modal-card">
          <h3 class="modal-title">
            {{ activeTab === 'oil' ? '新增灯油领用记录' : '新增制作记录' }}
          </h3>

          <div v-if="activeTab === 'oil'" class="form-group">
            <label>日期</label>
            <input v-model="oilDate" type="date" class="form-input" />
          </div>
          <div v-if="activeTab === 'oil'" class="form-group">
            <label>数量 (升)</label>
            <input v-model.number="oilQuantity" type="number" min="1" class="form-input" />
          </div>
          <div v-if="activeTab === 'oil'" class="form-group">
            <label>领用人</label>
            <input v-model="oilReceiver" type="text" class="form-input" placeholder="请输入领用人姓名" />
          </div>
          <div v-if="activeTab === 'oil'" class="form-group">
            <label>用途</label>
            <input v-model="oilPurpose" type="text" class="form-input" placeholder="请输入用途" />
          </div>

          <div v-if="activeTab === 'production'" class="form-group">
            <label>日期</label>
            <input v-model="prodDate" type="date" class="form-input" />
          </div>
          <div v-if="activeTab === 'production'" class="form-group">
            <label>灯型</label>
            <select v-model="prodType" class="form-input">
              <option :value="LampType.GHEE">{{ LampTypeLabel[LampType.GHEE] }}</option>
              <option :value="LampType.LOTUS">{{ LampTypeLabel[LampType.LOTUS] }}</option>
              <option :value="LampType.ELECTRONIC">{{ LampTypeLabel[LampType.ELECTRONIC] }}</option>
              <option :value="LampType.ETERNAL">{{ LampTypeLabel[LampType.ETERNAL] }}</option>
            </select>
          </div>
          <div v-if="activeTab === 'production'" class="form-group">
            <label>数量 (盏)</label>
            <input v-model.number="prodQuantity" type="number" min="1" class="form-input" />
          </div>
          <div v-if="activeTab === 'production'" class="form-group">
            <label>制作人</label>
            <input v-model="prodOperator" type="text" class="form-input" placeholder="请输入制作人姓名" />
          </div>

          <div class="modal-actions">
            <button class="cancel-btn" @click="showAddModal = false">取消</button>
            <button class="confirm-btn" @click="handleAdd">确认添加</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.workshop-manage {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #D4A853 0%, #c49a45 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 168, 83, 0.4);
  }
}

.stats-row {
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

  &.oil {
    background: linear-gradient(135deg, #4FC3F7 0%, #0288D1 100%);
  }

  &.prod {
    background: linear-gradient(135deg, #81C784 0%, #388E3C 100%);
  }

  &.ghee {
    background: linear-gradient(135deg, #FFD54F 0%, #F9A825 100%);
  }

  &.lotus {
    background: linear-gradient(135deg, #F48FB1 0%, #C2185B 100%);
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

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  background: #f5f5f5;
  padding: 6px;
  border-radius: 12px;
  width: fit-content;
}

.tab-btn {
  padding: 10px 24px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    background: #fff;
    color: #D4A853;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    font-weight: 600;
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
    padding: 16px 20px;
    background: #fafafa;
    font-size: 13px;
    font-weight: 600;
    color: #666;
    border-bottom: 1px solid #f0f0f0;
  }

  td {
    padding: 14px 20px;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #f5f5f5;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: #fafafa;
  }
}

.number-cell {
  font-weight: 600;
  color: #D4A853;
}

.type-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #f5efe3;
  color: #8b7355;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.delete {
    background: #fce4ec;
    color: #c62828;

    &:hover {
      background: #f8bbd0;
    }
  }
}

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
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-card {
  background: #fff;
  border-radius: 18px;
  width: 90%;
  max-width: 420px;
  padding: 28px;
  animation: slideUp 0.3s ease;
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

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0 0 24px 0;
}

.form-group {
  margin-bottom: 18px;

  label {
    display: block;
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
    font-weight: 500;
  }
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    border-color: #D4A853;
    box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.1);
  }
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
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
</style>
