<template>
  <a-dropdown placement="bottomRight">
    <div class="mx-8">
      <a-avatar shape="square" size="large" :src="avatar_url" />
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
import { defineComponent, reactive, toRefs } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { getSessionItem } from '../../utils'
import { useUserStore } from '../../store/user'
import { useRouter } from 'vue-router'
import { IUserInfo } from '../../types'
export default defineComponent({
  components: { UserOutlined },
  setup() {
    // @ts-ignore
    const user = reactive<IUserInfo>(JSON.parse(getSessionItem('user')))
    const userStore = useUserStore()
    const router = useRouter()

    const logout = () => {
      userStore.logOut()
    }
    const goHome = () => {
      router.push({ name: 'Home' })
    }
    return {
      ...toRefs(user),
      logout,
      goHome
    }
  },
})
</script>

<style scoped></style>
