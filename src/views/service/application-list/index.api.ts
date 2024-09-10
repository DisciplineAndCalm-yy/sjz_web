/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-19 10:55:42
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-28 16:55:30
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/application-list/index.api.ts
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  enterpriseEntMangerApplyList= '/enterprise/entMangerApply/list', // 申请列表
  enterpriseEntMangerApplyUnboundList = '/enterprise/entMangerApply/unbound/manger', // 未绑定
  enterpriseEntMangerApplyFinishBindingManger = '/enterprise/entMangerApply/finishBinding/manger', // 已绑定
  enterpriseEntMangerApplyBindManger= '/enterprise/entMangerApply/bind/manger', // 绑定
  enterpriseEntMangerApplyApplyApprove= '/enterprise/entMangerApply/applyApprove', // 暂不绑定
}


export const enterpriseEntMangerApplyList = (params) => defHttp.get({ url: Api.enterpriseEntMangerApplyList, params });
export const enterpriseEntMangerApplyUnboundList = (params) => defHttp.get({ url: Api.enterpriseEntMangerApplyUnboundList, params });
export const enterpriseEntMangerApplyFinishBindingManger = (params) => defHttp.get({ url: Api.enterpriseEntMangerApplyFinishBindingManger, params });
export const enterpriseEntMangerApplyBindManger = (params) => defHttp.get({ url: Api.enterpriseEntMangerApplyBindManger, params });
export const enterpriseEntMangerApplyApplyApprove = (params) => defHttp.post({ url: Api.enterpriseEntMangerApplyApplyApprove, params });
