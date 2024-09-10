import { defHttp } from '/@/utils/http/axios';
/**
 * 智慧评分接口
 */

export const checkTemplateList = (params) => defHttp.get({ url: '/project/check/list', params }); //指标数据核验-列表分页
export const scoreTemplateList = (params) => defHttp.get({ url: '/indicator/project/score/list', params }); //评分预览-列表分页
export const checkIndicatorTree = (params) => defHttp.get({ url: '/project/check/checkIndicatorTree', params }); //指标数据核验-查询指标树
export const queryProjectIndicatorTree = (params) => defHttp.get({ url: '/indicator/projectIndicator/queryProjectIndicatorTree', params }); //采集任务-查询指标树
export const queryCheckQuestionList = (params) => defHttp.get({ url: '/project/check/queryCheckQuestionList', params }); //采集任务-查询校核问题列表
export const checkAnswer = (params) => defHttp.post({ url: '/project/check/checkAnswer', params }); //采集任务-校核答案
export const downloadEvidence = '/project/projectAnswer/download/evidence'; //佐证下载
export const preview = (params) => defHttp.get({ url: '/indicator/project/score/preview', params }); //评分预览
export const getSupid = (params) => defHttp.get({ url: '/sup/dict/getSupEvaluationTemplateId', params }); //获取模板id
export const batchSupSend = (params) => defHttp.post({ url: '/sup/evaluation/batch_sup_send', params }); //一键督办
export const queryIndInfoById = (params) => defHttp.get({ url: '/indicator/projectQuestion/queryIndInfoById', params }); //一键督办-查询指标
export const batchSupSave = (params) => defHttp.post({ url: '/sup/evaluation/save_draft', params }); //保存督办草稿
export const generate = (params) => defHttp.get({ url: '/indicator/project/score/generate', params }); //生成自动报告

export const exportCheckAnswer = '/project/check/exportCheckAnswer'; //指标-导出采集任务
export const exportTemplate = '/indicator/project/score/export'; //指标-导出评分预览
