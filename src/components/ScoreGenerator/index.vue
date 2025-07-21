<template>
  <section class="w-[1000px] h-auto">
    <!-- 按钮区域 -->
    <header class="w-full h-16 bg-slate-100 flex items-center box-border px-6">
      <a-button type="primary" size="large" v-on:click="addItem">
        <div class="w-full h-full flex justify-center items-center font-bold">
          <PlusOutlined />新增评分项
        </div>
      </a-button>
    </header>
    <!-- 表单区域 -->
    <main class="py-6">
      <template v-for="item in sheet" v-bind:key="item.id">
        <ScoreItem :model="item" @remove="removeItem" />
      </template>
    </main>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, PropType } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import ScoreItem from './components/ScoreItem.vue'
import { randomString } from '../../utils'
import { IScoreItem } from '../../types'
export default defineComponent({
  name: 'ScoreGenerator',
  components: {
    ScoreItem,
    PlusOutlined,
  },
  props: {
    sheet: {
      type: Array as PropType<IScoreItem[]>,
      required: true,
    },
  },
  emits: ['update:sheet'],
  setup(props, { emit }) {
    const { sheet } = toRefs(props)
    const count = ref(0)
    const newItem = (): IScoreItem => ({
      id: randomString(5, false),
      title: '',
      score: 0,
      step: 1,
      remark: ''
    })

    const addItem = () => {
      count.value += 1
      sheet.value.push(newItem())
      emit('update:sheet', sheet)
    }

    const removeItem = (id: string) => {
      // @ts-ignore
      const delIndex = sheet.value.findIndex((i: IScoreItem) => i.id === id)
      sheet.value.splice(delIndex, 1)
      emit('update:sheet', sheet)
    }

    return {
      sheet,
      count,
      addItem,
      removeItem,
    }
  },
})
</script>
