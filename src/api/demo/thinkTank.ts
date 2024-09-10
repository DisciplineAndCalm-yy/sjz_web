import { defHttp } from '/@/utils/http/axios';
import { PolicyDetail, RegionNew } from '/@/views/thinkTank/Policy';

enum PolicyApi {
  ACCOUNT_INFO = '/mock/sys/dict/getDictItems/hot_region_new',
  AD_LEVEL = '/mock/sys/dict/getDictItems/adm_level',
  PUBLISH_TIME = '/mock/sys/dict/getDictItems/publish_time',
  MORE_YEAR = '/mock/policy/year',
  POLICY_INDICATOR = '/mock/sys/dict/getDictItems/policy_indicator',
  POLICY_LIST = '/mock/policy/list',
  POLICY_DETAIL = '/mock/policy/queryById',
}

export const getRegionNewApi = () => defHttp.get<RegionNew[]>({ url: PolicyApi.ACCOUNT_INFO });
export const getAdLevelApi = () => defHttp.get<RegionNew[]>({ url: PolicyApi.AD_LEVEL });
export const getPublishTimeApi = () => defHttp.get<RegionNew[]>({ url: PolicyApi.PUBLISH_TIME });
export const getMoreYearApi = () => defHttp.get<number[]>({ url: PolicyApi.MORE_YEAR });
export const getPolicyIndicatorApi = () => defHttp.get<RegionNew[]>({ url: PolicyApi.POLICY_INDICATOR });
export const getPolicyListApi = (params) => defHttp.get({ url: PolicyApi.POLICY_LIST, params });
export const getPolicyDetailApi = (params) => defHttp.get<PolicyDetail>({ url: PolicyApi.POLICY_DETAIL, params });
