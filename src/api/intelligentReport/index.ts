/*
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-31 10:54:40
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-11-08 18:07:40
 * @FilePath: \yst-province-hebei-web\src\api\intelligentReport\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';

/**
 * 评价报告库
 */
export const addDir = (params) => defHttp.post({ url: '/storage/dir/add', params }); //评价报告库-添加目录
export const addDirStorage = (params) => defHttp.post({ url: '/storage/dir/addDirStorage', params }); //评价报告库-添加目录文件关联关系
export const updateDirStorage = (params) => defHttp.post({ url: '/storage/dir/updateDirStorage', params }); //评价报告库-添加目录文件关联关系
export const deleteDir = (params) => defHttp.delete({ url: '/storage/dir/delete', params }, { joinParamsToUrl: true }); //评价报告库-目录删除
export const deleteStorage = (params) => defHttp.get({ url: '/storage/dir/deleteStorage', params }); //评价报告库-文件删除
// export const downloadBatch = (params) => defHttp.get({ url: '/storage/dir/downloadBatch', params });//评价报告库-评价报告库文件下载
export const downloadBatch = '/storage/dir/downloadBatch'; //评价报告库-评价报告库文件下载
export const editDir = (params) => defHttp.post({ url: '/storage/dir/edit', params }); //评价报告库-编辑目录
export const getDirList = (params) => defHttp.get({ url: '/storage/dir/list', params }, { successMessageMode: 'none' }); //评价报告库-目录列表
export const queryStorageList = (params) => defHttp.get({ url: '/storage/dir/queryStorageList', params }, { successMessageMode: 'none' }); //评价报告库-根据目录id获取文件列表
export const revokeStorage = (params) => defHttp.post({ url: '/storage/dir/revokeStorage', params }); //评价报告库-文件撤回
export const sendDepartList = (params) => defHttp.get({ url: '/storage/dir/sendDepartList', params }, { successMessageMode: 'none' }); //评价报告库-文件分发部门列表
export const sendStorage = (params) => defHttp.post({ url: '/storage/dir/sendStorage', params }); //评价报告库-文件分发

/**
 * 自动报告库
 */
export const getReportTypeList = (params) => defHttp.post({ url: '/project/projectReport/projectList', params }, { successMessageMode: 'none' }); // 自动报告库列表

// 删除自动报告库
export const deleteReport = (params) => defHttp.get({ url: '/project/projectReport/deleteReport', params });

// 自动报告库列表
export const getReportList = (params) =>
  defHttp.post(
    {
      url: '/project/projectReport/reportList',
      params,
      headers: { 'content-type': ContentTypeEnum.FORM_URLENCODED },
    },
    { successMessageMode: 'none' }
  );

// 自动报告库-文件分发部门列表
export const queryProjectReportByDepart = (params) =>
  defHttp.get({ url: '/project/projectReportRel/sendDepartList', params }, { successMessageMode: 'none' });

// 自动报告库-分发
export const sendReportByDepart = (params) =>
  defHttp.post(
    {
      url: '/project/projectReportRel/sendReport',
      params,
      headers: { 'content-type': ContentTypeEnum.FORM_URLENCODED },
    },
    { successMessageMode: 'none' }
  );

// 自动报告库-撤回分发
export const revokeReportByDepart = (params) =>
  defHttp.post(
    {
      url: '/project/projectReportRel/revokeReport',
      params,
      headers: { 'content-type': ContentTypeEnum.FORM_URLENCODED },
    },
    { successMessageMode: 'none' }
  );

// 自动报告库-一级指标列表
export const getFirstLevelList = (params) =>
  defHttp.get(
    {
      url: '/project/projectReport/level1ind-list',
      params,
      headers: { 'content-type': ContentTypeEnum.FORM_URLENCODED },
    },
    { successMessageMode: 'none' }
  );

// 自动报告库-一级指标列表
export const getAutoReportPreview = (params) =>
  defHttp.get(
    {
      url: '/project/projectReport/preview',
      params,
      headers: { 'content-type': ContentTypeEnum.FORM_URLENCODED },
    },
    { successMessageMode: 'none' }
  );
