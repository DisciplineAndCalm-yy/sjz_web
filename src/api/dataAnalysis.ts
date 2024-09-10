import { defHttp } from '/@/utils/http/axios';
enum Api {
  data = '/xixian/statistics/appealVolume',
  type = '/xixian/statistics/appealType',
  zxdata = '/xixian/statistics/consultingDataAnalysis',
  zxdataTable = '/xixian/statistics/eventTypeAnalysisPage',
  myTJFX = '/xixian/statistics/satisfactionAnalysis',
  satisfactionScoreAnalysis = '/xixian/statistics/departmentRanking', // todo
  satisfactionScoreAnalysisExport = '/xixian/statistics/departmentRankingExport', // todo
  satisfactionOverallAnalysis = '/xixian/statistics/satisfactionOverallAnalysis',
  dissatisfactionAnalysis = '/xixian/statistics/indexSatisfactionAnalysis',
  questionnairelist = '/xixian/questionnaire/list',
  statisticsautoSpecial = '/xixian/statistics/autoSpecial',
  statisticsEventRanking = '/xixian/statistics/eventRanking',
  statisticsTaskTotalProcess = '/xixian/statistics/task/totalProcess',
  statisticsTaskDepartment = '/xixian/statistics/task/department',
  questionnaireThresholdValue = '/xixian/questionnaire/thresholdValue/',
  statisticsEventRankingExport = '/xixian/statistics/eventRankingExport',
  statisticsConsultingDataAnalysisExport = '/xixian/statistics/consultingDataAnalysisExport',
  statisticsDissatisfactionAnalysisExport = '/xixian/statistics/dissatisfactionAnalysisExport',
  statisticsTaskDepartmentDownload = '/xixian/statistics/task/department/download',
  statisticsTaskTotalProcessDownload = '/xixian/statistics/task/totalProcess/download',
  statisticsAutoSpecialDownload = '/xixian/statistics/autoSpecial/',
  dropdownBox = '/xixian/comment/getDropdownBox', // 各指标满意度分析下拉框
  workOrdersAndProgress = '/xixian/caseHandling/getWorkOrdersAndProgress', //总工单量以及进度情况
  workOrdersAndProgressExportXls = '/xixian/caseHandling/getWorkOrdersAndProgressExportXls', // 导出总工单量以及进度情况
  departmentalProgress = '/xixian/caseHandling/getDepartmentalProgress', // 处理部门工作进展导出
  departmentalProgressExportXls = '/xixian/caseHandling/getDepartmentalProgressExportXls', // 导出处理部门工作进展
}

export const commentDropdownBox = () => {
  return defHttp.get({
    url: Api.dropdownBox,
  });
};

export const getappealVolume = (params) => {
  return defHttp.post({
    url: Api.data,
    params,
  });
};
export const getappealType = (params) => {
  return defHttp.post({
    url: Api.type,
    params,
  });
};

//咨询数据分析 tab切换的
export const getconsultingDataAnalysis = (params) => {
  return defHttp.post({
    url: Api.zxdata,
    params,
  });
};
//咨询数据分析 tab切换的 table分页
export const geteventTypeAnalysisPage = (params) => {
  return defHttp.post({
    url: Api.zxdataTable,
    params,
  });
};

// 满意度统计分析
export const getsatisfactionAnalysis = (params) => {
  return defHttp.post({
    url: Api.myTJFX,
    params,
  });
};

// 各事项处理评价满意排名
export const getsatisfactionScoreAnalysis = (params) => {
  return defHttp.post({
    url: Api.satisfactionScoreAnalysis,
    params,
  });
};
// 各事项处理评价满意排名 导出
export const satisfactionScoreAnalysisExport = (params, fileName) => {
  return defHttp
    .post(
      {
        url: Api.satisfactionScoreAnalysisExport,
        responseType: 'blob',
        params,
      },
      { isTransformResponse: false }
    )
    .then((data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    });
};

//满意度整体分析
export const getsatisfactionOverallAnalysis = (params) => {
  return defHttp.post({
    url: Api.satisfactionOverallAnalysis,
    params,
  });
};

//不满意原因分析
export const getdissatisfactionAnalysis = (params) => {
  return defHttp.post({
    url: Api.dissatisfactionAnalysis,
    params,
  });
};

//自动分析 -- 问卷分页列表查询
export const getquestionnairelist = (params) => {
  return defHttp.get({
    url: Api.questionnairelist,
    params,
  });
};
//自动分析 --详情
export const getstatisticsautoSpecial = (param) => {
  return defHttp.get({
    url: Api.statisticsautoSpecial + '/' + param,
  });
};

export const getstatisticsEventRanking = (params) => {
  return defHttp.post({
    url: Api.statisticsEventRanking,
    params,
  });
};

//工作任务统计分析-总工作量以及进度情况
export const statisticsTaskTotalProcess = (params) => {
  return defHttp.get({
    url: Api.statisticsTaskTotalProcess,
    params,
  });
};
//工作任务统计分析-责任部门工作进展
export const statisticsTaskDepartment = (params) => {
  return defHttp.get({
    url: Api.statisticsTaskDepartment,
    params,
  });
};

//阈值
export const questionnaireThresholdValue = (id, value) => {
  return defHttp.put({
    url: Api.questionnaireThresholdValue + id,
    params: value,
  });
};
// 总工单量以及进度情况
export const workOrdersAndProgress = (params) => {
  return defHttp.post({
    url: Api.workOrdersAndProgress,
    params,
  });
};
// 处理部门工作进展
export const departmentalProgress = (params) => {
  return defHttp.post({
    url: Api.departmentalProgress,
    params,
  });
};

//事项满意度评价排名导出
export const statisticsEventRankingExport = (params, fileName) => {
  return defHttp
    .post(
      {
        url: Api.statisticsEventRankingExport,
        responseType: 'blob',
        params,
      },
      { isTransformResponse: false }
    )
    .then((data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    });
};
//咨询-投诉统计分析导出
export const statisticsConsultingDataAnalysisExport = (params, fileName) => {
  return defHttp
    .post(
      {
        url: Api.statisticsConsultingDataAnalysisExport,
        responseType: 'blob',
        params,
      },
      { isTransformResponse: false }
    )
    .then((data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    });
};

//不满意原因分析导出
export const statisticsDissatisfactionAnalysisExport = (params, fileName) => {
  return defHttp
    .post(
      {
        url: Api.statisticsDissatisfactionAnalysisExport,
        responseType: 'blob',
        params,
      },
      { isTransformResponse: false }
    )
    .then((data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    });
};

//工作任务分析-责任部门工作进展下载
export const statisticsTaskDepartmentDownload = (params, fileName) => {
  return defHttp
    .get(
      {
        url: Api.statisticsTaskDepartmentDownload,
        responseType: 'blob',
        params,
      },
      { isTransformResponse: false }
    )
    .then((data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    });
};
//工作任务分析-总工作量以及进度情况下载
export const statisticsTaskTotalProcessDownload = (params, fileName) => {
  return defHttp
    .get(
      {
        url: Api.statisticsTaskTotalProcessDownload,
        responseType: 'blob',
        params,
      },
      { isTransformResponse: false }
    )
    .then((data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    });
};

//自动分析导出
export const statisticsAutoSpecialDownload = (id, fileName) => {
  return defHttp
    .get(
      {
        url: Api.statisticsAutoSpecialDownload + id + '/download',
        responseType: 'blob',
      },
      { isTransformResponse: false }
    )
    .then((data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    });
};

//导出总工单量以及进度情况
export const workOrdersAndProgressExportXls = (params, fileName) => {
  return defHttp
    .post(
      {
        url: Api.workOrdersAndProgressExportXls,
        responseType: 'blob',
        params,
      },
      { isTransformResponse: false }
    )
    .then((data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    });
};
//导出处理部门工作进展
export const departmentalProgressExportXls = (params, fileName) => {
  return defHttp
    .post(
      {
        url: Api.departmentalProgressExportXls,
        responseType: 'blob',
        params,
      },
      { isTransformResponse: false }
    )
    .then((data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    });
};
