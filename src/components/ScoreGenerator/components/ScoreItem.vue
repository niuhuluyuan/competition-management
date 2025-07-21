<template>
  <div
    class="h-14 w-full bg-slate-50 text-base my-4 box-border px-6 flex items-center font-bold"
  >
    <a-form layout="inline">
      <a-form-item label="项目名称">
        <a-input v-model:value="model.title" />
      </a-form-item>
      <a-form-item label="项目总分">
        <a-input-number v-model:value="model.score" />
      </a-form-item>
      <a-form-item label="分数步长">
        <a-input-number v-model:value="model.step" />
      </a-form-item>
      <a-form-item label="备注">
        <a-input
          v-model:value="model.remark"
          placeholder="对评分项的说明（可选）"
        />
      </a-form-item>
    </a-form>

    <a-popconfirm
      title="你要删除这一项吗？"
      ok-text="是的"
      cancel-text="算了"
      v-on:confirm="spliceItem"
    >
      <a-button danger type="primary" shape="circle" size="small">
        <div class="w-full h-full grid place-items-center">
          <MinusOutlined />
        </div>
      </a-button>
    </a-popconfirm>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, PropType } from 'vue'
import { MinusOutlined } from '@ant-design/icons-vue'
import { IScoreItem } from '../../../types'
export default defineComponent({
  name: 'ScoreItem',
  components: { MinusOutlined },
  props: {
    model: { type: Object as PropType<IScoreItem>, required: true },
  },
  emits: ['remove'],
  setup(props, { emit }) {
    const { model } = toRefs(props)
    // 删除项目
    const spliceItem = () => {
      // 自定义事件触发
      emit('remove', model.value.id)
    }
    return {
      spliceItem,
      model,
    }
  },
})
</script>
