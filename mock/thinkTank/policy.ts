import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess, baseUrl } from '../_util';

const generatePolicyList = (pageNo) => {
  const res = {
    records: [],
    total: 2035,
    size: 10,
    current: 1,
    orders: [],
    optimizeCountSql: true,
    hitCount: false,
    countId: null,
    maxLimit: null,
    searchCount: true,
    pages: pageNo,
  };

  for (let i = 0; i < 10; i++) {
    const data = {
      publishTime: '2023-09-04 14:12:51',
      indicatorName: '开办企业',
      publishOffice: '国务院办公厅',
      admRegionCode: '',
      publishWord: '国办发〔2023〕29号',
      dataType: 'sync',
      updateTime: '2023-09-28 14:14:10',
      title: `关于依托全国一体化政务服${(pageNo - 1) * 10 + i + 1}`,
      linkFile:
        'http://59.227.109.252:9002/uat-yst-public/policy_data/2.关于依托全国一体化政务服务平台建立政务服务效能提升常态化工作机制的意见_1695881592744.pdf',
      indicatorId: '9e86969859e4a990c32c9bac8ad13d82',
      createBy: 'admin',
      openFlag: '1',
      createTime: '2023-09-28 14:14:10',
      updateBy: 'admin',
      topic: null,
      admLevel: '1',
      id: 'fb895610c97dd82576b1f3bacfc1bba3',
      policyLink: 'https://www.gov.cn/zhengce/zhengceku/202309/content_6902009.htm',
      admRegionName: null,
      status: 2,
    };

    res.records.push(data);
  }

  return res;
};

const hotRegionNew = [
  {
    value: '1101',
    text: '北京市',
    order: null,
    title: '北京市',
  },
  {
    value: '3101',
    text: '上海市',
    order: null,
    title: '上海市',
  },
  {
    value: '4403',
    text: '深圳市',
    order: null,
    title: '深圳市',
  },
  {
    value: '4401',
    text: '广州市',
    order: null,
    title: '广州市',
  },
  {
    value: '5001',
    text: '重庆市',
    order: null,
    title: '重庆市',
  },
  {
    value: '3301',
    text: '杭州市',
    order: null,
    title: '杭州市',
  },
];

export default [
  {
    url: `${baseUrl}/sys/dict/getDictItems/hot_region_new`,
    timeout: 200,
    method: 'get',
    response: () => {
      return resultSuccess(hotRegionNew);
    },
  },
  // 行政级别
  {
    url: `${baseUrl}/sys/dict/getDictItems/adm_level`,
    timeout: 200,
    method: 'get',
    response: () => {
      const data = [
        {
          value: '1',
          text: '国家级',
          order: null,
          title: '国家级',
        },
        {
          value: '2',
          text: '省级',
          order: null,
          title: '省级',
        },
        {
          value: '3',
          text: '市级',
          order: null,
          title: '市级',
        },
        {
          value: '4',
          text: '区县级',
          order: null,
          title: '区县级',
        },
        {
          value: '5',
          text: '暂未分类',
          order: null,
          title: '暂未分类',
        },
        {
          value: '6',
          text: '本地重点',
          order: null,
          title: '本地重点',
        },
        {
          value: '7',
          text: '河南省',
          order: null,
          title: '河南省',
        },
      ];
      return resultSuccess(data);
    },
  },
  // 发文时间
  {
    url: `${baseUrl}/sys/dict/getDictItems/publish_time`,
    timeout: 200,
    method: 'get',
    response: () => {
      const data = [
        {
          value: '1',
          text: '2020以前',
          order: null,
          title: '2020以前',
        },
        {
          value: '2',
          text: '2020至今',
          order: null,
          title: '2020至今',
        },
      ];
      return resultSuccess(data);
    },
  },
  // 更多发文时间
  {
    url: `${baseUrl}/policy/year`,
    timeout: 200,
    method: 'get',
    response: () => {
      const data = [
        '2023',
        '2022',
        '2021',
        '2020',
        '2019',
        '2018',
        '2017',
        '2016',
        '2015',
        '2014',
        '2013',
        '2012',
        '2011',
        '2010',
        '2009',
        '2008',
        '2007',
        '2005',
        '2004',
        '2001',
        '1992',
      ];
      return resultSuccess(data);
    },
  },
  // 指标选择
  {
    url: `${baseUrl}/sys/dict/getDictItems/policy_indicator`,
    timeout: 200,
    method: 'get',
    response: () => {
      const data = [
        {
          value: '1',
          text: '开办企业',
          order: null,
          title: '开办企业',
        },
        {
          value: '2',
          text: '办理建筑许可',
          order: null,
          title: '办理建筑许可',
        },
        {
          value: '3',
          text: '获得电力',
          order: null,
          title: '获得电力',
        },
        {
          value: '4',
          text: '获得用水用气',
          order: null,
          title: '获得用水用气',
        },
        {
          value: '5',
          text: '登记财产',
          order: null,
          title: '登记财产',
        },
        {
          value: '6',
          text: '纳税',
          order: null,
          title: '纳税',
        },
        {
          value: '7',
          text: '跨境贸易',
          order: null,
          title: '跨境贸易',
        },
        {
          value: '8',
          text: '办理破产',
          order: null,
          title: '办理破产',
        },
        {
          value: '9',
          text: '获得信贷',
          order: null,
          title: '获得信贷',
        },
        {
          value: '10',
          text: '执行合同',
          order: null,
          title: '执行合同',
        },
        {
          value: '11',
          text: '劳动力市场监管',
          order: null,
          title: '劳动力市场监管',
        },
        {
          value: '12',
          text: '政府采购',
          order: null,
          title: '政府采购',
        },
        {
          value: '13',
          text: '招标投标',
          order: null,
          title: '招标投标',
        },
        {
          value: '14',
          text: '政务服务',
          order: null,
          title: '政务服务',
        },
        {
          value: '15',
          text: '知识产权创造保护运用',
          order: null,
          title: '知识产权创造保护运用',
        },
        {
          value: '16',
          text: '市场监管',
          order: null,
          title: '市场监管',
        },
        {
          value: '17',
          text: '包容普惠创新',
          order: null,
          title: '包容普惠创新',
        },
        {
          value: '18',
          text: '保护中小投资者',
          order: null,
          title: '保护中小投资者',
        },
        {
          value: '19',
          text: '综合',
          order: null,
          title: '综合',
        },
        {
          value: '20',
          text: '企业权益保护',
          order: null,
          title: '企业权益保护',
        },
        {
          value: '21',
          text: '信用环境建设',
          order: null,
          title: '信用环境建设',
        },
        {
          value: '22',
          text: '项目保障',
          order: null,
          title: '项目保障',
        },
      ];
      return resultSuccess(data);
    },
  },
  // 指标列表
  {
    url: `${baseUrl}/policy/list`,
    timeout: 200,
    method: 'get',
    response: (params) => {
      const { pageNo } = params.query;

      const res = generatePolicyList(pageNo);

      return resultSuccess(res);
    },
  },
  // 指标详情
  {
    url: `${baseUrl}/policy/queryById`,
    timeout: 200,
    method: 'get',
    response: () => {
      const data = {
        admLevel: '2',
        admRegionCode: '50',
        admRegionName: '重庆市',
        createBy: 'admin',
        createTime: '2023-12-05 15:19:48',
        dataType: 'sync',
        id: '2c6d129453a0919aa1838844904adec1',
        indicatorId: '5c1ab932a02b413a35c5923feaa51223',
        indicatorName: '包容普惠创新',
        linkFile:
          'http://59.227.109.252:9002/uat-yst-public/policy_data/01.%E6%B8%9D%E9%BB%94%E6%B7%B1%E5%8C%96%E5%90%88%E4%BD%9C%E6%8E%A8%E5%8A%A8%E4%B9%8C%E6%B1%9F%E8%88%AA%E8%BF%90%E9%AB%98%E8%B4%A8%E9%87%8F%E5%8F%91%E5%B1%95%E5%BB%BA%E8%AE%BE%E5%AE%9E%E6%96%BD%E6%96%B9%E6%A1%88%EF%BC%882023%E2%80%942027%EF%BC%89_1701760786376.pdf',
        openFlag: '1',
        policyLink: 'http://www.cq.gov.cn/zwgk/zfxxgkml/zcjd_120614/mtsj/202312/t20231204_12646716.html',
        publishOffice: '重庆市政府办公厅',
        publishTime: '2023-11-30 15:19:30',
        publishWord: '渝府办发〔2023〕81号',
        status: 2,
        title: '渝黔深化合作推动乌江航运高质量发展建设实施方案（2023—2027）',
        topic: null,
        updateBy: 'admin',
        updateTime: '2023-12-05 15:19:48',
      };

      return resultSuccess(data);
    },
  },
] as MockMethod[];
