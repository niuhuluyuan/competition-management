<template>
  <div class="w-full h-auto relative">
    <a-input
      v-model:value="name"
      ref="searchInput"
      @change="showSearchList"
      @blur="hideSearchList"
      size="large"
    />
    <div
      v-show="showList"
      class="w-full max-h-64 flex flex-col justify-center items-center bg-slate-100"
      :class="{ 'min-h-[100px]': loading }"
    >
      <template v-if="loading">
        <a-spin />
      </template>
      <template v-else>
        <template v-if="!users.length">
          <a-empty />
        </template>

        <template v-else>
          <div
            class="w-full h-12 flex items-center box-border px-2 hover:bg-slate-200 transition-colors overflow-hidden text-ellipsis whitespace-nowrap"
            @click="consoleDetail(user)"
            v-for="user in users"
            :key="user._id"
          >
            <div class="w-8 h-8">
              <img :src="user.avatar_url" class="w-full h-full" />
            </div>
            <div class="text-base mx-3">{{ user.nick_name }}</div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import { DetailRequest } from '../../api'
export default defineComponent({
  name: 'WechatUserSelcet',
  emits: ['confirm'],
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const loading = ref(false)
    const name = ref('')
    const users = ref([])
    const showList = ref(false)
    const { modelValue } = toRefs(props)

    const consoleDetail = (data: any) => {
      hideSearchList()
      modelValue.value.push(data)
      emit('confirm', modelValue)
    }

    const showSearchList = () => {
      loading.value = true
      DetailRequest.findWechatUser(name.value).then((result: any) => {
        users.value = result.data || []
        showList.value = true
        loading.value = false
      })
    }

    const hideSearchList = () => {
      setTimeout(() => {
        showList.value = false
      }, 1000)
    }

    return {
      name,
      users,
      loading,
      showList,
      showSearchList,
      hideSearchList,
      consoleDetail,
    }
  },
})
</script>

<style scoped></style>
