import http from '../utils/http'
import type { ICreateCompetition } from '../types/index'
class CreateRequest {
  constructor() {}
  public async create(competition: ICreateCompetition) {
    const result = await http.request({
      url: '/competition/create',
      method: 'POST',
      data: competition,
    })

    return result
  }
}

export default CreateRequest
