<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Home, Factory, BarChart3, Menu, X, Receipt } from 'lucide-vue-next'

const route = useRoute()
const sidebarOpen = ref(true)

const menuItems = [
  { path: '/', name: '供灯总览', icon: Home },
  { path: '/workshop', name: '作坊管理', icon: Factory },
  { path: '/statistics', name: '消耗统计', icon: BarChart3 },
  { path: '/bills', name: '账单管理', icon: Receipt }
]

const currentPageTitle = computed(() => {
  const item = menuItems.find(m => m.path === route.path)
  return item?.name || '寺院供灯管理'
})
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar" :class="{ collapsed: !sidebarOpen }">
      <div class="logo-section">
        <div class="logo-icon">🏮</div>
        <div v-if="sidebarOpen" class="logo-text">
          <h1>供灯管理</h1>
          <p>寺院管理系统</p>
        </div>
      </div>

      <nav class="nav-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: route.path === item.path }"
        >
          <component :is="item.icon" :size="20" />
          <span v-if="sidebarOpen" class="nav-text">{{ item.name }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="toggle-btn" @click="sidebarOpen = !sidebarOpen">
          <Menu v-if="sidebarOpen" :size="18" />
          <X v-else :size="18" />
        </button>
      </div>
    </aside>

    <main class="main-content">
      <header class="top-header">
        <div class="header-left">
          <h2 class="page-title">{{ currentPageTitle }}</h2>
        </div>
        <div class="header-right">
          <div class="user-info">
            <div class="avatar">释</div>
            <div class="user-detail">
              <span class="user-name">香灯师</span>
              <span class="user-role">释悟法师</span>
            </div>
          </div>
        </div>
      </header>

      <div class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f2eb;
}

.sidebar {
  width: 240px;
  background: linear-gradient(180deg, #5C4033 0%, #4a3228 100%);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;

  &.collapsed {
    width: 72px;

    .logo-section {
      justify-content: center;
      padding: 24px 16px;
    }

    .nav-item {
      justify-content: center;
      padding: 14px 0;

      &::before {
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 4px;
      }
    }
  }
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 28px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-icon {
  font-size: 36px;
  flex-shrink: 0;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    filter: drop-shadow(0 0 4px rgba(255, 200, 100, 0.4));
  }
  to {
    filter: drop-shadow(0 0 12px rgba(255, 200, 100, 0.8));
  }
}

.logo-text {
  h1 {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin: 0;
    white-space: nowrap;
  }

  p {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    margin: 2px 0 0 0;
  }
}

.nav-menu {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.25s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

  &.active {
    background: rgba(212, 168, 83, 0.2);
    color: #D4A853;

    &::before {
      content: '';
      position: absolute;
      left: -12px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 24px;
      background: #D4A853;
      border-radius: 0 4px 4px 0;
    }
  }
}

.nav-text {
  white-space: nowrap;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.toggle-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }
}

.main-content {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.sidebar.collapsed + .main-content {
  margin-left: 72px;
}

.top-header {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.header-left {
  .page-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #D4A853 0%, #c49a45 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.user-detail {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.user-role {
  font-size: 12px;
  color: #999;
}

.content-area {
  flex: 1;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
