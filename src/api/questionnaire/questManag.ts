import { defHttp } from '/@/utils/http/axios';
import { InvestigationList, AddQuestionListData, PreviewList, ReleasePublishData, EditQuestionListData, DeteleListData, EndTerminateData, RespondentListData, SeeLisTData } from './model/questManag';
import { ErrorMessageMode } from '/#/axios';
enum Api {
  GetInvestigationList = '/xixian/questionnaire/list', //问卷管理表格数据
  AddQuestionList = '/xixian/questionnaire', //问卷管理新建提交表格数据
  ReleasePublish = '/xixian/questionnaire/publish', //问卷管理发布问卷
  EndTerminate = '/xixian/questionnaire/terminate', //问卷管理结束发布问卷
  RespondentList = '/xixian/respondent/list', //查看答卷数据
  SeeList = '/xixian/respondent', //答卷数据
}

export function GetInvestigationListApi(params: InvestigationList, mode: ErrorMessageMode = 'message') {
  return defHttp.get({ url: Api.GetInvestigationList, params }, { errorMessageMode: mode });
}

export function addQuestionListApi(params: AddQuestionListData, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.AddQuestionList,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

// 预览问卷请求
export function GetPreviewListApi(params: PreviewList, mode: ErrorMessageMode = 'modal') {
  return defHttp.get({ url: Api.AddQuestionList + '/' + params.id }, { errorMessageMode: mode });
}

export function ReleasePublishApi(params: ReleasePublishData, mode: ErrorMessageMode = 'modal') {
  return defHttp.post({ url: Api.ReleasePublish + '/' + params.id, params: { type: params.type } }, { errorMessageMode: mode });
}

// 问卷管理编辑调查表列表数据提交
export function EditQuestionListApi(params: EditQuestionListData, mode: ErrorMessageMode = 'modal') {
  return defHttp.put({ url: Api.AddQuestionList + '/' + params.id, params: params.questionnaire }, { errorMessageMode: mode });
}

// 删除问卷
export function DeteleListApi(params: DeteleListData, mode: ErrorMessageMode = 'modal') {
  return defHttp.delete({ url: Api.AddQuestionList + '/' + params.id }, { errorMessageMode: mode });
}

export function EndTerminateApi(params: EndTerminateData, mode: ErrorMessageMode = 'modal') {
  return defHttp.post({ url: Api.EndTerminate + '/' + params.id, params: { type: params.type } }, { errorMessageMode: mode });
}

export function RespondentListApi(params: RespondentListData, mode: ErrorMessageMode = 'message') {
  return defHttp.get({ url: Api.RespondentList, params }, { errorMessageMode: mode });
}

export function SeeListDataApi(params: SeeLisTData, mode: ErrorMessageMode = 'message') {
  return defHttp.get({ url: Api.SeeList + '/' + params.id }, { errorMessageMode: mode });
}
