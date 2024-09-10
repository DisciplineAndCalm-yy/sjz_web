/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-21 17:35:49
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-05-16 10:36:45
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/dashboard/index.api.ts
 * @Description  : 仪表盘接口
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  enterpriseDashboardEntMangerRecord= '/enterprise/dashboard/ent/mangerRecord', // 走访次数
  enterpriseDashboardEntProperties= '/enterprise/dashboard/ent/properties', // 性质统计
  enterpriseDashboardEntService= '/enterprise/dashboard/ent/service', // 服务统计
  enterpriseDashboardEntTrade= '/enterprise/dashboard/ent/trade', // 行业统计
  qixianMangerAppealAnalysis= '/qixian/manger/appealAnalysis', // 服务管家诉求处理分析
}


export const enterpriseDashboardEntMangerRecord = (params) => defHttp.get({ url: Api.enterpriseDashboardEntMangerRecord, params });
export const enterpriseDashboardEntProperties = () => defHttp.get({ url: Api.enterpriseDashboardEntProperties });
export const enterpriseDashboardEntService = () => defHttp.get({ url: Api.enterpriseDashboardEntService });
export const enterpriseDashboardEntTrade = () => defHttp.get({ url: Api.enterpriseDashboardEntTrade });
export const qixianMangerAppealAnalysis = (params) => defHttp.get({ url: Api.qixianMangerAppealAnalysis, params });
