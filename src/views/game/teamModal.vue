<template>
  <a-modal
    :title="isEdit ? '编辑分组' : '新增分组'"
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
      <a-form-item label="所属赛事" name="compName">
        <a-input v-model:value="form.compName" disabled />
      </a-form-item>
      <a-form-item label="分组名称" name="teamName" required>
        <a-input v-model:value="form.teamName" />
      </a-form-item>
      <a-form-item label="队员1" name="mem1Name" required>
        <a-input v-model:value="form.mem1Name" />
      </a-form-item>
      <a-form-item label="性别" name="mem1Sex" required>
        <a-select v-model:value="form.mem1Sex" placeholder="性别">
          <a-select-option value="男">男</a-select-option>
          <a-select-option value="女">女</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="年龄" name="mem1Age" required>
        <a-input-number
          v-model:value="form.mem1Age"
          :min="1"
          :precision="0"
          :step="1"
        />
      </a-form-item>
      <a-form-item label="队员2" name="mem2Name" required>
        <a-input v-model:value="form.mem2Name" />
      </a-form-item>
      <a-form-item label="性别" name="mem2Sex" required>
        <a-select v-model:value="form.mem2Sex" placeholder="性别">
          <a-select-option value="男">男</a-select-option>
          <a-select-option value="女">女</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="年龄" name="mem2Age" required>
        <a-input-number
          v-model:value="form.mem2Age"
          :min="1"
          :precision="0"
          :step="1"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { CreateRequest } from '../../api'
import type { teamInfo } from '../../types'

const props = defineProps<{
  visible: boolean
  isEdit: boolean
  formData: Partial<teamInfo>
}>()

const emit = defineEmits(['update:visible', 'refresh'])
const defaultForm: Partial<teamInfo> = {
  compId: undefined,
  compName: undefined,
  mem1Name: '',
  mem1Age: undefined,
  mem1Sex: '男',
  mem2Name: '',
  mem2Age: undefined,
  mem2Sex: '男',
  teamName: '',
}
const form = ref<Partial<teamInfo>>({
  ...defaultForm,
})
const rules = reactive({
  teamName: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
  mem1Name: [{ required: true, message: '请输入队员1名称', trigger: 'blur' }],
  mem1Sex: [{ required: true, message: '请选择队员1性别', trigger: 'blur' }],
  mem1Age: [{ required: true, message: '请输入队员1年龄', trigger: 'blur' }],
  mem2Name: [{ required: true, message: '请输入队员2名称', trigger: 'blur' }],
  mem2Sex: [{ required: true, message: '请选择队员2性别', trigger: 'blur' }],
  mem2Age: [{ required: true, message: '请输入队员2年龄', trigger: 'blur' }],
})
watch(
  () => props.visible,
  () => {
    if (props.isEdit) {
      form.value = {
        ...defaultForm,
        ...props.formData,
      }
    } else {
      form.value = { ...defaultForm, ...props.formData }
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
      }
      const req = props.isEdit
        ? CreateRequest.updateTeam(payload)
        : CreateRequest.addTeam(payload)

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
