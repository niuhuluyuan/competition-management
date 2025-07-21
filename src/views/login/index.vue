<template>
  <div class="w-screen h-screen flex">
    <div class="h-full grow min-w-0 w-3/5 relative">
      <div
        class="w-full h-full background-gray absolute inset-0 text-white flex justify-center items-center flex-col"
      >
        <p class="text-5xl w-full box-border px-64 font-bold">
          易司拓竞赛管理系统
        </p>
        <p class="text-xl w-full box-border px-80">
          <span class="ml-32">———竞赛流程管理工具</span>
        </p>
      </div>
      <img src="https://picsum.photos/600.webp" class="w-full h-full" alt="" />
    </div>
    <div class="grow-0 bg-white px-14 py-40 box-border w-2/5">
      <template v-if="login">
        <div class="max-w-md mx-auto space-y-8">
          <div class="text-center">
            <img src="../../assets/classify.svg" class="mx-auto my-8" />
            <h2 class="text-gray-700 text-3xl mt-2">后台管理</h2>
            <h2 class="text-gray-400 text-base mt-2">系统登录</h2>
          </div>
          <div class="text-base space-y-8">
            <a-form :model="loginForm" autocomplete="off" layout="vertical">
              <a-form-item label="账号" name="username" :rules="rules.username">
                <a-input size="large" v-model:value="loginForm.username" />
              </a-form-item>

              <a-form-item label="密码" name="password" :rules="rules.password">
                <a-input-password
                  size="large"
                  v-model:value="loginForm.password"
                />
              </a-form-item>

              <a-form-item>
                <a-button type="primary" block size="large" @click="useLogin"
                  >进入系统</a-button
                >
              </a-form-item>

              <a-form-item>
                <a-button type="link" block size="large" @click="showRegister"
                  >注册账号</a-button
                >
              </a-form-item>
            </a-form>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="max-w-md mx-auto space-y-8">
          <div class="my-2">
            <h2 class="text-gray-600 text-2xl text-center">注册表单</h2>
          </div>
          <div class="w-full">
            <a-form
              :mode="registerForm"
              :autocomplete="false"
              layout="vertical"
            >
              <a-form-item label="用户名" name="username">
                <a-input v-model:value="registerForm.username" />
              </a-form-item>

              <a-form-item label="密码" name="password">
                <a-input v-model:value="registerForm.password" />
              </a-form-item>

              <a-form-item label="昵称" name="nickname">
                <a-input v-model:value="registerForm.nick_name" />
              </a-form-item>

              <a-form-item label="所属高校" name="university">
                <a-select v-model:value="registerForm.university">
                  <a-option
                    v-for="(o, index) in universities"
                    :key="index"
                    :label="o"
                    :value="o"
                  />
                </a-select>
              </a-form-item>

              <a-form-item label="子组织" name="organization">
                <a-input v-model:value="registerForm.organization" />
              </a-form-item>

              <a-form-item label="联系电话" name="phonenumber">
                <a-input v-model:value="registerForm.phone_number" />
              </a-form-item>

              <a-form-item>
                <a-button type="primary" size="large" block @click="useRegister"
                  >提交注册</a-button
                >
              </a-form-item>

              <a-form-item>
                <a-button danger size="large" block @click="showLogin"
                  >返回登录</a-button
                >
              </a-form-item>
            </a-form>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { LoginRequest } from '../../api'
import { useUserStore } from '../../store/user'
import { setSessionItem } from '../../utils'

const router = useRouter()
const userStore = useUserStore()

interface LoginState {
  username: string
  password: string
}

interface RegisterState {
  username: string
  password: string
  nick_name: string
  university: string
  organization: string
  phone_number: string
}

const loginForm = reactive<LoginState>({
  username: '',
  password: '',
})

const login = ref(true)
const loading = ref(false)
const loginKey = 'login'
const registerKey = 'register'

const rules = reactive({
  username: [{ required: true, message: '用户名不可为空' }],
  password: [{ required: true, message: '密码不可为空' }],
})

const useLogin = () => {
  if (!loginForm.username || !loginForm.password) {
    message.warn('请输入用户名和密码')
    return void 0
  }

  message.loading({ content: '登录中...', key: loginKey })
  let result = {
    message: '成功',
    data: {
      _id: '',
      gender: 123,
      // 账号(后台)
      username: 'string',
      // 密码(后台)
      password: 'string',
      // 个性说明
      sign: 'string',
      // 微信用户唯一标识，若没有则为后台用户
      openid: 'string',
      // 学校
      university: 'string',
      // 昵称
      nick_name: 'string',
      // 学号/工号
      uid: 'string',
      // 用户头像地址
      avatar_url: 'string',
      // 学校下属组织
      organization: 'string',
      // 联系电话
      phone_number: 'string',
      // 真实姓名
      name: 'string',
    },
  }
  message.success({ content: result.message, key: loginKey })
  setSessionItem('user', JSON.stringify(result.data))
  userStore.setUserInfo(result.data)
  router.replace({ name: 'Home' })
  // LoginRequest.login(loginForm).then(
  //   (result: any) => {
  //     if (!result.data) {
  //       message.error({ content: result.message, key: loginKey })
  //       return
  //     } else {
  //       message.success({ content: result.message, key: loginKey })
  //       setSessionItem('user', JSON.stringify(result.data))
  //       userStore.setUserInfo(result.data)
  //       router.replace({ name: 'Home' })
  //     }
  //   },
  //   (reason) => {
  //     message.error('出错')
  //   }
  // )
}

const useRegister = () => {
  message.loading({ content: '注册中...', key: registerKey })
  LoginRequest.register(registerForm).then(
    (result: any) => {
      if (result.code > 200) {
        message.warn({ content: result.message, key: registerKey })
      } else {
        message.success({ content: result.message, key: registerKey })
        login.value = true
      }
    },
    (reason) => {
      message.error('创建失败')
    }
  )
}

const registerForm = reactive<RegisterState>({
  username: '',
  password: '',
  university: '',
  nick_name: '',
  organization: '',
  phone_number: '',
})

const showRegister = () => {
  login.value = false
}

const showLogin = () => {
  login.value = true
}

const universities = ref(['海南医学院', '海南大学', '海南师范大学', '复旦大学'])
</script>

<style>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 600px;
  height: 400px;
  /* background-color: #fff; */
}

.right {
  width: 672px;
  height: 100%;
}

.background-gray {
  background-color: rgba(51, 51, 51, 0.5);
}
</style>
