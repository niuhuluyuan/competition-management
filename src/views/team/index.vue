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
        <a-form-item label="所属赛事" class="col-span-3">
          <a-select v-model:value="searchParams.compId" placeholder="所属赛事">
            <a-select-option
              v-for="item in competitionList"
              :key="item.id"
              :value="item.id"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="队伍名称" class="col-span-3">
          <a-input v-model:value="searchParams.name" placeholder="" />
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
      :data-source="teamList"
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
    <teamModal
      v-model:visible="modalVisible"
      :is-edit="isEdit"
      :form-data="formData"
      @refresh="fetchTeamList"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { HomeRequest, CreateRequest } from '../../api/'
import { ICompetitionRecord, teamInfo } from '../../types'
import { message, Modal } from 'ant-design-vue'
import teamModal from './teamModal.vue'
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
    title: '队伍名称',
    dataIndex: 'teamName',
    key: 'teamName',
    align: 'center',
    width: 220,
    ellipsis: true,
  },
  {
    title: '队员1',
    dataIndex: 'mem1Name',
    key: 'mem1Name',
    align: 'center',
  },
  {
    title: '性别',
    dataIndex: 'mem1Sex',
    key: 'mem1Sex',
    align: 'center',
  },
  {
    title: '年龄',
    dataIndex: 'mem1Age',
    key: 'mem1Age',
    align: 'center',
  },
  {
    title: '队员2',
    dataIndex: 'mem2Name',
    key: 'mem2Name',
    align: 'center',
  },
  {
    title: '性别',
    dataIndex: 'mem2Sex',
    key: 'mem2Sex',
    align: 'center',
  },
  {
    title: '年龄',
    dataIndex: 'mem2Age',
    key: 'mem2Age',
    align: 'center',
  },

  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: 160,
  },
]
const teamList = ref<teamInfo[]>([])
const competitionList = ref<ICompetitionRecord[]>([])
const total = ref(0)
// 搜索参数
const searchParams = reactive({
  name: '',
  compId: 0,
})
// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 10,
})

// 获取比赛列表
const fetchCompetitionList = () => {
  const params = {
    name: '',
    pageNo: 1,
    pageSize: 999999,
  }
  HomeRequest.getCompetitionList(params)
    .then((result: any) => {
      competitionList.value = result.data.list
      searchParams.compId = result.data.list[0]?.id
      fetchTeamList()
    })
    .catch((error: any) => {
      message.error(error.message)
    })
}

// 获取分组列表
const fetchTeamList = () => {
  const params = {
    name: searchParams.name,
    compId: searchParams.compId,
    pageNo: pagination.current,
    pageSize: pagination.pageSize,
  }
  CreateRequest.getTeamList(params)
    .then((result: any) => {
      teamList.value = result.data.list
    })
    .catch((error: any) => {
      message.error(error.message)
    })
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchTeamList()
}

// 分页变化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page
  pagination.pageSize = pageSize
  fetchTeamList()
}
// 新增/编辑
const modalVisible = ref(false)
const isEdit = ref(false)
const formData = ref<Partial<teamInfo>>({})
// 新增分组
const handleAdd = () => {
  formData.value = {
    compId: searchParams.compId,
    compName:
      competitionList.value.find((item) => item.id === searchParams.compId)
        ?.name || '',
  }
  isEdit.value = false
  modalVisible.value = true
}

// 编辑分组
const handleEdit = (record: teamInfo) => {
  formData.value = { ...record }
  isEdit.value = true
  modalVisible.value = true
}

// 删除分组
const handleDelete = (record: teamInfo) => {
  Modal.confirm({
    title: '确定要删除该分组吗？',
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
