import http from '../utils/http'
class HomeRequest {
  constructor() { }
  public async getCompetitionList(params: object) {
    const result = await http.request({
      url: '/v1.0/api/competition/getPageList',
      method: 'GET',
      params: params
    })
    return result
  }

  public async createCompetition(params: object) {
    const result = await http.request({
      url: '/v1.0/api/competition/add',
      method: 'post',
      data: params
    })
    return result
  }

  public async updateCompetition(params: object) {
    const result = await http.request({
      url: '/v1.0/api/competition/update',
      method: 'post',
      data: params
    })
    return result
  }


  public async deleteCompetition(_id: number) {
    const result = await http.request({
      url: '/competition',
      method: 'GET',
      params: { _id }
    })


    return result
  }

  public async getAwardByCompId(compId: number) {
    const result = await http.request({
      url: '/v1.0/api/competition/getAward',
      method: 'GET',
      params: { compId }
    })

    return result
  }
  public async addAward(params: object) {
    const result = await http.request({
      url: '/v1.0/api/competition/addAward',
      method: 'post',
      data: params
    })
    console.log(result);

    return result
  }

  public async updateAward(params: object) {
    const result = await http.request({
      url: '/v1.0/api/competition/updateAward',
      method: 'post',
      data: params
    })

    return result
  }

  public async deleteAward(params: object) {
    const result = await http.request({
      url: '/v1.0/api/competition/deleteAward',
      method: 'post',
      data: params
    })
    return result
  }
}

export default HomeRequest
