import LoginRequestClass from './login'
import CreateRquestClass from './create'
import HomeRequestClass from './home'
import DetailRequestClass from './detail'

const LoginRequest = new LoginRequestClass()
const CreateRequest = new CreateRquestClass()
const HomeRequest = new HomeRequestClass()
const DetailRequest = new DetailRequestClass()

export {
  LoginRequest,
  CreateRequest,
  HomeRequest,
  DetailRequest
}