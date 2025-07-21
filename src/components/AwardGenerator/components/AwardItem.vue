<template>
  <section class="grid grid-cols-6 w-full text-center text-base bg-blue-50 my-1 py-4">
    <div>
      <a-select v-model:value="model.level" :options="levelOptions" />
    </div>
    <div>
      <a-input-number v-model:value="model.amount" :min="1" />
    </div>
    <div>
      <a-input v-model:value="model.award" />
    </div>
    <div>
      <a-select v-model:value="model.type" :options="typeOptions" />
    </div>
    <div>
      <a-input v-model:value="model.remark" placeholder="奖项说明" />
    </div>
    <div>
      <a-button danger type="primary" @click="removeAward">移除</a-button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, toRefs } from 'vue'
import type { SelectProps } from 'ant-design-vue'
import { IAwardItem } from '../../../types'
export default defineComponent({
  props: {
    model: {
      type: Object as PropType<IAwardItem>,
      required: true,
    },
  },
  emits: ['remove'],
  setup(props, { emit }) {
    const { model } = toRefs(props)
    const removeAward = () => {
      emit('remove', model.value.id)
    }
    const typeOptions = ref<SelectProps['options']>([
      {
        label: '实物',
        value: 0,
      },
      {
        label: '学分',
        value: 1,
      },
      {
        label: '奖金',
        value: 2,
      },
    ])
    const levelOptions = ref<SelectProps['options']>([
      {
        label: '特等奖',
        value: 0,
      },
      {
        label: '一等奖',
        value: 1,
      },
      {
        label: '二等奖',
        value: 2,
      },
      {
        label: '三等奖',
        value: 3,
      },
      {
        label: '优秀奖',
        value: 4,
      },
      {
        label: '参与奖',
        value: 5,
      },
    ])
    return {
      model,
      typeOptions,
      levelOptions,
      removeAward,
    }
  },
})
</script>

<style scoped></style>
