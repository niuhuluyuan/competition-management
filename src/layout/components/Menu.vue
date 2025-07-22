<template>
  <a-menu
    :open-keys="keys.openKeys"
    v-model:selectedKeys="keys.selectedKeys"
    @click="checkRoute"
  >
    <a-menu-item key="competition">竞赛管理</a-menu-item>
    <a-menu-item key="team">分组管理</a-menu-item>
    <a-menu-item key="game">对局管理</a-menu-item>
  </a-menu>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
interface Keys {
  openKeys: string[]
  selectedKeys: string[]
}
export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const keys = reactive<Keys>({
      openKeys: [''],
      selectedKeys: [''],
    })

    // @ts-ignore
    keys.selectedKeys[0] = route.name

    // @ts-ignore
    const checkRoute = ({ key }) => {
      router.push({ name: key })
    }

    watch(
      () => route.path,
      () => {
        keys.selectedKeys.splice(0)
        // @ts-ignore
        keys.selectedKeys.push(route.name)
      }
    )

    return {
      keys,
      checkRoute,
    }
  },
})
</script>

<style scoped></style>
