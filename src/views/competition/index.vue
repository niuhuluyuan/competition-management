<template>
  <div class="w-full h-auto bg-white pb-6">
    <!-- 搜索和筛选区域 -->

    <a-form
      layout="inline"
      :labelCol="{ span: 6 }"
      :model="searchParams"
      @finish="handleSearch"
    >
      <div class="ml-2 mb-4 grid grid-cols-12 gap-4">
        <a-form-item label="比赛名称" class="col-span-3">
          <a-input v-model:value="searchParams.name" placeholder="比赛名称" />
        </a-form-item>
        <a-form-item class="col-span-3">
          <a-button class="mr-2" type="primary" html-type="submit">
            <SearchOutlined class="relative bottom-[2px] left-[2px]" />
            搜索
          </a-button>
          <a-button type="primary" @click="handleAdd">
            <PlusOutlined class="relative bottom-[3px] left-[2px]" />
            新增
          </a-button>
        </a-form-item>
      </div>
    </a-form>

    <!-- 比赛列表表格 -->
    <a-table
      :columns="columns"
      :data-source="competitionList"
      row-key="id"
      :pagination="false"
      size="small"
      class="mb-4"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <div class="flex justify-around w-full">
            <a-button class="pr-1 pl-1" type="link" @click="setAward(record)"
              >设置奖项</a-button
            >
            <a-button class="pr-1 pl-1" type="link" @click="handleEdit(record)"
              >编辑</a-button
            >
            <a-button
              class="pr-1 pl-1"
              type="link"
              danger
              @click="handleDelete(record)"
              >删除</a-button
            >
          </div>
        </template>
      </template>
    </a-table>
    <!-- 分页组件 -->
    <div class="flex justify-end items-center mt-4 pr-4 space-x-4">
      <div class="text-gray-500 text-sm">共 {{ total }} 条</div>
      <a-pagination
        v-model:current="pagination.current"
        v-model:page-size="pagination.pageSize"
        :total="total"
        @change="handlePageChange"
      />
    </div>
    <CompetitionFormModal
      v-model:visible="modalVisible"
      :is-edit="isEdit"
      :form-data="formData"
      @refresh="fetchCompetitionList"
    />
    <AwardModal v-model:visible="awardVisible" :compId="compId" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { HomeRequest } from '../../api/'
import { ICompetitionRecord } from '../../types'
import { message, Modal } from 'ant-design-vue'
import CompetitionFormModal from './competitionFormModal.vue'
import AwardModal from './awardModal.vue'
// 定义表格列
const columns = [
  {
    title: '序号',
    key: 'index',
    customRender: ({ index }: any) => {
      return (pagination.current - 1) * pagination.pageSize + index + 1
    },
    align: 'center',
    width: 60,
    ellipsis: true,
  },
  {
    title: '比赛名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    width: 220,
    ellipsis: true,
  },
  {
    title: '开始日期',
    dataIndex: 'startDate',
    key: 'startDate',
    align: 'center',
  },
  {
    title: '结束日期',
    dataIndex: 'endDate',
    key: 'endDate',
    align: 'center',
  },
  {
    title: '轮次数',
    dataIndex: 'roundCount',
    key: 'roundCount',
    align: 'center',
  },
  {
    title: '每轮时长(min)',
    dataIndex: 'roundMin',
    key: 'roundMin',
    align: 'center',
  },
  {
    title: '桌数',
    dataIndex: 'tableCount',
    key: 'tableCount',
    align: 'center',
  },
  {
    title: '规则',
    dataIndex: 'rule',
    key: 'rule',
    width: 300,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: 160,
  },
]
const competitionList = ref<ICompetitionRecord[]>([])
const total = ref(0)
// 搜索参数
const searchParams = reactive({
  name: '',
})
// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 10,
})

// 获取比赛列表
const fetchCompetitionList = () => {
  const params = {
    name: searchParams.name,
    // status: searchParams.status,
    pageNo: pagination.current,
    pageSize: pagination.pageSize,
  }
  HomeRequest.getCompetitionList(params)
    .then((result: any) => {
      competitionList.value = result.data.list
      total.value = result.data.total
    })
    .catch((error: any) => {
      message.error(error.message)
    })
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchCompetitionList()
}

// 分页变化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page
  pagination.pageSize = pageSize
  fetchCompetitionList()
}
// 新增/编辑
const modalVisible = ref(false)
const isEdit = ref(false)
const formData = ref<Partial<ICompetitionRecord>>({})
// 新增比赛
const handleAdd = () => {
  formData.value = {}
  isEdit.value = false
  modalVisible.value = true
}

// 编辑比赛
const handleEdit = (record: ICompetitionRecord) => {
  formData.value = { ...record }
  isEdit.value = true
  modalVisible.value = true
}

// 删除比赛
const handleDelete = (record: ICompetitionRecord) => {
  Modal.confirm({
    title: '确定要删除该比赛吗？',
    onOk() {
      HomeRequest.deleteCompetition(record.id)
        .then((result: any) => {
          message.success(result.message)
          fetchCompetitionList()
        })
        .catch((error: any) => {
          message.error(error.message)
        })
    },
    onCancel() {},
  })
}
//奖项设置
const awardVisible = ref(false)
const compId = ref<number>()
const setAward = (record: ICompetitionRecord) => {
  compId.value = record.id
  awardVisible.value = true
}
// 页面加载时获取比赛列表
onMounted(() => {
  fetchCompetitionList()
})
</script>
<style scoped>
::v-deep .ant-btn-link {
  padding: 4px !important;
}
</style>
