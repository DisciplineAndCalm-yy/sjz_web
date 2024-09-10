import { defHttp } from '/@/utils/http/axios';

/**
 * 新增政策接口
 */
export const addPolicy = (params) => {
  return defHttp.post({url: '/policy/base/add', params})
}

/**
 * 查看政策
 */
export const getPolicyView = (params) => {
  return defHttp.get({url: '/policy/base/view', params}, {successMessageMode: 'none'})
}

/**
 * 编辑政策
 */
export const editPolicy = (params) => {
  return defHttp.post({url: '/policy/base/edit', params})
}

/**
 * 政策字典信息:
 * 获取政策分类
 */
export const getClassify = () => {
  return defHttp.get({url:'/policy/dict/getClassify'}, {successMessageMode: 'none'})
}

/**
 * 政策字典信息:
 * 获取产业类型
 */
export const getIndustryType = () => {
  return defHttp.get({url:'/policy/dict/getIndustryType'}, {successMessageMode: 'none'})
}

/**
 * 政策字典信息:
 * 获取政策级别
 */
export const getLevel = () => {
  return defHttp.get({url:'/policy/dict/getLevel'}, {successMessageMode: 'none'})
}

/**
 * 政策字典信息:
 * 获取政策公示单位
 */
export const getPublicityOrg = () => {
  return defHttp.get({url:'/policy/dict/getPublicityOrg'}, {successMessageMode: 'none'})
}

/**
 * 政策字典信息:
 * 获取政策推送规则类型
 */
export const getPushRuleType = () => {
  return defHttp.get({url:'/policy/dict/getPushRuleType'}, {successMessageMode: 'none'})
}

/**
 * 政策字典信息:
 * 获取政策推送类型
 */
export const getPushRuleWay = () => {
  return defHttp.get({url:'/policy/dict/getPushRuleWay'}, {successMessageMode: 'none'})
}

/**
 * 政策字典信息:
 * 获取政策类型
 */
export const getType = () => {
  return defHttp.get({url:'/policy/dict/getType'}, {successMessageMode: 'none'})
}

/**
 * 政策字典信息:
 * 获取确认状态
 */
export const getAuditDict = () => {
  return defHttp.get({url:'/policy/dict/getAuditDict'}, {successMessageMode: 'none'})
}

/**
 * 政策字典信息:
 * 获取转派状态
 */
export const getTransferDict = () => {
  return defHttp.get({url:'/policy/dict/getTransferDict'}, {successMessageMode: 'none'})
}

/**
 * 政策字典信息:
 * 获取精准推送状态
 */
export const getPushState = () => {
  return defHttp.get({url:'/policy/dict/pushState'}, {successMessageMode: 'none'})
}

/**
 * 政策列表(主动汇集政策)-分页查询
 */
export const getManualCollectPolicyList = (params) => {
  return defHttp.get({url: '/policy/base/manualCollectPolicyList', params})
}

/**
 * 政策字典信息:
 * 仪表盘-工作台年份下拉列表查询
 */
export const getYearList = () => {
  return defHttp.get({url:'/policy/dict/getYearList'}, {successMessageMode: 'none'})
}

/**
 * 政策字典信息:
 * 精准推送-自定义规则判断条件
 */
export const getEntRegisterTime = () => {
  return defHttp.get({url:'/policy/dict/entRegisterTime'}, {successMessageMode: 'none'})
}

/**
 * 政策字典信息:
 * 精准推送-自定义规则-营业收入年份下拉列表
 */
export const getPolicyYearList = () => {
  return defHttp.get({url:'/policy/dict/yearList'}, {successMessageMode: 'none'})
}

/**
 * 政策字典信息:
 * 精准推送-自定义规则企业字段
 */
export const getEntFieldList = () => {
  return defHttp.get({url:'/policy/dict/entField'}, {successMessageMode: 'none'})
}

/**
 * 政策列表-汇总统计
 */
export const getSummaryByPolicy = (params) => {
  return defHttp.get({url: '/policy/base/summaryByPolicy', params})
}

/**
 * 政策列表（已发布）-分页
 */
export const getReleasePolicyList = (params) => {
  return defHttp.get({url: '/policy/base/releasePolicyList', params})
}

/**
 * 政策列表（已下架）-分页
 */
export const getSoldOutPolicyList = (params) => {
  return defHttp.get({url: '/policy/base/soldOutPolicyList', params})
}

/**
 * 政策列表（待确认）-分页
 */
export const getUnAuditPolicyList = (params) => {
  return defHttp.get({url: '/policy/base/unAuditPolicyList', params})
}

/**
 * 政策列表（未发布）-分页
 */
export const getUnReleasePolicyList = (params) => {
  return defHttp.get({url: '/policy/base/unReleasePolicyList', params})
}

/**
 * 政策列表(确认部门)-分页
 */
export const getUnAuditPolicyListByDepartment = (params) => {
  return defHttp.get({url: '/policy/base/unAuditPolicyListByDepartment', params})
}

/**
 * 发布单条政策
 */
export const releasePolicy = (params) => {
  return defHttp.get({url: '/policy/oder/release', params})
}

/**
 * 批量发布政策
 */
export const batchRelease = (params) => {
  return defHttp.get({url: '/policy/oder/batchRelease', params})
}

/**
 * 政策发布确认转派列表-分页
 */
export const getPolicyTransferList = (params) => {
  return defHttp.get({url: '/policy/transfer/policyTransferList', params})
}

/**
 * 查询部门列表（带层级）
 */
export const queryDepartTreeList = (params) => {
  return defHttp.get({url: '/sys/sysDepart/queryTreeList', params})
}

/**
 * 查询部门列表（不带层级）
 */
export const queryDepartByOrgType = (params) => {
  return defHttp.get({url: '/sys/sysDepart/queryDepartByOrgType', params})
}

/**
 * 获取待转派发布任务条数
 */
export const getUnTransferPolicyTaskNum = () => {
  return defHttp.get({url: '/policy/transfer/getUnTransferTaskNum'})
}

/**
 * 转派政策
 */
export const transferPolicy = (params) => {
  return defHttp.post({url: '/policy/transfer/transfer', params})
}

/**
 * 批量转派政策
 */
export const batchTransferPolicy = (params) => {
  return defHttp.get({url: '/policy/transfer/batchTransfer', params})
}

/**
 * 确认政策
 */
export const auditPolicy = (params) => {
  return defHttp.post({url: '/policy/oder/audit', params})
}

/**
 * 批量确认政策
 */
export const batchAuditPolicy = (params) => {
  return defHttp.post({url: '/policy/oder/batchAudit', params})
}

/**
 * 查看政策
 */
export const soldOutPolicy = (params) => {
  return defHttp.get({url: '/policy/oder/soldOut', params})
}

/**
 * 删除政策
 */ 
export const deletePolicy = (params) => {
  return defHttp.delete({url: '/policy/base/delete', params}, {joinParamsToUrl: true})
}

/**
 * 批量下架政策
 */
export const batchSoldOutPolicy = (params) => {
  return defHttp.get({url: '/policy/oder/batchSoldOut', params})
}

/**
 * 查看政策确认详情(政策发布确认)
 */
export const getPolicyAuditView = (params) => {
  return defHttp.get({url: '/policy//base/policyAuditView', params})
}

/**
 * 查看政策确认详情(待确认、已发布、已下架)
 */
export const getPolicyFlowView = (params) => {
  return defHttp.get({url: '/policy/base/policyFlowView', params})
}

/**
 * 政策发布自动确认设置
 */
export const releaseAutoSet = (params) => {
  return defHttp.get({url: '/policy/audit/set/releaseAutoSet', params})
}

/**
 * 查询部门政策发布自动确认设置
 * autotyp: 0 政策发布，1精准推送
 */
export const findAutoSetByOrgCode = (params) => {
  return defHttp.get({url: '/policy/audit/set/findAutoSetByOrgCode', params})
}

/**
 * 新增精准推送
 */
export const addPush = (params) => {
  return defHttp.post({url: '/policy/push/add', params})
}

/**
 * 新增精准推送
 */
export const editPush = (params) => {
  return defHttp.post({url: '/policy/push/edit', params})
}

/**
 * 删除精准推送
 */ 
export const deletePush = (params) => {
  return defHttp.delete({url: '/policy/push/delete', params}, {joinParamsToUrl: true})
}

/**
 * 批量删除精准推送
 */ 
export const batchDeletePush = (params) => {
  return defHttp.delete({url: '/policy/push/batchDelete', params}, {joinParamsToUrl: true})
}

/**
 * 推送列表(精准推送确认)-分页查询
 */
export const getPushAuditList = (params) => {
  return defHttp.get({url: '/policy/push/pushAuditList', params})
}

/**
 * 推送列表(精准推送确认转派)-分页查询
 */
export const getPushTransferList = (params) => {
  return defHttp.get({url: '/policy/push/pushTransferList', params})
}

/**
 * 推送列表(已精准推送)-分页查询
 */
export const getReleasePushList = (params) => {
  return defHttp.get({url: '/policy/push/releasePushList', params})
}

/**
 * 推送列表(待确认,已驳回)-分页查询
 */
export const getUnAuditAndRejectList = (params) => {
  return defHttp.get({url: '/policy/push/unAuditAndRejectList', params})
}

/**
 * 查看精准推送详情
 */
export const getPushView = (params) => {
  return defHttp.get({url: '/policy/push/view', params}, {successMessageMode: 'none'})
}

/**
 * 精准推送自动确认设置
 */
export const pushAutoSet = (params) => {
  return defHttp.get({url: '/policy/audit/set/pushAutoSet', params})
}

/**
 * 查询精准推送自定义企业列表
 */
export const queryEntList = (params?) => {
  return defHttp.post({url: '/policy/push/entList', params}, {successMessageMode: 'none'})
}

/**
 * 精准推送-自定义匹配企业-列表查询
 */
export const queryPushEntCustomRule = (params?) => {
  return defHttp.get({url: '/policy/pushEntCustomRule/list', params}, {successMessageMode: 'none'})
}

/**
 * 精准推送选择政策(申报类型的未发布和已发布状态)列表
 */
export const choosePolicyList = (params) => {
  return defHttp.get({url: '/policy/base/choosePolicyList', params}, {successMessageMode: 'none'})
}

/**
 * 精准推送转派
 */
export const transferPush = (params) => {
  return defHttp.post({url: '/policy/push/transfer/transfer', params})
}

/**
 * 精准推送批量转派
 */
export const batchTransferPush = (params) => {
  return defHttp.get({url: '/policy/push/transfer/batchTransfer', params})
}

/**
 * 精准推送确认
 */
export const auditPush = (params) => {
  return defHttp.post({url: '/policy/push/order/audit', params})
}

/**
 * 批量精准推送确认
 */
export const batchAuditPush = (params) => {
  return defHttp.post({url: '/policy/push/order/batchAudit', params})
}

/**
 * 获取待转派发布任务条数
 */
export const getUnTransferPushTaskNum = () => {
  return defHttp.get({url: '/policy/push/transfer/getUnTransferTaskNum'}, {successMessageMode: 'none'})
}


/**
 * 精准推送确认转派详情
 */
export const pushAuditTransferDetail = (params) => {
  return defHttp.get({url: '/policy/push/transfer/pushAuditTransferDetail', params})
}

/**
 * 政策发布确认转派详情
 */
export const policyAuditTransferDetail = (params) => {
  return defHttp.get({url: '/policy/transfer/policyAuditTransferDetail', params})
}

/**
 * 仪表盘：政策精准推送分析统计查询
 */
export const policyPushAnalysis = (params) => {
  return defHttp.get({url: '/policy/dashboard/policyPushAnalysis', params})
}

/**
 * 仪表盘：政策分享收藏榜查询
 */
export const policyRankList = (params) => {
  return defHttp.post({url: '/policy/dashboard/policyRankList', params})
}

/**
 * 仪表盘：政策发布分析统计查询
 */
export const policyReleaseAnalysis = (params) => {
  return defHttp.get({url: '/policy/dashboard/policyReleaseAnalysis', params})
}

/**
 * 仪表盘：政策产业类型统计查询
 */
export const policyReleaseDepartment = (params) => {
  return defHttp.get({url: '/policy/dashboard/policyIndustryStatistics', params})
}

/**
 * 仪表盘：政策类型分布统计查询
 */
export const policyTypeDistribution = () => {
  return defHttp.get({url: '/policy/dashboard/policyTypeDistribution'})
}

/**
 * 仪表盘：地区政策分析统计
 */
export const getRegionalPolicyAnalysisByBase = () => {
  return defHttp.get({url: '/policy/dashboard/regionalPolicyAnalysisByBase'})
}

/**
 * 仪表盘：政策订阅标签前10名榜单
 */
export const getPolicyLabelSubscribeTop = () => {
  return defHttp.get({url: '/policy/dashboard/policyLabelSubscribeTop10'})
}

/**
 * 工作台：确认预警统计查询
 */
export const auditEarlyWarning = (params?) => {
  return defHttp.get({url: '/policy/workbench/auditEarlyWarning', params})
}

/**
 * 工作台：精准推送确认完成率分析统计查询
 */
export const policyPushRatioAnalysis = (params?) => {
  return defHttp.get({url: '/policy/workbench/policyPushRatioAnalysis', params})
}

/**
 * 工作台：政策发布确认完成率分析统计查询
 */
export const policyReleaseRatioAnalysis = (params?) => {
  return defHttp.get({url: '/policy/workbench/policyReleaseRatioAnalysis', params})
}

/**
 * 工作台：地区政策分析统计查询
 */
export const regionalPolicyAnalysisByBase = (params?) => {
  return defHttp.get({url: '/policy/workbench/regionalPolicyAnalysisByBase', params})
}

/**
 * 工作台：待办事项统计查询
 */
export const toDoTasks = (params?) => {
  return defHttp.get({url: '/policy/workbench/toDoTasks', params})
}

/**
 * 企业获取字典：ent_info_qylx  企业类型     ent_info_qygm 企业规模  ent_info_sshy 所属行业
 */
export const getManyDictItems = (params?) => {
  return defHttp.get({url: '/enterprise/entInfo/getManyDictItems', params})
}


// 政策来源
export const getPolicySource = (params?) => {
  return defHttp.get({url: '/policy/dict/getPolicySource', params})
}


// 查询自动回击政策&主动汇集政策数量
export const policySumStatistics = (params?) => {
  return defHttp.get({url: '/policy/base/policySumStatistics', params})
}