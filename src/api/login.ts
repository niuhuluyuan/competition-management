import http from '../utils/http'
import { ILoginForm, IRegisterForm } from '../types'
class LoginRequest {
  constructor() {}
  public async login(data: ILoginForm) {
    const loginResult = await http.request({
      url: '/user/login',
      method: 'POST',
      data,
    })
    return loginResult
  }

  public async register(data: IRegisterForm) {
    const registerResult = await http.request({
      url: '/user/register',
      method: 'POST',
      data,
    })

    return registerResult
  }
}

export default LoginRequest
