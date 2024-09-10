export interface RegionNew {
  order: null;
  text: string;
  title: string;
  value: string;
}

export interface PolicyFilter {
  admLevel: string | undefined;
  indicatorName: string | undefined;
  year: string | undefined;
}

export interface PolicyResultItem {
  publishTime: string;
  indicatorName: string;
  publishOffice: string;
  admRegionCode: string;
  publishWord: string;
  dataType: string;
  updateTime: string;
  title: string;
  linkFile: string;
  indicatorId: string;
  createBy: string;
  openFlag: string;
  createTime: string;
  updateBy: string;
  topic: null;
  admLevel: string;
  id: string;
  policyLink: string;
  admRegionName: null;
  status: number;
}

export interface PolicyDetail {
  admLevel: string;
  admRegionCode: string;
  admRegionName: string;
  createBy: string;
  createTime: string;
  dataType: string;
  id: string;
  indicatorId: string;
  indicatorName: string;
  linkFile: string;
  openFlag: string;
  policyLink: string;
  publishOffice: string;
  publishTime: string;
  publishWord: string;
  status: number;
  title: string;
  topic: string;
  updateBy: string;
  updateTime: string;
}
