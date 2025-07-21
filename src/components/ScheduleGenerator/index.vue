<template>
<div>

</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
interface IScheduleItem {

}
export default defineComponent({
  props: {
    value: {
      type: Array as PropType<IScheduleItem[]>,
      default: () => [],
      required: true
    }
  },
  emits: ['update:value'],
  setup (props, { emit }) {
    
  }
})
</script>

<style scoped>

</style>