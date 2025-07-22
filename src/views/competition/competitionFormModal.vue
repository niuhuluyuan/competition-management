<template>
  <a-modal
    :title="isEdit ? '编辑比赛' : '新增比赛'"
    :visible="visible"
    @ok="handleSubmit"
    :rules="rules"
    @cancel="() => emit('update:visible', false)"
    destroyOnClose
    :maskClosable="false"
  >
    <a-form
      :model="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 18 }"
      ref="formRef"
    >
      <a-form-item label="比赛名称" name="name" required>
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item label="开始时间" name="startDate" required>
        <a-date-picker v-model:value="form.startDate" class="w-full" />
      </a-form-item>
      <a-form-item label="结束时间" name="endDate" required>
        <a-date-picker v-model:value="form.endDate" class="w-full" />
      </a-form-item>
      <a-form-item label="轮次" name="roundCount" required>
        <a-input-number
          v-model:value="form.roundCount"
          :min="1"
          :precision="0"
          :step="1"
        />
      </a-form-item>
      <a-form-item label="每轮时长(min)" name="roundMin" required>
        <a-input-number
          v-model:value="form.roundMin"
          :min="1"
          :precision="0"
          :step="1"
        />
      </a-form-item>
      <a-form-item label="桌数" name="tableCount" required>
        <a-input-number
          v-model:value="form.tableCount"
          :min="1"
          :precision="0"
          :step="1"
        />
      </a-form-item>
      <a-form-item label="规则" name="rule" required>
        <a-textarea
          class="w-full"
          v-model:value="form.rule"
          placeholder="请输入规则"
          :auto-size="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { HomeRequest } from '../../api'
import type { ICompetitionRecord } from '../../types'
import dayjs from 'dayjs'

const props = defineProps<{
  visible: boolean
  isEdit: boolean
  formData: Partial<ICompetitionRecord>
}>()

const emit = defineEmits(['update:visible', 'refresh'])
const defaultForm: Partial<ICompetitionRecord> = {
  name: '',
  startDate: undefined,
  endDate: undefined,
  roundCount: 1,
  roundMin: 1,
  tableCount: 1,
  rule: '',
}
const form = ref<Partial<ICompetitionRecord>>({
  ...defaultForm,
})
const rules = reactive({
  name: [{ required: true, message: '请输入赛事名称', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选中开始时间', trigger: 'blur' }],
  endDate: [{ required: true, message: '请输入结束时间', trigger: 'blur' }],
  roundCount: [{ required: true, message: '请输入轮次', trigger: 'blur' }],
  roundMin: [{ required: true, message: '请输入每轮时长', trigger: 'blur' }],
  tableCount: [{ required: true, message: '请输入桌数', trigger: 'blur' }],
  rule: [{ required: true, message: '请输入规则', trigger: 'blur' }],
})
watch(
  () => props.visible,
  () => {
    if (props.isEdit) {
      form.value = {
        ...defaultForm,
        ...props.formData,
        startDate: props.formData.startDate
          ? dayjs(props.formData.startDate)
          : undefined,
        endDate: props.formData.endDate
          ? dayjs(props.formData.endDate)
          : undefined,
      }
    } else {
      form.value = { ...defaultForm }
    }
  },
  { immediate: true }
)
const formRef = ref()
const handleSubmit = () => {
  formRef.value
    ?.validate()
    .then(() => {
      const payload = {
        ...form.value,
        startDate: form.value.startDate
          ? dayjs(form.value.startDate).format('YYYY-MM-DD')
          : '',
        endDate: form.value.endDate
          ? dayjs(form.value.endDate).format('YYYY-MM-DD')
          : '',
      }

      const req = props.isEdit
        ? HomeRequest.updateCompetition(payload)
        : HomeRequest.createCompetition(payload)

      req
        .then((res: any) => {
          message.success(res.message || '操作成功')
          emit('update:visible', false)
          emit('refresh')
        })
        .catch((err: any) => {
          message.error(err.message || '操作失败')
        })
    })
    .catch((errorInfo: any) => {
      console.log('校验失败：', errorInfo)
      message.error('请完整填写表单信息')
    })
}
</script>
<style scoped>
.ant-input-number {
  width: 100% !important;
}
</style>
