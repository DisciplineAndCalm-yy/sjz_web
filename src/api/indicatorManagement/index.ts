import { defHttp } from '/@/utils/http/axios';
import { EvidenceResult } from '/@/views/common/evidenceDetailModal';
import { IndicatorProcessDetail, IndicatorProjectDetail } from '/@/views/indicatorManagement/newCollection/index.data';

/**
 * 指标体系列表
 */

export const indicatorTemplateList = (params) => defHttp.get({ url: '/indicator/indicatorTemplate/list', params }); //指标体系-列表分页
export const queryTemplateChooseList = (params?) => defHttp.get({ url: '/indicator/indicatorTemplate/queryTemplateChooseList', params }); //指标体系-列表下拉
export const copyTemplate = (params) => defHttp.get({ url: '/indicator/indicatorTemplate/copyTemplate', params }); //指标体系-复制
export const indicatorTemplateAdd = (params) => defHttp.post({ url: '/indicator/indicatorTemplate/add', params }); //指标体系-新增
export const indicatorTemplateEdit = (params) => defHttp.post({ url: '/indicator/indicatorTemplate/edit', params }); //指标体系-编辑
export const indicatorTemplateDel = (params) => defHttp.get({ url: '/indicator/indicatorTemplate/delete', params }); //指标体系-删除
export const indicatorTree = (params) => defHttp.get({ url: '/indicator/indicatorTree', params }); //新建指标-查询指标树

export const indicatorAdd = (params) => defHttp.post({ url: '/indicator/add', params }); //指标-新增
export const indicatorEdit = (params) => defHttp.post({ url: '/indicator/edit', params }); //指标-编辑
export const indicatorDel = (params) => defHttp.get({ url: '/indicator/delete', params }); //指标-删除
export const importTemplate = '/indicator/indicatorTemplate/importTemplate'; //指标-导入模板体系
export const exportTemplate = '/indicator/indicatorTemplate/exportTemplate'; //指标-导出模板体系
export const exportEmptyTemplate = '/indicator/indicatorTemplate/exportEmptyTemplate'; //指标-下载模板

export const questionList = (params) => defHttp.get({ url: '/indicator/templateQuestion/list', params }); //新建指标-查询题目
export const questionAdd = (params) => defHttp.post({ url: '/indicator/templateQuestion/add', params }); //问题-新增
export const questionEdit = (params) => defHttp.post({ url: '/indicator/templateQuestion/edit', params }); //问题-编辑
export const questionDel = (params) => defHttp.get({ url: '/indicator/templateQuestion/delete', params }); //问题-删除
export const updateSort = (params) => defHttp.get({ url: '/indicator/templateQuestion/updateSort', params }); //问题-排序

export const projectList = (params) => defHttp.get({ url: '/indicator/project/list', params }); //采集任务-列表分页
export const queryMonitorTypeList = (params) => defHttp.get({ url: '/indicator/project/queryMonitorTypeList', params }); //采集任务-采集范围枚举列表
export const projectAdd = (params) => defHttp.post({ url: '/indicator/project/add', params }); //采集任务-添加采集任务
export const projectEdit = (params) => defHttp.post({ url: '/indicator/project/edit', params }); //采集任务-编辑采集任务
export const projectDel = (params) => defHttp.get({ url: '/indicator/project/delete', params }); //采集任务-删除
export const projectFinish = (params) => defHttp.get({ url: '/indicator/project/finish', params }); //采集任务-结束
export const projectFinishCheck = (params) => defHttp.get({ url: '/indicator/project/finishCheck', params }); //采集任务-结束
export const projectDetail = (params) => defHttp.get({ url: '/indicator/project/projectDetail', params }); //采集任务-查看项目详情
export const activate = (params) => defHttp.get({ url: '/indicator/project/activate', params }); //采集任务-激活
export const queryProjectInfo = (params) => defHttp.get<IndicatorProjectDetail>({ url: '/indicator/project/projectInfo', params }); // 集采项目任务详情
export const queryEvidence = (params) => defHttp.get<EvidenceResult>({ url: '/project/projectAnswer/queryEvidence', params }); // 查询佐证
// export const downloadEvidence = (params) => defHttp.get<BlobPart>({ url: '/project/projectAnswer/download/evidence', params }); // 佐证下载
export const downloadEvidence = '/project/projectAnswer/download/evidence';
export const sendProjectAnnounce = (params) => defHttp.get({ url: '/indicator/project/sendProjectAnnounce', params }); // 催报

export const queryProjectIndicatorTree = (params) => defHttp.get({ url: '/indicator/projectIndicator/queryProjectIndicatorTree', params }); //采集任务-查询指标树
export const updateIndicatorStatus = (params) => defHttp.get({ url: '/indicator/projectIndicator/updateIndicatorStatus', params }); //采集任务-配置指标参数-开启指标开关切换

export const queryQuestionList = (params) => defHttp.get({ url: '/indicator/projectQuestion/queryQuestionList', params }); //采集任务-查询三级指标
export const updateQuestionStatus = (params) => defHttp.get({ url: '/indicator/projectQuestion/updateQuestionStatus', params }); //采集任务-查询三级指标

export const querySendOrg = (params) => defHttp.get({ url: '/indicator/projectDepart/querySendOrg', params }); //采集任务-查询报送范围-下拉
export const querySets = (params) => defHttp.get({ url: '/indicator/projectDepart/get', params }); //采集任务-根据三级指标查询报送范围
export const querySendDepart = (params) => defHttp.get({ url: '/indicator/projectDepart/querySendDepart', params }); //采集任务-查询报送部门
export const queryCheckRole = (params) => defHttp.get({ url: '/indicator/projectDepart/queryCheckRole', params }); //采集任务-查询校核角色
export const replaySet = (params) => defHttp.post({ url: '/indicator/projectDepart/add', params }); //采集任务-新增报送范围

export const projectQueryIndWeight = (params) =>
  defHttp.get({ url: '/indicator/project/projectWeight/queryIndWeight', params }, { successMessageMode: 'none' }); // 项目-查询指标权重列表
export const projectQueryLastIndWeight = (params) =>
  defHttp.get({ url: '/indicator/project/projectWeight/queryLastIndWeight', params }, { successMessageMode: 'none' }); // 项目-查询末级指标及问题权重列表
export const projectQueryQuRule = (params) =>
  defHttp.get({ url: '/indicator/project/projectWeight/queryQuRule', params }, { successMessageMode: 'none' }); // 项目-查看问题规则
export const projectSaveQuRule = (params) => defHttp.post({ url: '/indicator/project/projectWeight/saveQuRule', params }); // 项目-保存问题规则
export const projectSaveIndWeight = (params) => defHttp.post({ url: '/indicator/project/projectWeight/saveIndWeight', params }); // 项目-保存指标权重
export const projectSaveLastIndWeight = (params) => defHttp.post({ url: '/indicator/project/projectWeight/saveLastIndWeight', params }); // 项目-保存末级指标及问题权重
export const projectQueryMonitor = (params) =>
  defHttp.get({ url: '/indicator/project/projectWeight/queryMonitor', params }, { successMessageMode: 'none' }); // 项目-监测项

/**
 * 指标算法配置相关接口
 */
export const queryIndWeight = (params) => defHttp.get({ url: '/indicator/templateWeight/queryIndWeight', params }, { successMessageMode: 'none' }); // 指标体系-查询指标权重列表
export const queryLastIndWeight = (params) =>
  defHttp.get({ url: '/indicator/templateWeight/queryLastIndWeight', params }, { successMessageMode: 'none' }); // 指标体系-查询末级指标及问题权重列表
export const queryMonitor = (params) => defHttp.get({ url: '/indicator/templateWeight/queryMonitor', params }, { successMessageMode: 'none' }); // 指标体系-监测项
export const templateWeightPreview = (params) => defHttp.get({ url: '/indicator/templateWeight/preview', params }); // 指标体系-指标体系权重预览
export const queryQuRule = (params) => defHttp.get({ url: '/indicator/templateWeight/queryQuRule', params }, { successMessageMode: 'none' }); // 指标体系-查看问题规则
export const saveQuRule = (params) => defHttp.post({ url: '/indicator/templateWeight/saveQuRule', params }); // 指标体系-保存问题规则
export const saveIndWeight = (params) => defHttp.post({ url: '/indicator/templateWeight/saveIndWeight', params }); // 指标体系-保存指标权重
export const saveLastIndWeight = (params) => defHttp.post({ url: '/indicator/templateWeight/saveLastIndWeight', params }); // 指标体系-保存末级指标及问题权重
export const templateWeightExport = '/indicator/templateWeight/export'; // 指标体系-导出指标体系权重
export const getGreaterRule = (params?) => defHttp.get({ url: '/indicator/templateWeight/getGreaterRule', params }); // 字典-计分方法_大于规则
export const getDeductAccord = (params?) => defHttp.get({ url: '/indicator/templateWeight/getDeductAccord', params }); // 字典-计分方法_扣分法_扣分依据
export const getDeductMethod = (params?) => defHttp.get({ url: '/indicator/templateWeight/getDeductMethod', params }); // 字典-计分方法_扣分法_扣分方法
export const getEfficacyMethod = (params?) => defHttp.get({ url: '/indicator/templateWeight/getEfficacyMethod', params }); // 字典-计分方法_功效法_方法
export const getLessRule = (params?) => defHttp.get({ url: '/indicator/templateWeight/getLessRule', params }); // 字典-计分方法_小于规则
export const getQuestionConfigType = (params?) => defHttp.get({ url: '/indicator/templateWeight/getQuestionConfigType', params }); // 字典-计分方法
export const getLayerMethod = (params?) => defHttp.get({ url: '/indicator/templateWeight/getLayerMethod', params }); // 字典-计分方法_层差法_方法

// 集采详情接口
export const queryDepartProcess = (params) => defHttp.get({ url: '/indicator/projectIndicator/queryDepartProcess', params }); // 部门维度
export const queryIndicatorProcess = (params) => defHttp.get({ url: '/indicator/projectIndicator/queryIndicatorProcess', params }); // 指标维度
export const queryIndicatorProcessDetail = (params) =>
  defHttp.get<IndicatorProcessDetail>({ url: '/indicator/projectQuestion/queryIndicatorProcessDetail', params }); // 三级指标维度 未
export const queryDepartProcessDetail = (params) => defHttp.get({ url: '/indicator/projectIndicator/queryDepartProcessDetail', params }); // 三级部门维度
export const getScoreFlag = (params?) => defHttp.get({ url: '/indicator/templateWeight/getScoreFlag', params }); // 字典-是否计分
export const coloectQuestionList = (params) => defHttp.get({ url: '/indicator/projectQuestion/queryOpenQuestionList', params }); //集采详情-查询题目


export const listNoCareTenant = (params) => defHttp.get({ url: '/sys/user/listAll', params });