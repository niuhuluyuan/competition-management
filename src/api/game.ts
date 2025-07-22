import http from '../utils/http'
class GameRequest {
  constructor() { }
  public async getGameList(params: object) {
    const result = await http.request({
      url: '/v1.0/api/game/getMatchRecord',
      method: 'GET',
      params: params
    })
    return result
  }

  public async gameProcessRecord(params: object) {
    const result = await http.request({
      url: '/v1.0/api/game/gameProcessRecord',
      method: 'post',
      data: params
    })
    return result
  }
}

export default GameRequest
