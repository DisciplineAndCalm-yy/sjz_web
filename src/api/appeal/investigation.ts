import { defHttp } from '/@/utils/http/axios';
import { InvestigationList, AssignModal, DeleteList, WithdrawList, ProcessListData, HandledSubmitData, DownloadData, HandledComplete, VerificationData } from './model/investigation';

import { ErrorMessageMode } from '/#/axios';
enum Api {
  GetInvestigationList = '/xixian/appeal/list', //调查问卷表格数据
  GetAssignModal = '/xixian/appeal/edit', //指派提交
  ReturnAppeal = '/xixian/appealProcess/returnAppeal', // 退回
  GetAgainAssignModal = '/xixian/appeal/editTwo', //二次指派提交
  GetAgainAssignSubmit = '/xixian/appeal/assign', // 待接收状态提交
  DeleteColList = '/xixian/appeal/delete', //删除当前行
  WithdrawListData = '/xixian/appeal/edits', //撤回指派
  ProcessList = '/xixian/appealProcess/queryPageList', //详情的处理过程
  HandledSubmit = '/xixian/appealProcess/add', //接收提交
  appealIdByList = '/xixian/appeal/getAppealIdByList', //获取指派子级数据
  appealUrge = '/xixian/appeal/urge', //催办
  getUrgeNumber = '/xixian/appeal/getUrgeNumber', // 查看延期状态
  appealReply = '/xixian/appeal/reply', //回复
  appealDelay = '/xixian/appeal/delay', // 延期
  DownloadDataUrl = '/xixian/appeal/exporter',
  HandledCompleteUrl = '/xixian/appeal/Processing',
  VerificationUrl = '/xixian/appealProcess/Verification',
  consultingService = '/xixian/consultingService/selectOption', // 评价
  ConfirmUrl = '/xixian/appealProcess/approval', // 确认
}

export function getInvestigationListApi(params: InvestigationList, mode: ErrorMessageMode = 'message') {
  const data = JSON.parse(JSON.stringify(params));
  delete data.pageNo;
  delete data.pageSize;
  return defHttp.post(
    {
      url: Api.GetInvestigationList + '?pageNo=' + params.pageNo + '&pageSize=' + params.pageSize,
      params: data,
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

/** 退回 */
export function ReturnAppeal(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.ReturnAppeal,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

/** 二次指派 */
export function GetAgainAssignApi(params: AssignModal, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.GetAgainAssignModal,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}
/** 待接收状态提交 */
export function GetAgainAssignSubmit(params: AssignModal, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.GetAgainAssignSubmit,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}
export function DeleteListApi(params: DeleteList, mode: ErrorMessageMode = 'modal') {
  return defHttp.delete(
    {
      url: Api.DeleteColList + '?id=' + params.id,
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
  return defHttp.get({ url: Api.ProcessList, params }, { errorMessageMode: mode });
}

export function getUrgeNumber(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post({ url: Api.getUrgeNumber, params }, { errorMessageMode: mode });
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
export function ConfirmApi(params: VerificationData, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.ConfirmUrl,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}
export function appealIdByList(id: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.appealIdByList,
      params: { id },
    },
    {
      errorMessageMode: mode,
    }
  );
}

export function consultingService(params, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: Api.consultingService + '?userId=' + params.userId + '&appealId=' + params.appealId,
    },
    {
      errorMessageMode: mode,
    }
  );
}
