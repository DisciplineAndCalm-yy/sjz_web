/*
 * @Author: zxc ff5fly@163.com
 * @Date: 2024-03-05 15:54:34
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-03-20 10:28:58
 * @FilePath: \yst-city-shijiazhuang-web\src\api\businessScreen\businessScreen.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defHttp } from '/@/utils/http/axios';

/**
 * 年份下拉列表查询
 */
export const getYearList = (params) => {  
  return defHttp.get({url: '/screen/visual/getYearList', params})
}
/**
 * 客观数据表现
 */
export const getObjectiveData = (params) => {
  return defHttp.get({url: '/screen/visual/objective_data', params})
}
/**
 * 指标前沿目标值-省评前沿榜
 */
export const getIndicatorProvinceOptimum = (params) => {
  return defHttp.get({url: '/screen/visual/indicator_province_optimum', params})
}
/**
 * 下属区县营商表现
 */
export const getBusinessManifestation = (params) => {
  return defHttp.get({url: '/screen/visual/business_manifestation', params})
}
/**
 * 重大事件或创新举措
 */
export const getImportantEvent = (params) => {
  return defHttp.get({url: '/screen/visual/important_event', params})
}
/**
 * 重点工作-任务落实
 */
export const getImportantWork = (params) => {
  return defHttp.get({url: '/screen/visual/important_work', params})
}
/**
 * 指标表现
 */ 
export const getIndicatorManifestation = (params) => {
  return defHttp.get({url: '/screen/visual/indicator_manifestation', params})
}
/**
 * 企业满意度表现
 */
export const getEnterpriseSatisfaction = (params) => {
  return defHttp.get({url: '/screen/visual/enterprise_satisfaction', params})
}
/**
 * 区县综合得分排名信息
 */
export const getMapRegionDetails = (params) => {
  return defHttp.get({url: '/screen/visual/map_region_details', params})
}
/**
 * 总成绩
 */
export const getOverallStatistics = (params) => {
  return defHttp.get({url: '/screen/visual/overall_statistics', params})
}
/**
 * 营商洞察导入模板下载
 */
export const downloadTemplate = '/screen/import/screen_template_download'
/**
 * 营商洞察模板导入
 */
export const importTemplate = '/screen/import/screen_template_import'

/**
 * 营商行动
 */
export const getBusinessAction = (params) => {
  return defHttp.get({url: '/sup/screen/business_action', params})
}
/**
 * 营商月追踪
 */
export const getBusinessMonthTracking = (params) => {
  return defHttp.get({url: '/sup/screen/business_month_tracking', params})
}
/**
 * 督办数据统计
 */
export const getDataStatistics = (params) => {
  return defHttp.get({url: '/sup/screen/data_statistics', params})
}
/**
 * 任务概览
 */
export const getTaskOverview = (params) => {
  return defHttp.get({url: '/sup/screen/task_overview', params})
}
/**
 * 督办类型占比
 */
export const getTypeProportion = (params) => {
  return defHttp.get({url: '/sup/screen/type_proportion', params})
}