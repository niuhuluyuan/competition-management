import LoginRequestClass from './login'
import CreateRquestClass from './create'
import HomeRequestClass from './home'
import gameRequestClass from './game'

const LoginRequest = new LoginRequestClass()
const CreateRequest = new CreateRquestClass()
const HomeRequest = new HomeRequestClass()
const gameRequest = new gameRequestClass()

export {
  LoginRequest,
  CreateRequest,
  HomeRequest,
  gameRequest
}