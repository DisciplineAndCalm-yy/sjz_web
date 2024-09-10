import { defHttp } from '/@/utils/http/axios';
enum Api {
  getAppealAnalist = '/xixian/statistics/emphasesStatistics',
  appealTypeStatistics = '/xixian/statistics/appealTypeStatistics',
  appealTypeStatisticsExport = '/xixian/statistics/appealTypeStatisticsExport',
  emphasesStatisticsExport = '/xixian/statistics/emphasesStatisticsExport',
}

export const getAppealAnalist = (params) => {
  return defHttp.post({
    url: Api.getAppealAnalist,
    params,
  });
};

export const getsatisfactionScoreAnalysis = (params) => {
  return defHttp.post({
    url: Api.appealTypeStatistics,
    params,
  });
};

export const satisfactionScoreAnalysisExport = (params, fileName) => {
  return defHttp
    .post(
      {
        url: Api.appealTypeStatisticsExport,
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

export const emphasesStatisticsExport = (params, fileName) => {
  return defHttp
    .post(
      {
        url: Api.emphasesStatisticsExport,
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
