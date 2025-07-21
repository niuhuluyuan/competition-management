<template>
  <a-config-provider :getPopupContainer="getPopupContainer" :locale="zhCN">
    <App />
  </a-config-provider>
</template>

<script setup lang="ts">
import App from './App.vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('cn')

const getPopupContainer = (el, dialogContext) => {
  if (dialogContext) {
    return dialogContext.getDialogWrap()
  } else {
    return document.body
  }
}
</script>
