import { defHttp } from '/@/utils/http/axios';
import {
  PetitionList,
  AddPetitionList,
  AssignModal,
  DeleteList,
  WithdrawList,
  ProcessListData,
  HandledSubmitData,
  UpdatersList,
  DownloadData,
  HandledComplete,
  VerificationData,
} from './model/petition';

import { ErrorMessageMode } from '/#/axios';
enum Api {
  GetCommerceList = '/xixian/appealGSY/list', // 工商列表
  getCommerNumber = '/xixian/appealGSY/queryById', // 查看工商详细
  GetDownTemp = '/xixian/appealGSY/exportXls',
  GetPetitionList = '/xixian/appealXHB/list', //信访投诉表格数据
  AddPetitionListUrl = '/xixian/letters/add', //信访投诉新建添加提交表格数据
  GetAssignModal = '/xixian/appeal/edit', //指派提交
  DeleteColList = '/xixian/appealGSY/delete', //GSY删除列表数据
  DeleteColListH = '/xixian/appealXHB/delete', //XHB删除列表数据
  WithdrawListData = '/xixian/appeal/edits', //撤回指派数据
  ProcessList = '/xixian/appealProcess/queryPageList', //详情的处理过程
  HandledSubmit = '/xixian/appealProcess/add', //接收提交
  Updaters = '/xixian/letters/updaters', //信访投诉编辑提交表格数据
  ItemQueryList = '/xixian/item/QueryList', //事项名称下拉数据
  appealUrge = '/xixian/appeal/urge', //催办
  getUrgeNumber = '/xixian/appeal/getUrgeNumber', // 查看延期状态
  appealReply = '/xixian/appeal/reply', //回复
  appealDelay = '/xixian/appeal/delay', // 延期
  DownloadDataUrl = '/xixian/appealGSY/importExcel', //商业导入
  DownloadG = '/xixian/appealXHB/importExcel', //好办导入
  HandledCompleteUrl = '/xixian/appeal/Processing',
  VerificationUrl = '/xixian/appealProcess/Verification',
  downloadTemplate = '/xixian/appealGSY/exportXls', // 商业下载模板
  downTemplate = '/xixian/appealXHB/exportXls', // 好办下载模板
}
// 商业导入
export function uploadExcel(params) {
  console.log('params: ', params);
  return defHttp.post({
    url: Api.DownloadDataUrl,
    params,
    data:params,
    headers:{ 'Content-Type':'multipart/form-data'}
  })
}

// 好办导入
export function uploadExcelH(params) {
  console.log('params: ', params);
  return defHttp.post({
    url: Api.DownloadG,
    params,
    data:params,
    headers:{ 'Content-Type':'multipart/form-data'}
  })
}

/**
 * 好办下载模板
 * @param params
 * @param fileName 文件名称
 * @returns
 */
export const downTemplate = (fileName) => {
  return defHttp
    .post(
      {
        url: Api.downTemplate,
      },
      { isTransformResponse: false }
    )
};

/**
 * 商业下载模板
 * @param params
 * @param fileName 文件名称
 * @returns
 */
export const downloadTemplate = (fileName) => {
  return defHttp
    .post(
      {
        url: Api.downloadTemplate,
      },
      { isTransformResponse: false }
    )
};

export function getPetitionListApi(params: PetitionList, mode: ErrorMessageMode = 'message') {
  const data = JSON.parse(JSON.stringify(params));
  delete data.pageNo;
  delete data.pageSize;
  return defHttp.get(
    {
      url: Api.GetPetitionList + '?pageNo=' + params.pageNo + '&pageSize=' + params.pageSize ,
      params: data,
    },
    {
      errorMessageMode: mode,
    }
  );
}
// 工商列表
export function GetCommerceList(params: any, mode: ErrorMessageMode = 'message') {
  const data = JSON.parse(JSON.stringify(params));
  delete data.pageNo;
  delete data.pageSize;
  return defHttp.get(
    {
      url: Api.GetCommerceList + '?pageNo=' + params.pageNo + '&pageSize=' + params.pageSize ,
      params: data,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function addPetitionListApi(params: AddPetitionList, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.AddPetitionListUrl,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function GetAssignApi(params: AssignModal, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.GetAssignModal,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function DeleteListApi(params: DeleteList, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: Api.DeleteColList + '?id=' + params.id,
    },
    {
      errorMessageMode: mode,
    }
  );
}
export function DeleteListHApi(params: DeleteList, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: Api.DeleteColListH + '?id=' + params.id,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function WithdrawListApi(params: WithdrawList, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.WithdrawListData,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function GetProcessListApi(params: ProcessListData, mode: ErrorMessageMode = 'message') {
  return defHttp.get({ 
      url: Api.ProcessList + '?id=' + params.ids,
      params 
    },
    { errorMessageMode: mode });
}

// 催办
export function appealUrge(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.appealUrge,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function getUrgeNumber(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post({ url: Api.getUrgeNumber, params }, { errorMessageMode: mode });
}

// 工商详细
export function getCommerNumber(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.get({ url: Api.getCommerNumber, params }, { errorMessageMode: mode });
}
// 工商下载
export function GetDownTemp(params: any) {
  return defHttp.post(
    {
      url: Api.GetDownTemp,
      responseType: 'blob',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

// 催办
export function appealReply(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.appealReply,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}
/** 延期 */
export function appealDelay(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.appealDelay,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function HandledSubmitApi(params: HandledSubmitData, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.HandledSubmit,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function UpdatersListApi(params: UpdatersList, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.Updaters,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function GetItemQueryListApi(mode: ErrorMessageMode = 'message') {
  return defHttp.get({ url: Api.ItemQueryList }, { errorMessageMode: mode });
}
// 商业导出
export function GetDownloadApi(params: DownloadData) {
  return defHttp.post(
    {
      url: Api.DownloadDataUrl,
      responseType: 'blob',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}
// 好办导出
export function GetDownloadG(params: DownloadData) {
  return defHttp.post(
    {
      url: Api.DownloadG,
      responseType: 'blob',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}
export function HandledCompleteApi(params: HandledComplete, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.HandledCompleteUrl,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function VerificationApi(params: VerificationData, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.VerificationUrl,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}
