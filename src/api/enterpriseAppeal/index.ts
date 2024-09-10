import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

export const question_getStatusList = () => defHttp.get({ url: '/form/status/list' }); //问卷-状态合集
export const question_create = (params) => defHttp.post({ url: '/form/create2', params }); //问卷-创建
export const question_updateBaseInfo = (params) => defHttp.get({ url: '/form/updateBasicInfo', params }); //问卷-修改基本信息
export const question_get = (params) => defHttp.get({ url: '/form/questionInfoList', params }); //问卷-分页查询
export const question_delete = (params) => defHttp.post({ url: '/form/delete', params }); //问卷-删除
export const question_getByKey = (params) => defHttp.get({ url: `/form/${params.key}` }); //问卷-通过formKey查询
export const question_publish = (params) => defHttp.post({ url: '/form/publish', params }); //问卷-激活发布
export const question_stop = (params) => defHttp.post({ url: '/form/stop', params }); //问卷-停止收集
export const question_copyForm = (params) => defHttp.get({ url: '/form/copyForm', params }); //问卷-再次发起
export const question_getListLowScoreReason = (params) => defHttp.get({ url: '/form/data/listLowScoreReason', params }); //问卷-获取低分原因
export const question_exportForm = (params) =>
  defHttp.post(
    { url: '/form/data/zip', responseType: 'blob', params, headers: { 'content-type': ContentTypeEnum.FORM_URLENCODED } },
    { isTransformResponse: false }
  ); //问卷-导出数据

export const question_getItemList = (params) => defHttp.get({ url: '/form/item/list', params }); //问卷子项-查询
export const question_create_item = (params) => defHttp.post({ url: '/form/item/create', params }); //问卷子项-创建
export const question_sort = (params) => defHttp.post({ url: '/form/item/sort', params }); //问卷子项-排序
export const question_delete_item = (params) => defHttp.post({ url: '/form/item/delete', params }); //问卷子项-删除
export const question_update_item = (params) => defHttp.post({ url: '/form/item/update', params }); //问卷子项-属性更新

export const question_statistics_sampleList = (params) => defHttp.get({ url: '/form/sampleList', params }); //问卷-样本量统计
export const question_statistics_option = (params) => defHttp.get({ url: '/form/optionList', params }); //问卷-选项统计
export const question_statistics_satisfaction = (params) => defHttp.get({ url: '/form/data/satisfactionStatistics', params }); //问卷-满意度统计
export const question_statistics_area = (params) => defHttp.get({ url: '/form/data/regionStatistics', params }); //问卷-地区填报率统计

export const question_getMobileUrl = () => defHttp.get({ url: '/form/mobileUrl' }); //问卷-获取移动端地址
