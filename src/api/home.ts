import http from '../utils/http'
class HomeRequest {
  constructor() {}
  public async getCompetitionByCreator(nick_name: string, _id: string) {
    const result = await http.request({
      url: '/competition/creator',
      method: 'GET',
      params: {
        _id,
       nick_name
      }
    })

    return result
  }

  public async getCompetition(_id: string) {
    const result = await http.request({
      url: '/competition',
      method: 'GET',
      params: { _id }
    })

    return result
  }
}

export default HomeRequest
