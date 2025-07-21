import http from '../utils/http'
class DetailRequest {
  constructor() {}
  public async getCompetition(_id: string) {
    const result = await http.request({
      url: '/competition',
      method: 'GET',
      params: { _id }
    })

    return result
  }

  // by nick_name
  public async findWechatUser(name: string) {
    const result = await http.request({
      url: '/user',
      method: 'GET',
      params: { name }
    })

    return result
  }

  // @ts-ignore
  public async addJudge(id, judge) {
    const result = await http.request({
      url: '/competition/add_judge',
      method: 'PUT',
      data: { id, judge }
    })

    return result
  }

  // @ts-ignore
  public async addDirector(id: string, director) {
    const result = await http.request({
      url: '/competition/add_director',
      method: 'PUT',
      data: { id, director }
    })

    return result
  }

  /**
   * @description 获取某竞赛的全部参赛者
   * @param id 竞赛ID
   */
  public async getCompetitors(id: string) {
    const result = await http.request({
      url: '/sign/competitors',
      method: 'GET',
      params: { id }
    })

    return result
  }
}

export default DetailRequest
