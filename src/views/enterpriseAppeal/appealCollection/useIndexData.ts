import { reactive, toRefs } from 'vue';

export const useIndexData = (): Record<string, any> => {
  const state = reactive<Record<string, any>>({
    columns: [
      {
        title: '问题描述',
        dataIndex: 'description',
        width: 120,
      },
      {
        title: '收集日期',
        width: 150,
        dataIndex: 'createTime',
      },
      {
        title: '状态',
        width: 150,
        dataIndex: 'status',
      },
    ],
    searchFormSchema: [
      {
        field: 'description',
        component: 'Input',
        label: '问题描述',
        componentProps: {
          placeholder: '请输入',
        },
      },
      {
        label: '状态',
        field: 'status',
        component: 'Select',
        componentProps: () => {
          return {
            placeholder: '请选择',
            options: [
              {
                label: '进行中',
                value: 0,
              },
              {
                label: '已完成',
                value: 1,
              },
            ],
          };
        },
      },
    ],
  });

  return {
    ...toRefs(state),
  };
};
