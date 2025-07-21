import { defineStore } from 'pinia'
import type { IUserInfo } from '../types'
import { clearSessionStorage } from '../utils'

export const useUserStore = defineStore('user', {
  state() {
    return {
      _id: '',
      gender: 0,
      username: '',
      password: '',
      sign: '',
      openid: '',
      university: '',
      nick_name: '',
      uid: '',
      avatar_url: '',
      organization: '',
      phone_number: '',
      name: '',
    }
  },
  actions: {
    setUserInfo(userInfo: IUserInfo) {
      Object.assign(this.$state, userInfo)
    },
    logOut() {
      this.$reset()
      clearSessionStorage()
      location.reload()
    },
  },
})
