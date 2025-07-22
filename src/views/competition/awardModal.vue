<template>
  <a-modal
    title="奖项设置"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    destroyOnClose
    :maskClosable="false"
    width="70%"
  >
    <a-button
      type="primary"
      class="mb-4"
      @click="handleAdd"
      :disabled="editingKey !== ''"
    >
      新增奖项
    </a-button>

    <a-table
      :dataSource="form"
      :columns="columns"
      :rowKey="(record:any) => record._id"
      :pagination="false"
      bordered
    >
      <template #awardLevel="{ text, record }">
        <a-select
          v-if="isEditing(record)"
          v-model:value="record.awardLevel"
          placeholder="奖品等级"
          style="width: 120px"
          @change="(val:any) => updateAwardLevelLabel(record, val)"
        >
          <a-select-option :value="0">特等奖</a-select-option>
          <a-select-option :value="1">一等奖</a-select-option>
          <a-select-option :value="2">二等奖</a-select-option>
          <a-select-option :value="3">三等奖</a-select-option>
          <a-select-option :value="4">优秀奖</a-select-option>
          <a-select-option :value="5">参与奖</a-select-option>
        </a-select>
        <span v-else>
          {{
            {
              0: '特等奖',
              1: '一等奖',
              2: '二等奖',
              3: '三等奖',
              4: '优秀奖',
              5: '参与奖',
            }[record.awardLevel as number] || ''
          }}
        </span>
      </template>
      <template #memCount="{ text, record }">
        <a-input-number
          v-if="isEditing(record)"
          v-model:value="record.memCount"
          :min="1"
          style="width: 100px"
          placeholder="数量"
        />
        <span v-else>{{ text }}</span>
      </template>

      <template #content="{ text, record }">
        <a-input
          v-if="isEditing(record)"
          v-model:value="record.content"
          placeholder="奖品内容"
          style="width: 250px"
        />
        <span v-else>{{ text }}</span>
      </template>

      <template #action="{ record }">
        <span v-if="isEditing(record)">
          <a-button type="link" @click="save(record)">保存</a-button>
          <a-button type="link" @click="cancel">取消</a-button>
        </span>
        <span v-else>
          <a-button
            type="link"
            :disabled="editingKey !== ''"
            @click="edit(record)"
            >编辑</a-button
          >
          <a-popconfirm
            title="确定删除吗？"
            @confirm="deleteRow(record)"
            :disabled="editingKey !== ''"
          >
            <a-button type="link" danger>删除</a-button>
          </a-popconfirm>
        </span>
      </template>
    </a-table>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { HomeRequest } from '../../api'
import type { awardInfo } from '../../types'

// 生成唯一ID函数
let uniqueIdCounter = 0
function getUniqueId() {
  uniqueIdCounter++
  return `id_${Date.now()}_${uniqueIdCounter}`
}

const props = defineProps<{
  visible: boolean
  compId: number
}>()
const emit = defineEmits(['update:visible'])

// 表格列定义
const columns = [
  {
    title: '序号',
    key: 'index',
    customRender: ({ index }: any) => index + 1,
    align: 'center',
    width: 60,
  },
  {
    title: '奖品等级',
    dataIndex: 'awardLevel',
    key: 'awardLevel',
    align: 'center',
    width: 120,
    slots: { customRender: 'awardLevel' },
  },
  {
    title: '奖品数量',
    dataIndex: 'memCount',
    key: 'memCount',
    align: 'center',
    width: 100,
    slots: { customRender: 'memCount' },
  },
  {
    title: '奖品内容',
    dataIndex: 'content',
    key: 'content',
    align: 'center',
    width: 250,
    slots: { customRender: 'content' },
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 140,
    slots: { customRender: 'action' },
  },
]

const form = reactive<Partial<awardInfo & { _id: string }>[]>([])
const editingKey = ref('')

watch(
  () => props.visible,
  (val) => {
    if (val) {
      loadAwards(props.compId)
      editingKey.value = ''
    }
  },
  { immediate: true }
)

function loadAwards(compId: number) {
  HomeRequest.getAwardByCompId(compId)
    .then((res: any) => {
      const list = res.data || []
      // 给每条数据赋唯一 _id
      const dataWithId = list.map((item: any) => ({
        ...item,
        _id: getUniqueId(),
      }))
      form.splice(0, form.length, ...dataWithId)
    })
    .catch((err: any) => {
      message.error(err.message || '加载奖项失败')
    })
}

function isEditing(record: Partial<awardInfo & { _id: string }>) {
  return record._id === editingKey.value
}

function edit(record: Partial<awardInfo & { _id: string }>) {
  editingKey.value = record._id || ''
}

function cancel() {
  loadAwards(props.compId)
  editingKey.value = ''
}
const awardLevelMap = {
  0: '特等奖',
  1: '一等奖',
  2: '二等奖',
  3: '三等奖',
  4: '优秀奖',
  5: '参与奖',
}

function updateAwardLevelLabel(record: any, val: number) {
  record.levelName = awardLevelMap[val]
}
async function save(record: Partial<awardInfo & { _id: string }>) {
  if (!record.content || record.content.trim() === '') {
    message.error('奖品内容不能为空')
    return
  }
  if (!record.memCount || record.memCount <= 0) {
    message.error('奖项数量必须大于0')
    return
  }

  try {
    if (record._id.startsWith('temp-')) {
      // 新增
      const payload = { ...record }
      delete payload._id
      let res: any = await HomeRequest.addAward(payload)
      if (res.status === 200) {
        message.success('新增成功')
      } else {
        message.error(res.message)
      }
    } else {
      // 编辑
      await HomeRequest.updateAward(record)
      message.success('保存成功')
    }
    loadAwards(props.compId)
    editingKey.value = ''
  } catch (error: any) {
    message.error(error.message || '保存失败')
  }
}

async function deleteRow(record: Partial<awardInfo & { _id: string }>) {
  try {
    if (record._id.startsWith('temp-')) {
      // 删除未保存临时行
      const idx = form.findIndex((f) => f._id === record._id)
      if (idx !== -1) form.splice(idx, 1)
      message.success('删除成功')
    } else {
      // 删除接口数据
      await HomeRequest.deleteAward(record)
      message.success('删除成功')
      loadAwards(props.compId)
    }
    if (editingKey.value === record._id) {
      editingKey.value = ''
    }
  } catch (error: any) {
    message.error(error.message || '删除失败')
  }
}

function handleAdd() {
  if (editingKey.value !== '') {
    message.warning('请先保存当前编辑项')
    return
  }
  const tempId = `temp-${getUniqueId()}`
  form.unshift({
    _id: tempId,
    compId: props.compId,
    awardLevel: 1,
    levelName: '一等奖',
    memCount: 1,
    content: '',
  })
  editingKey.value = tempId
}

function handleCancel() {
  emit('update:visible', false)
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
