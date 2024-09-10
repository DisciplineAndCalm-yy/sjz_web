/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-19 10:55:42
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-05-16 14:37:52
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/service-log/index.api.ts
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  enterpriseEntMangerRecordList= '/enterprise/entMangerRecord/list', // 服务记录列表 - 日常走访
  qixianMangerMangerServiceRecord= '/qixian/manger/mangerServiceRecord', // 服务记录列表 - 诉求处理
}


export const enterpriseEntMangerRecordList = (params) => defHttp.get({ url: Api.enterpriseEntMangerRecordList, params });
export const qixianMangerMangerServiceRecord = (params) => defHttp.get({ url: Api.qixianMangerMangerServiceRecord, params });