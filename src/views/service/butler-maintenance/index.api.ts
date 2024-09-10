/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-13 18:23:47
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-04-18 17:24:21
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/butler-maintenance/index.api.ts
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  enterpriseEntMangerMangerList= '/enterprise/entManger/manger/list', // 维护管家列表
  enterpriseEntMangerSaveOrUpdateManger = '/enterprise/entManger/saveOrUpdate/manger', // 维护管家信息
}

export const enterpriseEntMangerMangerList = (params) => defHttp.get({ url: Api.enterpriseEntMangerMangerList, params });
export const enterpriseEntMangerSaveOrUpdateManger = (params) => defHttp.get({ url: Api.enterpriseEntMangerSaveOrUpdateManger, params });