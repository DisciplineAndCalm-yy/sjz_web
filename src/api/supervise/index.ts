
import { defHttp } from '/@/utils/http/axios';
import { EvidenceResult } from '/@/views/common/evidenceDetailModal';
import { IndicatorProcessDetail, IndicatorProjectDetail } from '/@/views/indicatorManagement/newCollection/index.data';

/**
 * 指标体系列表
 */
// export const indicatorTemplate = (params) => {
//   return defHttp.get({url: 'indicator/indicatorTemplate/list', params}, {successMessageMode: 'none'})
// }

export const getSchemas = (params) => defHttp.get({ url: '/sup/template/getByTemplateId', params }); //获取json
export const superviseAdd = (params?) => defHttp.post({ url: '/sup/base/add', params }); //新增
export const superviseEdit = (params?) => defHttp.post({ url: '/sup/base/editAdd', params }); //编辑
export const superviseDel = (params?) => defHttp.delete({ url: '/sup/base/delete', params }); //删除
export const getSupStatus = (params?) => defHttp.get({ url: '/sup/dict/getSupStatus', params }); //查询督办状态
export const superviseSendBatch = (params?) => defHttp.get({ url: '/sup/base/sendBatch', params }); //批量发起
export const copyTemplate = (params) => defHttp.get({ url: '/indicator/indicatorTemplate/copyTemplate', params }); //指标体系-复制
export const indicatorTemplateAdd = (params) => defHttp.post({ url: '/indicator/indicatorTemplate/add', params }); //指标体系-新增
export const indicatorTemplateEdit = (params) => defHttp.post({ url: '/indicator/indicatorTemplate/edit', params }); //指标体系-编辑
export const indicatorTemplateDel = (params) => defHttp.get({ url: '/indicator/indicatorTemplate/delete', params }); //指标体系-删除
export const indicatorTree = (params) => defHttp.get({ url: '/indicator/indicatorTree', params }); //新建指标-查询指标树

// 导入导出类
export const templateExport = '/sup/export/templateExport'; ///督办-任务模板下载
export const reviewDataExport = '/sup/export/reviewDataExport'; ///督办-下载待核定结果
export const dataExport = '/sup/export/dataExport'; ///督办-任务模板下载
export const operationReportExport = '/sup/export/operationReportExport'//详情-操作记录下载
export const dataImport = (file, params?) => defHttp.uploadFile({ url: '/sup/export/templateImport' }, {file, data: params} ) // 督办-批量任务导入
export const reviewDataImport = (file, params?) => defHttp.uploadFile({ url: '/sup/export/reviewDataImport' }, {file, data: params} ) // 督办-待核定结果导入


export const queryRolesByCurUser = (params) => defHttp.get({ url: '/sys/role/queryRolesByCurUser', params }); //督办-当前用户角色
export const superviseList = (params) => defHttp.get({ url: '/sup/base/list', params }); //督办-列表
export const superviseEditView = (params) => defHttp.get({ url: '/sup/base/editView', params }); //督办-编辑辉县
export const superviseDetail = (params) => defHttp.get({ url: '/sup/base/view', params }); //督办详情-督办信息
export const getHangTagType = () => defHttp.get({ url: '/sup/dict/getHangTagType' }); //督办详情-督办挂牌map
export const acceptedBatch = (params) => defHttp.get({ url: '/sup/base/acceptedBatch', params }); //督办详情-督办接收
export const supHangTag = (params) => defHttp.get({ url: '/sup/base/supHangTag', params }); //督办详情-督办挂牌
export const supReply = (params) => defHttp.get({ url: '/sup/base/supReply', params }); //督办详情-督办回复
export const supPostpone = (params) => defHttp.get({ url: '/sup/base/supPostpone', params }); //督办详情-督办延期
export const urgeBatch = (params) => defHttp.get({ url: '/sup/base/urgeBatch', params }); //督办详情-督办催办
export const supSubmit = (params) => defHttp.get({ url: '/sup/base/supSubmit', params }); //督办详情-督办(送审)发起核定
export const approvedBatch = (params) => defHttp.get({ url: '/sup/base/approvedBatch', params }); //督办详情-督办核定
