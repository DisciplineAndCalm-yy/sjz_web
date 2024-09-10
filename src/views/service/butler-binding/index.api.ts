/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-13 18:23:47
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-14 21:24:32
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/butler-binding/index.api.ts
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  enterpriseEntMangerBindingList = '/enterprise/entManger/manger/binding/list', // 绑定列表
  enterpriseEntMangerUnboundList = '/enterprise/entManger/unbound/list', // 未绑定
  enterpriseEntMangerBindingEntList = '/enterprise/entManger/bindingEnt/list', // 已绑定
  enterpriseEntMangerBindingEnt = '/enterprise/entManger/binding/ent', // 绑定
  enterpriseEntMangerEnumList = '/enterprise/entManger/enum/grade', // 管家级别枚举
  enterpriseEntMangerApplyEnumList = '/enterprise/entMangerApply/enum/status', // 绑定状态枚举
  enterpriseEntMangerCancelBindingEnt = '/enterprise/entManger/cancel/bindingEnt',// 取消绑定
  
  exportXls = '/enterprise/entManger/export/mangerXls',
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 列表接口
 * @param params
 */
export const enterpriseEntMangerBindingList = (params) => defHttp.get({ url: Api.enterpriseEntMangerBindingList, params });
export const enterpriseEntMangerUnboundList = (params) => defHttp.get({ url: Api.enterpriseEntMangerUnboundList, params });
export const enterpriseEntMangerBindingEntList = (params) => defHttp.get({ url: Api.enterpriseEntMangerBindingEntList, params });
export const enterpriseEntMangerBindingEnt = (params) => defHttp.get({ url: Api.enterpriseEntMangerBindingEnt, params });
export const enterpriseEntMangerEnumList = (params) => defHttp.get({ url: Api.enterpriseEntMangerEnumList, params });
export const enterpriseEntMangerApplyEnumList = (params) => defHttp.get({ url: Api.enterpriseEntMangerApplyEnumList, params });
export const enterpriseEntMangerCancelBindingEnt = (params) => defHttp.get({ url: Api.enterpriseEntMangerCancelBindingEnt, params });
