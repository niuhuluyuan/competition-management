import type { UploadProps } from 'ant-design-vue'
interface IResponse<T> {
  code: number
  message: string
  data: T
  status: number
  status_text: string
}

//赛事信息列表
interface ICompetitionRecord {
  // 唯一索引
  id: number
  // 竞赛名
  name: string
  // 开始日期
  startDate: any
  // 结束日期
  endDate: any
  // 轮次数
  roundCount: number
  // 每轮时长
  roundMin: number
  // 桌数
  tableCount: number
  // 规则
  rule: string
  // 创建时间
  createTime: string
}

//奖项
interface awardInfo {
  //唯一索引(编辑时使用)
  _id: string
  // 赛事id
  compId: number
  // 奖品等级
  awardLevel: number
  // 等级名称
  levelName: string
  // 奖品数量
  memCount: number
  // 奖品内容
  content: string
}

// 分组管理
interface teamInfo {
  //唯一索引
  id: number
  // 赛事id
  compId: number
  // 赛事名称
  compName: string
  //队员1
  mem1Name: string
  mem1Age: number
  mem1Sex: string
  //队员2
  mem2Name: string
  mem2Age: number
  mem2Sex: string
  //队伍名称
  teamName: string
}

// 对局管理
interface gameInfo {
  //唯一索引
  id: number
  // 赛事id
  compId: number
  // 当前轮次
  currentRound: number
  //蓝方队伍id
  leftTeamId: number
  //红方队伍id
  rightTeamId: number
  //桌号
  tableNo: number
  //对局状态
  status: number
  //蓝方队伍名称
  leftTeamName: string
  //红方队伍名称
  rightTeamName: string
}

// 参赛者信息
interface IUserInfo {
  // 记录唯一索引
  _id: string
  // 性别(0 男 1女)
  gender: number
  // 账号(后台)
  username: string
  // 密码(后台)
  password: string
  // 个性说明
  sign: string
  // 微信用户唯一标识，若没有则为后台用户
  openid: string
  // 学校
  university: string
  // 昵称
  nick_name: string
  // 学号/工号
  uid: string
  // 用户头像地址
  avatar_url: string
  // 学校下属组织
  organization: string
  // 联系电话
  phone_number: string
  // 真实姓名
  name: string
}

interface IScoreItem {
  id: string
  title: string
  score: number
  step: number
  remark: string
}

interface IAwardItem {
  id: string
  level: number
  amount: number
  award: string
  remark: string
  type: number
}

interface IScheduleItem {
  id: string
  range: string[]
  action: string
}

interface ILoginForm {
  username: string
  password: string
}

interface IRegisterForm {
  username: string
  password: string
  nick_name: string
  university: string
  organization: string
  phone_number: string
}

interface ScoreChart {
  id: string
  title: string
  score: number
  step: number
  remark: string
}

interface ICreateCompetition {
  name: string
  level: number
  start_date: string
  end_date: string
  has_work: boolean
  work_type: number
  introduction: string
  tag: string[]
  host: string
  assist: string[]
  stage_count: number
  schedule: IScheduleItem[]
  cover: UploadProps['fileList']
  score_chart: ScoreChart[]
  code: string
  award: IAwardItem[]
  creator_id: string
}

interface IUserRecord {
  _id: String
  gender: number
  username: string
  password: string
  sign: string
  openid: string
  university: string
  nick_name: string
  uid: string
  avatar_url: string
  organization: string
  phone_number: string
  name: string
}

interface ISignRecord {
  // 记录唯一索引
  _id: string
  // 比赛id
  competition_id: string
  // 学生姓名
  student_name: string
  // 学生学号
  student_id: string
  // 学校名称
  university: string
  // 学院名称
  college: string
  // 班级名称
  class_name: string
  // 联系电话
  phone_number: string
  // 微信用户唯一标识
  openid: string
  // 队伍名称
  team_name: string
  // 队伍参赛码
  team_code: string
  // 是否为队长
  is_captain: boolean
  // 指导老师姓名
  teacher_name: string
  // 指导老师工号
  teacher_id: string
  // 报名日期
  date: string
}

export type {
  ICompetitionRecord,
  awardInfo,
  teamInfo,
  gameInfo,

  IUserInfo,
  IScoreItem,
  IAwardItem,
  IScheduleItem,
  ICreateCompetition,
  ILoginForm,
  IRegisterForm,
  IResponse,
  IUserRecord,
  ISignRecord,
}
