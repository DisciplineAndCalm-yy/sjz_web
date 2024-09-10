import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  Getdepartment = '/sys/sysDepart/queryDepartByOrgType',
}

export function getDepartmentList(mode: ErrorMessageMode = 'message') {
  return defHttp.get({ url: Api.Getdepartment }, { errorMessageMode: mode });
}
