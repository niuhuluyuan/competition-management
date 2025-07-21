<template>
  <main class="box-border px-10 bg-white h-auto min-h-full relative">
    <template v-if="!result.showResult">
      <div class="mb-8 p-6 box-border rounded-md">
        <a-steps :current="current">
          <a-step title="步骤一" description="填写比赛基本信息" />
          <a-step title="步骤二" description="设计比赛评分表" />
          <a-step title="步骤三" description="设计奖项" />
        </a-steps>
      </div>
      <section class="w-full h-auto flex box-border pb-20">
        <div v-show="current == 0" class="w-full shrink-0">
          <a-divider orientation="left">基本信息</a-divider>
          <a-form
            :model="createForm"
            layout="vertical"
            name="create"
            :wrapper-col="{ span: 24 }"
          >
            <a-row type="flex">
              <a-col :span="5">
                <a-form-item label="竞赛名称" name="name">
                  <a-input v-model:value="createForm.name" size="large" />
                </a-form-item>
              </a-col>
              <a-col :span="4" :offset="1">
                <a-form-item label="竞赛范围" name="level">
                  <a-tooltip>
                    <template #title>选择“开放”后，非本校学生也可报名</template>
                    <a-select
                      size="large"
                      ref="select"
                      v-model:value="createForm.level"
                      style="width: 160px"
                    >
                      <a-select-option :value="0">本校</a-select-option>
                      <a-select-option :value="1">开放</a-select-option>
                    </a-select>
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="2">
                <a-form-item label="是否为作品赛" name="hasWork">
                  <a-switch
                    v-model:checked="createForm.has_work"
                    checked-children="是"
                    un-checked-children="否"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <template v-if="createForm.has_work">
                  <a-form-item label="作品形式" name="workType">
                    <a-select
                      ref="select"
                      v-model:value="createForm.work_type"
                      style="width: 120px"
                    >
                      <a-select-option :value="0">文字</a-select-option>
                      <a-select-option :value="1">图片</a-select-option>
                      <a-select-option :value="2">视频</a-select-option>
                    </a-select>
                  </a-form-item>
                </template>
              </a-col>
            </a-row>

            <a-row type="flex">
              <a-col :span="4">
                <a-form-item label="开始日期">
                  <a-date-picker
                    size="large"
                    v-model:value="createForm.start_date"
                    :disabled-date="disabledStartDate"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="4">
                <a-form-item label="结束日期">
                  <a-date-picker
                    size="large"
                    v-model:value="createForm.end_date"
                    :disabled-date="disabledEndDate"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="2">
                <a-form-item label="阶段数">
                  <a-input-number
                    v-model:value="createForm.stage"
                    size="large"
                    :min="1"
                    :max="maxStage"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="2" :offset="1">
                <a-form-item label="是否有指导教师">
                  <a-radio-group
                    size="large"
                    v-model:value="createForm.has_teacher"
                    option-type="button"
                    :options="hasTeacherOptions"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row type="flex">
              <a-col :span="2">
                <a-form-item label="赛制">
                  <a-select size="large" v-model:value="createForm.rule">
                    <a-select-option :value="0">个人赛</a-select-option>
                    <a-select-option :value="1">团队赛</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <template v-if="createForm.rule">
                <a-col :span="6" :offset="2">
                  <a-form-item label="队伍人数">
                    <a-slider
                      v-model:value="createForm.team_max"
                      size="large"
                      :min="2"
                      :max="200"
                    />
                  </a-form-item>
                </a-col>

                <a-col :span="2" :offset="1">
                  <a-form-item label=" ">
                    <a-input-number
                      v-model:value="createForm.team_max"
                      size="large"
                      :min="2"
                      :max="200"
                    />
                  </a-form-item>
                </a-col>
              </template>
            </a-row>

            <a-row type="flex">
              <a-col :span="4">
                <a-form-item label="主办方">
                  <a-input
                    size="large"
                    v-model:value="createForm.host"
                    disabled
                  />
                </a-form-item>
              </a-col>
              <a-col :span="2" :offset="1">
                <a-form-item label="是否有协办方">
                  <a-switch
                    v-model:checked="createForm.has_assist"
                    checked-children="是"
                    un-checked-children="否"
                  />
                </a-form-item>
              </a-col>
              <template v-if="createForm.has_assist">
                <a-col :span="4" :offset="1">
                  <a-form-item label="协办方">
                    <a-select
                      size="large"
                      v-model:value="createForm.assist"
                      mode="tags"
                      style="width: 100%"
                      placeholder="输入内容后按Enter"
                    />
                  </a-form-item>
                </a-col>
              </template>
            </a-row>

            <a-row type="flex" class="h-auto">
              <a-col :span="8">
                <a-form-item label="赛程安排">
                  <template v-for="(n, index) in createForm.stage">
                    <div class="flex items-center my-4 justify-start">
                      <h1 class="w-48 text-base mr-4">
                        阶段{{ index + 1 }}范围
                      </h1>
                      <a-range-picker
                        size="large"
                        v-model:value="createForm.schedule[index].range"
                      />
                    </div>
                    <div class="flex items-center">
                      <h1 class="w-48 text-base mr-4">
                        阶段{{ index + 1 }}名称
                      </h1>
                      <a-input
                        size="large"
                        v-model:value="createForm.schedule[index].action"
                      />
                    </div>
                    <a-divider />
                  </template>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row type="flex">
              <a-col :span="8">
                <a-form-item label="竞赛简介">
                  <a-textarea
                    v-model:value="createForm.introduction"
                    placeholder="比赛基本介绍"
                    :maxlength="300"
                    show-count
                    :autoSize="true"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8" :offset="2">
                <a-form-item label="封面图片(可选)">
                  <a-upload
                    size="large"
                    v-model:file-list="createForm.cover"
                    list-type="picture"
                    :max-count="1"
                    :before-upload="beforeUpload"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  >
                    <a-button>
                      <upload-outlined></upload-outlined>
                      Upload (Max: 1)
                    </a-button>
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div v-show="current == 1" class="w-full shrink-0">
          <a-divider orientation="left">评分表设计</a-divider>
          <score-generator v-model:sheet="createForm.score_chart" />
        </div>
        <div v-show="current == 2" class="w-full shrink-0">
          <a-divider orientation="left">奖项设置</a-divider>
          <award-generator v-model="createForm.award" />
        </div>
      </section>

      <div class="w-80 h-16 absolute right-4 bottom-0">
        <a-button
          type="primary"
          size="large"
          ghost
          @click="prevStep"
          v-show="current > 0"
          >上一步</a-button
        >
        <a-button
          type="primary"
          size="large"
          class="mx-4"
          @click="createCompetition"
          >提交</a-button
        >
        <a-button
          type="primary"
          size="large"
          ghost
          @click="nextStep"
          v-show="current < 2"
          >下一步</a-button
        >
      </div>
    </template>
    <template v-else>
      <div
        class="w-full h-full flex justify-center items-center box-border py-80 scale-125"
      >
        <a-result
          status="success"
          :title="result.resultTitle"
          sub-title="The conpetition has been created successfully, so you can inform the students to participate in it."
        >
          <template #extra>
            <a-button key="console" type="primary" @click="goHome"
              >前往首页</a-button
            >
          </template>
        </a-result>
      </div>
    </template>
  </main>
</template>

<script lang="ts" setup>
import dayjs, { Dayjs } from 'dayjs'
import { useRouter } from 'vue-router'
import type { IScheduleItem, IAwardItem, IUserInfo } from '../../types/index'
import { reactive, ref, computed, watch } from 'vue'
import type { RadioGroupProps, UploadProps } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { randomString, getSessionItem } from '../../utils'
import ScoreGenerator from '../../components/ScoreGenerator/index.vue'
import AwardGenerator from '../../components/AwardGenerator/index.vue'
import { CreateRequest } from '../../api'

interface ScoreChart {
  id: string
  title: string
  score: number
  step: number
  remark: string
}

interface CreateState {
  name: string
  level: number
  start_date: string
  end_date: string
  has_work: boolean
  work_type: number
  has_teacher: boolean
  has_assist: boolean
  introduction: string
  rule: number
  team_max: number
  tag: string[]
  host: string
  assist: string[]
  stage: number
  schedule: IScheduleItem[]
  cover: UploadProps['fileList']
  score_chart: ScoreChart[]
  code: string
  award: IAwardItem[],
  creator_id: string
}

const router = useRouter()
// @ts-ignore
const user = reactive<IUserInfo>(JSON.parse(getSessionItem('user')))

// 控制步骤条
const current = ref(0)

const nextStep = () => {
  if (current.value === 2) {
    return
  }
  current.value++
}

const prevStep = () => {
  if (current.value === 0) {
    return
  }
  current.value--
}

// 控制阶段最大值
const maxStage = computed(() => {
  if (!createForm.end_date || !createForm.start_date) return 1
  return dayjs(createForm.end_date).diff(createForm.start_date, 'day') + 1
})

// 控制选择开始日期的不可选项
const disabledStartDate = (current: Dayjs) => {
  return current < dayjs().subtract(1, 'day').endOf('day')
}

// 控制选择结束日期的不可选项
const disabledEndDate = (current: Dayjs) => {
  // Can not select days before today and today
  if (!createForm.start_date) {
    return current < dayjs().endOf('day')
  } else {
    return current < dayjs(createForm.start_date).endOf('day')
  }
}

// 上传前钩子函数
// @ts-ignore
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  console.log(file.type)
  const isJpgOrPng =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/jpg'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 4
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

const createForm = reactive<CreateState>({
  name: '',
  level: 0,
  start_date: '',
  end_date: '',
  has_work: false,
  work_type: 0,
  has_teacher: true,
  has_assist: false,
  introduction: '',
  rule: 0,
  team_max: 4,
  tag: [],
  host: user.nick_name,
  assist: [],
  stage: 1,
  schedule: [
    {
      id: randomString(5, false),
      range: [],
      action: '',
    },
  ],
  cover: [],
  score_chart: [],
  code: '',
  award: [],
  creator_id: user._id
})

const hasTeacherOptions: RadioGroupProps['options'] = [
  { label: '是', value: true },
  { label: '否', value: false },
]

const createCompetition = () => {
  CreateRequest.create(createForm).then((res: any) => {
    console.log(res)
    if (res.code === 200) {
      result.showResult = true
      result.resultTitle = `竞赛创建成功，参赛码为${res.data}，通知同学们参赛吧`
    }
  })
}

const goHome = () => {
  router.replace('/')
}

const result = reactive({
  showResult: false,
  resultTitle: '',
})

watch(
  () => createForm.stage,
  (current, prev) => {
    if (current > prev) {
      const newItem = { id: randomString(5, false), range: [], action: '' }
      createForm.schedule.push(newItem)
    } else {
      createForm.schedule.splice(0, 1)
    }
  }
)

watch(
  () => createForm.rule,
  (current) => {
    createForm.team_max = current ? 2 : 1
  }
)

watch(
  () => createForm.has_assist,
  () => {
    createForm.assist = []
  }
)
</script>
