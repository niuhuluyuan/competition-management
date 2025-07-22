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
        <a-form-item label="轮次" class="col-span-3">
          <a-select
            v-model:value="searchParams.currentRound"
            placeholder="轮次"
          >
            <a-select-option
              v-for="item in roundCount"
              :key="item"
              :value="item"
              >第{{ item }}轮</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item class="col-span-3">
          <a-button class="mr-2" type="primary" html-type="submit">
            <SearchOutlined class="relative bottom-[2px] left-[2px]" />
            搜索
          </a-button>
          <!-- <a-button type="primary" @click="handleAdd">
            <PlusOutlined class="relative bottom-[3px] left-[2px]" />
            新增
          </a-button> -->
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
    <teamModal
      v-model:visible="modalVisible"
      :is-edit="isEdit"
      :form-data="formData"
      @refresh="fetchGameList"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { HomeRequest, gameRequest } from '../../api/'
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
    title: '轮次',
    dataIndex: 'currentRound',
    key: 'currentRound',
    align: 'center',
  },
  {
    title: '蓝色方队伍',
    dataIndex: 'leftTeamName',
    key: 'leftTeamName',
    align: 'center',
  },
  {
    title: '红色方队伍',
    dataIndex: 'rightTeamName',
    key: 'rightTeamName',
    align: 'center',
  },
  {
    title: '桌号',
    dataIndex: 'tableNo',
    key: 'tableNo',
    align: 'center',
  },
  {
    title: '对局状态',
    dataIndex: 'status',
    key: 'status',
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
const roundCount = computed(() => {
  return (
    competitionList.value.find((item) => item.id === searchParams.compId)
      ?.roundCount || 1
  )
})
const total = ref(0)
// 搜索参数
const searchParams = reactive({
  currentRound: 1,
  compId: undefined,
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
      fetchGameList()
    })
    .catch((error: any) => {
      message.error(error.message)
    })
}

// 获取分组列表
const fetchGameList = () => {
  const params = {
    currentRound: searchParams.currentRound,
    compId: searchParams.compId,
  }
  gameRequest
    .getGameList(params)
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
  fetchGameList()
}

// 分页变化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page
  pagination.pageSize = pageSize
  fetchGameList()
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
