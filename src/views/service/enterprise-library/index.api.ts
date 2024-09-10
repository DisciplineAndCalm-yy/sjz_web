/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-13 10:18:15
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-26 15:25:48
 * @FilePath     : /yst-city-xixian-enterpriseServiceSystem-web/src/views/service/enterprise-library/index.api.ts
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  enterpriseEntInfoList = '/enterprise/entInfo/list', // 企业库列表
  enterpriseEntInfoAdd = '/enterprise/entInfo/add', // 企业库-添加
  enterpriseEntInfoEdit = '/enterprise/entInfo/edit', // 企业库-编辑
  enterpriseEntInfoDelete = '/enterprise/entInfo/delete', // 企业库-删除
  enterpriseEntUserList = '/enterprise/entUser/list', // 分页查询企业用户列表
  enterpriseEntInfoUpdateStatus = '/enterprise/entInfo/resetStatus', // 企业库-重置企业状态
  enterpriseEntInfoValidDuplicate = '/enterprise/entInfo/validDuplicate', // 企业库-校验
  enterpriseEntInfoQueryById = '/enterprise/entInfo/queryEntAllInfo', // 企业库-详情
  enterpriseEntInfoMoveCancel = '/enterprise/entInfoCancel/moveCancel', // 企业库-移入注销企业库
  
  enterpriseEntInfoDictList = '/enterprise/entInfo/getManyDictItems', // 企业库-查询多个字典

  importExcel = '/jeecgboot/enterprise/entInfo/importExcel',
  exportXls = '/enterprise/entInfo/exportXls',

  downloadTemplate = '/enterprise/entInfo/template'
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;
/**
 * 下载模版
 */
export const getTemplateUrl = Api.downloadTemplate;
/**
 * 列表接口
 * @param params
 */
export const enterpriseEntInfoList = (params) => defHttp.get({ url: Api.enterpriseEntInfoList, params });
export const enterpriseEntInfoAdd = (params) => defHttp.post({ url: Api.enterpriseEntInfoAdd, params });
export const enterpriseEntInfoEdit = (params) => defHttp.post({ url: Api.enterpriseEntInfoEdit, params });
export const enterpriseEntInfoDelete = (params) => defHttp.get({ url: Api.enterpriseEntInfoDelete, params });
export const enterpriseEntUserList = (params) => defHttp.get({ url: Api.enterpriseEntUserList, params });
export const enterpriseEntInfoUpdateStatus = (params) => defHttp.get({ url: Api.enterpriseEntInfoUpdateStatus, params });
export const enterpriseEntInfoValidDuplicate = (params) => defHttp.get({ url: Api.enterpriseEntInfoValidDuplicate, params });
export const enterpriseEntInfoQueryById = (params) => defHttp.post({ url: Api.enterpriseEntInfoQueryById, params });

export const enterpriseEntInfoDictList = (params) => defHttp.get({ url: Api.enterpriseEntInfoDictList, params });
export const enterpriseEntInfoMoveCancel = (params) => defHttp.get({ url: Api.enterpriseEntInfoMoveCancel, params });
