<template></template>

<script lang="ts">
import ScoreGenerator from '../../components/ScoreGenerator/index.vue'
import SceduleGenerator from '../../components/ScheduleGenerator/index.vue'
import { defineComponent, ref } from 'vue'
import { IScoreItem, IScheduleItem } from '../../types/index'
import WechatUserSelect from '../../components/WechatUserSelect/index.vue'
export default defineComponent({
  components: { ScoreGenerator, SceduleGenerator, WechatUserSelect },
  setup() {
    const text = ref({
      name: 'Samge',
      age: 14,
    })
    const data1 = ref<IScoreItem[]>([])
    const data2 = ref<IScheduleItem[]>([])
    return {
      data1,
      data2,
      text,
    }
  },
})
</script>
