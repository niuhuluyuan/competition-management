<template>
  <a-dropdown placement="bottomRight" trigger="click">
    <div class="mx-8 cursor-pointer">
      <PoweroffOutlined class="text-xl cursor-pointer" />
      <!-- <a-avatar shape="square" size="large" :src="avatarUrl" /> -->
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item @click="goHome">首页</a-menu-item>
        <a-menu-item>组织信息</a-menu-item>
        <a-menu-item @click="logout">退出登录</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getSessionItem } from '../../utils'
import { useUserStore } from '../../store/user'
import { useRouter } from 'vue-router'
import { IUserInfo } from '../../types'

export default defineComponent({
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    // 获取用户信息（兼容 null）
    const user = ref<IUserInfo | null>(null)
    try {
      const raw = getSessionItem('user')
      user.value = raw ? JSON.parse(raw) : null
    } catch (e) {
      console.error('解析用户信息失败:', e)
    }

    const avatarUrl = ref('https://picsum.photos/id/1005/200/200')

    const logout = () => {
      userStore.logOut()
    }

    const goHome = () => {
      router.push({ name: 'Home' })
    }

    return {
      avatarUrl,
      user,
      logout,
      goHome,
    }
  },
})
</script>

<style scoped></style>
