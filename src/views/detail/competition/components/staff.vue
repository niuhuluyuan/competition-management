<template>
  <div class="p-8 box-border w-3/5 h-full">
    <a-input v-model:value="search.value" placeholder="搜索值" size="large" />
    <section class="p-4 w-full h-auto">
      <a-divider orientation="left">评委信息</a-divider>
      <a-empty :image="simpleImage">
        <template #description>
          <span>
            还没有评委
            <a href="#API">Description</a>
          </span>
        </template>
        <a-button type="primary">现在添加</a-button>
      </a-empty>
      <a-divider orientation="left">督查信息</a-divider>
      <a-table :dataSource="dataSource" :columns="columns" />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { Empty } from 'ant-design-vue'
interface DataItem {
  key: string
  name: string
  age: number
  address: string
}
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const search = reactive({
  value: '',
})
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
]
const dataSource: DataItem[] = [
  {
    key: '1',
    name: '王平',
    age: 32,
    address: '海南省海口市龙华区学院路3号',
  },
  {
    key: '2',
    name: '关羽',
    age: 42,
    address: '海南省海口市龙华区学院路3号',
  },
]
</script>

<style scoped></style>
