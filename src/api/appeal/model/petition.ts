// // 信访投诉列表数据
export interface PetitionList {
  item: string; //事项名称
  assignDepartmentId: string; //指派部门ID
  state: string; //状态
  time: [string]; //创建时间
  pageNo: number; //当前第几页
  pageSize: string; //每页几条数据
  content:string; //诉求内容
}
// 信访投诉新建添加提交表格数据
export interface AddPetitionList {
  type: string; //诉求类型
  sourceType: string; //渠道类型
  item: string; //事项名称
  content: string; //事项缘由
  enterprise: string; //企业名称
  contact: string; //联系人
  phoneNumber: string; //联系电话
}
// 提交指派
export interface AssignModal {
  id: number; //当前列表id
  assignDepartmentId: string; //指派部门ID
  assignDepartment: string; //指派部门名称
}
// 删除数据
export interface DeleteList {
  id: number; //当前列表id
}
// 撤回指派
export interface WithdrawList {
  id: number; //当前列表id
}
// 详情的处理过程
export interface ProcessListData {
  ids: number; //当前列表id
}
// 提交处理
export interface HandledSubmitData {
  appealId: number; //当前列表id
  handled: boolean; //是否处理
  opinion: string; //处理意见
  department: string; //处理部门
}
// 信访投诉编辑提交表格数据
export interface UpdatersList {
  type: string; //诉求类型
  sourceType: string; //渠道类型
  item: string; //事项名称
  content: string; //事项缘由
  enterprise: string; //企业名称
  contact: string; //联系人
  phoneNumber: string; //联系电话
  id: number; //当前列表id
}

export interface DownloadData {
  item: string; //事项名称
  assignDepartmentId: string; //指派部门ID
  state: string; //状态
  time: [string]; //创建时间
}

// 处理完成
export interface HandledComplete {
  id: number; //当前列表id
}

export interface VerificationData {
  appealId: number; //当前列表id
  handled: boolean; //是否处理
  opinion: string; //处理意见
  department: string; //处理部门
  departmentId: string; //处理部门
}
