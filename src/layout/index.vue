<template>
  <a-layout class="w-screen h-screen overflow-hidden">
    <!-- 左侧导航栏 -->
    <a-layout-sider width="200" :style="styles.sider" v-show="!hideSiderBar">
      <div class="p-4 border-b flex items-center space-x-2">
        <img
          src="https://picsum.photos/id/1005/200/200"
          alt="用户头像"
          class="w-12 h-12 rounded-full"
        />
        <div>
          <p class="font-medium mt-4 mb-0">管理员</p>
          <p class="text-sm text-gray-500">系统管理员</p>
        </div>
      </div>
      <Menu />
    </a-layout-sider>

    <!-- 主体布局 -->
    <a-layout>
      <!-- 顶部栏 -->
      <a-layout-header
        :style="styles.header"
        class="flex items-center justify-between px-2 fixed top-0 right-0 left-[200px] z-50 h-16"
      >
        <div class="flex items-center space-x-2">
          <!-- <MenuUnfoldOutlined
            v-if="collapsed"
            class="text-xl cursor-pointer"
            @click="toggleMenu"
          />
          <MenuFoldOutlined
            class="text-xl cursor-pointer"
            @click="toggleMenu"
            v-else
          /> -->
          <span class="text-xl font-bold text-primary">竞赛管理系统</span>
        </div>
        <div class="flex items-center space-x-4">
          <a-input-search
            placeholder="搜索"
            class="w-64"
            @search="handleSearch"
          />
          <!-- 主题切换按钮 -->
          <SkinOutlined class="text-xl cursor-pointer" title="主题切换" />
          <!-- 全屏按钮 -->
          <FullscreenOutlined
            class="text-xl cursor-pointer"
            title="全屏"
            @click="toggleFullScreen"
          />
          <!-- 通知 -->
          <a-badge count="3" class="cursor-pointer">
            <BellOutlined class="text-xl" />
          </a-badge>
          <Avatar class="flex items-center space-x-2"> </Avatar>
        </div>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content
        :style="styles.content"
        class="pt-60 p-6 bg-gray-100 min-h-screen overflow-auto"
      >
        <div class="bg-white rounded-lg shadow-sm p-6 min-h-full">
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { Menu, Avatar, Logo } from './components/index'
import { reactive, watch, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const hideSiderBar = ref(false)
const styles = reactive({
  header: {
    backgroundColor: '#fff',
    color: '#333',
    boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
  },
  sider: {
    backgroundColor: '#fff',
    borderRight: '1px solid #e8e8e8',
    overflow: 'auto',
    height: '100vh',
  },
  content: {
    overflow: 'auto',
  },
})

watch(
  () => route.path,
  () => {
    hideSiderBar.value = route.meta.hidden || false
  },
  { immediate: true }
)

const handleSearch = (value: string) => {
  console.log('搜索内容:', value)
}
const collapsed = ref(false)
const toggleMenu = () => {
  collapsed.value = !collapsed.value
  hideSiderBar.value = collapsed.value
}

const toggleFullScreen = () => {
  const doc: any = document
  const isFull = doc.fullscreenElement || doc.webkitFullscreenElement
  if (!isFull) {
    ;(
      doc.documentElement.requestFullscreen ||
      doc.documentElement.webkitRequestFullscreen
    )?.call(doc.documentElement)
  } else {
    ;(doc.exitFullscreen || doc.webkitExitFullscreen)?.call(doc)
  }
}
</script>

<style scoped>
.ant-layout-content {
  padding: 64px 0 0 0 !important;
}
</style>
