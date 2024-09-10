import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '指标项说明',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '单位',
    width: 50,
    dataIndex: 'createDepart',
  },
  {
    title: '指标项类型',
    width: 150,
    dataIndex: 'activateTime',
  },
  {
    title: '计分方法',
    width: 100,
    dataIndex: 'checkStatusText',
  },
  {
    title: '前沿对标值',
    width: 80,
    dataIndex: 'checkFlag',
  },
  {
    title: '报送部门',
    width: 80,
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
