import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '任务名称',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '发起部门',
    width: 150,
    dataIndex: 'createDepart',
  },
  {
    title: '发起时间',
    width: 150,
    dataIndex: 'activateTime',
  },
  {
    title: '校核状态',
    width: 150,
    dataIndex: 'checkStatusText',
  },
  {
    title: '是否校核',
    width: 150,
    dataIndex: 'checkFlag',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'projectName',
    component: 'Input',
    label: '任务名称',
    componentProps: {
      placeholder: '请输入',
    },
  },
  {
    field: 'createTime',
    component: 'RangePicker',
    label: '发起时间',
    componentProps: {
      valueType: 'Date',
      placeholder: ['开始时间', '结束时间'],
    },
  },
  {
    field: 'checkStatus',
    label: '校核状态',
    component: 'JDictSelectTag',
    componentProps: {
      options: [
        {
          value: '1',
          label: '开启 ',
        },

        {
          value: '0',
          label: '关闭 ',
        },
      ],
    },
    // componentProps: () => {
    //   return {
    //     dictCode: 'monitor_type',
    //   };
    // },
  },
  {
    label: '是否已校核',
    field: 'checkFlag',
    component: 'JDictSelectTag',
    componentProps: {
      options: [
        {
          value: '1',
          label: '已校核 ',
        },

        {
          value: '0',
          label: '未校核 ',
        },
      ],
    },
    // componentProps: () => {
    //   return {
    //     dictCode: 'monitor_type',
    //   };
    // },
  },
];
