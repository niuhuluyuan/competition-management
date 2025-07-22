import http from '../utils/http'
import type { teamInfo } from '../types/index'
class CreateRequest {
  constructor() { }
  public async getTeamList(params: object) {
    const result = await http.request({
      url: '/v1.0/api/team/getPageList',
      method: 'get',
      params: params,
    })

    return result
  }
  public async addTeam(params: object) {
    const result = await http.request({
      url: '/v1.0/api/team/add',
      method: 'post',
      data: params,
    })

    return result
  }
  public async updateTeam(params: object) {
    const result = await http.request({
      url: '/v1.0/api/team/update',
      method: 'post',
      data: params,
    })

    return result
  }
}

export default CreateRequest
