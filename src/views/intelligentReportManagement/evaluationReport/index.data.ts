import { BasicColumn, FormSchema } from '/@/components/Table';

// 树列表column
export const treeColumns: BasicColumn[] = [
  {
    dataIndex: 'dirName',
    width: 200,
  }
]
export const tableColumns: BasicColumn[] = [
  {
    title: '报告主题名称',
    dataIndex: 'storageName',
    width: 200,
  },
  {
    title: '创建部门',
    dataIndex: 'departName',
    width: 200,
  },
  {
    title: '更新日期',
    dataIndex: 'updateTime',
    width: 200,
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    label: '报告主题名称',
    field: 'storageName',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    label: '更新日期',
    field: 'updateTime',
    component: 'RangePicker',
    componentProps: {
      valueType: 'Date',
    },
    colProps: { span: 8 },
  },
];