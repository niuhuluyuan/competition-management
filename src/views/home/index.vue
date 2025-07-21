<template>
  <div class="w-full h-auto bg-white py-6">
    <header
      class="h-16 flex justify-end items-center box-border px-10 bg-white"
    >
      <a-button type="primary" size="large" @click="goCreate">
        <div class="w-full h-full flex justify-center items-center">
          <PlusOutlined />
          创建比赛
        </div>
      </a-button>
    </header>
    <main class="box-border px-8">
      <a-divider orientation="left">我创建的比赛</a-divider>
      <template v-if="!competitionList.length">
        <a-empty />
      </template>
      <template v-else>
        <template v-for="competition in competitionList" :key="competition._id">
          <div
            class="relative w-full h-32 bg-white border shadow-lg my-8 rounded-sm box-border p-5 flex items-center hover:bg-[#f1f3fc] transition-colors hover:cursor-pointer"
            @click="showCompetitionDetail(competition._id)"
          >
            <div class="w-24 h-24 rounded-md shadow-lg bg-white">
              <img
                :src="competition.cover"
                class="w-full h-full"
                alt="competition cover"
              />
            </div>
  
            <div class="h-full mx-4 flex p-3 flex-col">
              <h1 class="text-lg flex items-center">
                <span class="mr-3">{{ competition.name }}</span>
                <a-tag color="blue">作品赛</a-tag>
                <a-tag color="green">进行中</a-tag>
              </h1>
              <h1 class="text-sm text-gray-500">{{ competition.start_date.slice(0, 10) }}-{{ competition.end_date.slice(0, 10) }}</h1>
            </div>
  
            <!-- 折叠图标 -->
            <div class="absolute right-6 top-4"><DownOutlined /></div>
  
            <!-- 脚步 -->
          </div>
        </template>
      </template>

      <a-divider orientation="left">最新消息</a-divider>
      <a-list item-layout="horizontal" :data-source="data" size="large">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta
              description="海南省计算机设计大赛"
            >
              <template #title>
                <a href="https://www.antdv.com/">{{ item.title }}</a>
              </template>
              <template #avatar>
                <a-avatar src="https://joeschmoe.io/api/v1/random" />
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { PlusOutlined, DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { HomeRequest } from '../../api/'
import { getSessionItem } from '../../utils'
import { ICreateCompetition, IUserInfo } from '../../types'
import { message } from 'ant-design-vue'

interface DataItem {
  title: string
}

const router = useRouter()
// @ts-ignore
const user = reactive<IUserInfo>(JSON.parse(getSessionItem('user')))
const competitionList = ref<ICreateCompetition[]>([])

HomeRequest.getCompetitionByCreator(user.nick_name, user._id).then((result: any) => {
  message.success(result.message)
  competitionList.value = result.data
})


const goCreate = () => {
  router.push({ name: 'Create' })
}

const showCompetitionDetail = (id: string) => {
  router.push({
    name: 'CompetitionDetail',
    params: { id }
  })
}

const data: DataItem[] = [
  {
    title: '小羊进行了报名',
  },
  {
    title: '中羊进行了报名',
  },
  {
    title: '大羊进行了报名',
  },
  {
    title: '老羊进行了报名',
  },
  {
    title: '迷你羊进行了报名',
  }
]
</script>
