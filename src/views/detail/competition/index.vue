<template>
  <section
    class="h-full w-full flex flex-col bg-slate-50 justify-center items-center"
  >
    <template v-if="loading">
      <a-spin size="large" />
    </template>
    <template v-else>
      <main class="w-full h-full bg-white flex flex-col">
        <a-page-header
          style="border: 1px solid rgb(235, 237, 240)"
          title="竞赛详情"
          sub-title="管理您的竞赛详情信息"
          @back="goHome"
        >
          <template #footer>
            <a-tabs v-model:activeKey="activeKey">
              <!-- 基本信息 -->
              <a-tab-pane key="1" tab="基本信息">
                <div class="grow w-full box-border p-8">
                  <a-row>
                    <a-descriptions title="基本信息" bordered :column="6">
                      <a-descriptions-item label="竞赛名称" :span="2">{{
                        competition.name
                      }}</a-descriptions-item>
                      <a-descriptions-item label="竞赛类别">{{
                        competition.has_work ? '作品赛' : '非作品赛'
                      }}</a-descriptions-item>
                      <a-descriptions-item label="对外开放">{{
                        competition.level ? '是' : '否'
                      }}</a-descriptions-item>
                      <a-descriptions-item label="开始日期">{{
                        competition.start_date.slice(0, 10)
                      }}</a-descriptions-item>
                      <a-descriptions-item label="结束日期" :span="2">{{
                        competition.end_date.slice(0, 10)
                      }}</a-descriptions-item>
                      <a-descriptions-item label="状态" :span="3">
                        <a-badge status="processing" text="进行中" />
                      </a-descriptions-item>
                      <a-descriptions-item label="主办方">{{
                        competition.host
                      }}</a-descriptions-item>
                      <a-descriptions-item label="参赛码">{{
                        competition.code
                      }}</a-descriptions-item>
                      <a-descriptions-item label="奖励机制"
                        >学分</a-descriptions-item
                      >
                      <a-descriptions-item label="简介">
                        {{ competition.introduction }}
                      </a-descriptions-item>
                    </a-descriptions>
                  </a-row>
                  <a-row>
                    <a-divider orientation="left">
                      <span class="text-lg text-gray-600"> 报名信息 </span>
                    </a-divider>
                    <div
                      v-for="sign in competitors"
                      v-bind:key="sign._id"
                      class="flex p-2 border border-gray-200 mx-2 rounded-md hover:bg-slate-700 hover:text-white transition-colors hover:cursor-pointer"
                    >
                      <span>
                        {{ sign.student_id }}
                      </span>
                      <span class="mx-3">
                        {{ sign.student_name }}
                      </span>
                    </div>
                  </a-row>
                </div>
              </a-tab-pane>
              <!-- 人员管理 -->
              <a-tab-pane key="2" tab="人员管理">
                <div class="grow w-full box-border p-8">
                  <staff />
                </div>
              </a-tab-pane>
              <a-tab-pane key="3" tab="结果统计" />
            </a-tabs>
          </template>
        </a-page-header>
      </main>
    </template>
  </section>
</template>

<script lang="ts" setup>
import type { ICompetitionRecord, IUserInfo } from '../../../types'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  UsergroupAddOutlined,
  UserAddOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons-vue'
import Staff from './components/staff.vue'
import { DetailRequest } from '../../../api'
import WechatUserSelect from '../../../components/WechatUserSelect/index.vue'
import { message } from 'ant-design-vue'
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const adding = ref(false)
const activeKey = ref('1')

const competition = ref<ICompetitionRecord>({
  // 唯一索引
  _id: '',
  // 竞赛名
  name: '',
  // 竞赛等级(校内/开放)
  level: 0,
  // 开始日期
  start_date: '',
  // 结束日期
  end_date: '',
  // 是否为作品赛
  has_work: false,
  // 作品类型
  work_type: 0,
  // 竞赛简介
  introduction: '',
  // 竞赛标签
  tag: [],
  // 主办方
  host: '',
  // 协办方
  assist: [],
  // 赛程数(阶段数)
  stage_count: 0,
  // 赛程安排
  schedule: [],
  // 封面
  cover: '',
  // 参赛码
  code: '',
  // 评分表
  score_chart: [],
  // 奖项
  award: [],
  // 评委
  judge: [],
  // 督查
  director: [],
  // 创建者id
  creator_id: '',
})
const competitors = ref([])

// 评委
const newSelectedJudge = ref<IUserInfo[]>([])

const addJudge = () => {
  if (!newSelectedJudge.value.length) {
    message.warn('你没有选择任何新的评委')
    return void 0
  }
  adding.value = true
  // @ts-ignore
  DetailRequest.addJudge(competition.value._id, newSelectedJudge.value).then(
    (result) => {
      // @ts-ignore
      message.success(result.message)
      adding.value = false
    }
  )
}

// 督导
const addDirector = () => {
  adding.value = true
  // @ts-ignore
  DetailRequest.addDirector(
    competition.value._id,
    competition.value.director
  ).then((result) => {
    // @ts-ignore
    message.success(result.message)
    adding.value = false
  })
}

const goHome = () => {
  router.back()
}

// @ts-ignore
DetailRequest.getCompetition(route.params.id).then((result: any) => {
  Object.assign(competition.value, result.data)
  loading.value = false
})

// @ts-ignore
DetailRequest.getCompetitors(route.params.id).then((result: any) => {
  if (result.data) {
    // @ts-ignore
    competitors.value.push(...result.data)
  }
  loading.value = false
})

watch(
  () => newSelectedJudge.value.length,
  (current, prev) => {
    if (current > prev) {
      // 新的是最后一项
      const delIndex = newSelectedJudge.value.length - 1
      const currentSelect = newSelectedJudge.value[delIndex]
      console.log('原来的列表', competition.value.judge)
      console.log('现在', currentSelect)
      if (
        competition.value.judge.find((j) => j.openid === currentSelect.openid)
      ) {
        // 如果新的一项已有，则剔除
        newSelectedJudge.value.splice(delIndex, 1)
        message.warn('此用户已在评委列表中')
      }
    }
  }
)
</script>
