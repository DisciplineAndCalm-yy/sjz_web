/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-19 10:55:42
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-04-21 10:03:47
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/monthly-report/index.api.ts
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  enterpriseEntMangerRecordReportList= '/enterprise/entMangerRecord/report/list', // 月报列表

  exportXls = '/enterprise/entMangerRecord/exportXls',
}


export const enterpriseEntMangerRecordReportList = (params) => defHttp.get({ url: Api.enterpriseEntMangerRecordReportList, params });

/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;