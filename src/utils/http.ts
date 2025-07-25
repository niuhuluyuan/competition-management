import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { message } from 'ant-design-vue'

const TEST_URL = 'http://192.1.161.242:8080'
// const TEST_URL = 'http://localhost:3008'
// const PROD_URL = 'https://www.youngcr.cn/capi'

class IAxios {
  private instance: AxiosInstance
  private options: AxiosRequestConfig
  constructor(options: AxiosRequestConfig) {
    this.options = options
    this.instance = axios.create(options)
    this.setupInterceptor()
  }

  public getInstance(): AxiosInstance {
    return this.instance
  }

  public getRequestConfig(): AxiosRequestConfig {
    return this.options
  }

  /**
   * @description 设置拦截器
   */
  public setupInterceptor() {
    this.instance.interceptors.request.use((config: AxiosRequestConfig) => {
      return config
    })
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data // 保留业务返回结构，不做覆盖
      },
      (error: AxiosError) => {
        // 捕获 HTTP 层错误（比如 404、500），返回 error.response.data
        if (error.response) {
          return Promise.reject(error.response.data)
        } else {
          return Promise.reject(error)
        }
      }
    )

  }

  public request(config: AxiosRequestConfig) {
    return new Promise((resolve, reject) => {
      this.instance(config)
        .then((result) => {
          resolve(result)
        })
        .catch((err: AxiosError) => {
          message.error('请求失败')
          console.log(
            '%c[封装对象HTTP请求出错]: ',
            'color: green; font-size: 12px;',
            err.message
          )
          reject(err)
        })
    })
  }
}

const http = new IAxios({
  baseURL: TEST_URL,
  timeout: 10 * 1000,
})

export default http
