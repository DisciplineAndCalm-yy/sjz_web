import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

export const appeal_getAppealList = (params) => defHttp.get({ url: '/form/fmAppealSelf/list', params }); //获取诉求收集列表
export const appeal_getCountInfo = (params) => defHttp.get({ url: '/form/fmAppealSelf/getCountInfo', params });
export const appeal_getDistrictList = (params) => defHttp.get({ url: '/form/fmAppealSelf/getDistrictList', params });
export const appeal_getDepartList = (params) => defHttp.get({ url: '/form/fmAppealSelf/getDepartList', params });
export const appeal_addDepart = (params) => defHttp.get({ url: '/form/fmAppealSelf/addDepart', params });
export const appeal_deleteDepart = (params) => defHttp.get({ url: '/form/fmAppealSelf/deleteDepart', params });
export const appeal_processAppeal = (params) => defHttp.get({ url: '/form/fmAppealSelf/processAppeal', params });
export const appeal_getAppealDetail = (params) => defHttp.get({ url: '/form/fmAppealSelf/getAppealDetail', params });
export const appeal_addDownloadTime = (params?) => defHttp.get({ url: '/form/fmAppealSelf/addDownloadTime', params });
export const appeal_updateDepartName = (params?) => defHttp.get({ url: '/form/fmAppealSelf/updateDepartName', params });

export const appeal_exportForm = (params) =>
  defHttp.post(
    { url: '/form/fmAppealSelf/exportXls', responseType: 'blob', params, headers: { 'content-type': ContentTypeEnum.FORM_URLENCODED } },
    { isTransformResponse: false }
  ); //诉求-导出数据
