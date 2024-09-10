/*
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-12-04 13:58:29
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-05 16:17:12
 * @FilePath: \yst-province-hebei-web\src\api\dataReport\inde.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defHttp } from '/@/utils/http/axios';

/**
 * 数据报送相关接口
 */
export const sendFillAnswerList = (params) => defHttp.get({ url: '/project/send/fillAnswer/list', params }) // 查询填报人数据报送分页列表
export const fillAnswerQuerySendQuestionList = (params) => defHttp.get({ url: '/project/send/fillAnswer/querySendQuestionList', params }) // 查询填报人开启问题列表分页列表
export const sendList = (params) => defHttp.get({ url: '/project/send/list', params }) // 数据报送分页列表-创建人
export const fillAnswerQueryOpenIndicatorTree = (params) => defHttp.get({ url: '/project/send/fillAnswer/queryOpenIndicatorTree', params }) // 查询填报人报送下拉指标树
export const queryOpenIndicatorTree = (params) => defHttp.get({ url: '/project/send/queryOpenIndicatorTree', params }) // 查询报送下拉指标树
export const querySendQuestionList = (params) => defHttp.get({ url: '/project/send/querySendQuestionList', params }) // 查询开启问题列表
export const submitSendAnswer = (params) => defHttp.post({ url: '/project/send/submitSendAnswer', params }) // 提交报送答案
export const projectFinishList = (params) => defHttp.get({ url: '/project/send/projectFinishList', params }) // 一键报送下拉采集任务列表
export const copySendAnswer = (params) => defHttp.get({ url: '/project/send/copySendAnswer', params }) // 一键报送
export const importSendAnswer = (file, params?) => defHttp.uploadFile({ url: '/project/send/importSendAnswer' }, {file, data: params} ) // 导入采集数据
export const exportSendAnswer = '/project/send/exportSendAnswer'  // 导出采集数据


