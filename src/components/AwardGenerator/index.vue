<template>
  <section class="w-full h-auto">
    <a-button type="primary" @click="addItem" size="large">添加奖项</a-button>
    <nav
      class="w-full h-12 grid grid-cols-6 font-bold text-base mt-6"
    >
      <div class="flex items-center justify-center">等级</div>
      <div class="flex items-center justify-center">数量</div>
      <div class="flex items-center justify-center">内容</div>
      <div class="flex items-center justify-center">类别</div>
      <div class="flex items-center justify-center">备注</div>
      <div class="flex items-center justify-center">操作</div>
    </nav>
    <template v-for="award in modelValue" :key="award.id">
      <award-item :model="award" @remove="removeItem" />
    </template>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs, ref } from 'vue'
import { IAwardItem } from '../../types'
import { randomString } from '../../utils'
import AwardItem from './components/AwardItem.vue'
export default defineComponent({
  components: { AwardItem },
  props: {
    modelValue: {
      type: Object as PropType<IAwardItem[]>,
      required: true,
    },
  },
  emits: ['update'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props)
    const count = ref(0)
    const newItem = (): IAwardItem => ({
      id: randomString(5, false),
      level: 0,
      amount: 1,
      award: '',
      type: 0,
      remark: '',
    })

    const addItem = () => {
      count.value++
      modelValue.value.push(newItem())
      emit('update', modelValue)
    }

    const removeItem = (id: string) => {
      const delIndex = modelValue.value.findIndex(
        (i: IAwardItem) => i.id === id
      )
      modelValue.value.splice(delIndex, 1)
      emit('update', modelValue)
    }

    return {
      modelValue,
      addItem,
      removeItem,
    }
  },
})
</script>
