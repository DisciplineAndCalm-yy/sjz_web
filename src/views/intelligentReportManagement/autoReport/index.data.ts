import { BasicColumn, FormSchema } from '/@/components/Table';

export const searchFormSchema: FormSchema[] = [
  {
    label: '报告主题名称',
    field: 'username',
    //组件 支持组件详见 components/Form/src/types/index.ts 中的 ComponentType
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '更新日期',
    field: 'joinTime',
    component: 'RangePicker',
    colProps: { span: 6 },
    componentProps: {
      valueType: 'Date',
    },
  },
];

export const indicatorColumns: BasicColumn[] = [
  {
    title: '报表主题名称',
    dataIndex: 'reportName',
  },
  {
    title: '生成日期',
    width: 220,
    align: 'center',
    dataIndex: 'createTime',
  },
];

// 详情配置项
export enum PerformanceTypeEnum {
  QUOTA = '1', // 指标
  AREA = '2', // 地、县
  LOSE_POINT = '3', // 失分
}
