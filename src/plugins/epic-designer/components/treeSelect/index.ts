import { type ComponentConfigModel } from '@coderlt/form-designer';

export const treeSelectConfig: ComponentConfigModel = {
  // component: () => import('./treeSelect.vue'),
  component: () => import('ant-design-vue/es/tree-select'),
  defaultSchema: {
    icon: 'epic-icon-xiala',
    input: true,
    componentProps: {
      placeholder: '请选择123456',
      treeData: [
        {
          label: 'parent 1',
          value: 'parent 1',
          children: [
            {
              label: 'parent 1-0',
              value: 'parent 1-0',
              children: [
                {
                  label: 'my leaf',
                  value: 'leaf1',
                },
                {
                  label: 'your leaf',
                  value: 'leaf2',
                },
              ],
            },
            {
              label: 'parent 1-1',
              value: 'parent 1-1',
            },
          ],
        },
      ],
    },
    rules: [{ type: 'string', trigger: ['change'], required: false, message: '' }],
  },
  config: {
    attribute: [
      {
        label: '字段名',
        type: 'input',
        field: 'field',
        disabled: true,
      },
      {
        label: '文字',
        type: 'input',
        field: 'label',
      },
      // {
      //   label: '占位内容',
      //   type: 'input',
      //   field: 'componentProps.placeholder',
      //   componentProps: {
      //     placeholder: '请输入',
      //   },
      // },
      // {
      //   label: '默认值',
      //   type: 'select',
      //   field: 'componentProps.defaultValue',
      // },
      {
        label: '尺寸',
        type: 'select',
        componentProps: {
          placeholder: '请选择',
          allowClear: true,
          options: [
            {
              label: 'large',
              value: 'large',
            },
            {
              label: 'middle',
              value: 'middle',
            },
            {
              label: 'small',
              value: 'small',
            },
          ],
        },
        field: 'componentProps.size',
      },
      // {
      //   label: '选项管理',
      //   type: 'EOptionsEditor',
      //   layout: 'vertical',
      //   field: 'componentProps.options',
      // },
      // {
      //   label: 'label包装到value中',
      //   type: 'switch',
      //   field: 'componentProps.labelInValue',
      // },
      // {
      //   label: '设置弹窗高度',
      //   type: 'number',
      //   field: 'componentProps.listHeight',
      // },
      // {
      //   label: '模式',
      //   type: 'select',
      //   componentProps: {
      //     options: [
      //       {
      //         label: 'multiple',
      //         value: 'multiple',
      //       },
      //       {
      //         label: 'tags',
      //         value: 'tags',
      //       },
      //     ],
      //     placeholder: '请选择',
      //     allowClear: true,
      //   },
      //   field: 'componentProps.mode',
      // },
      {
        label: '可清除',
        type: 'switch',
        field: 'componentProps.allowClear',
      },
      {
        label: '可多选',
        type: 'switch',
        field: 'componentProps.multiple',
      },
      // {
      //   label: '选中选项后清空搜索框',
      //   type: 'switch',
      //   field: 'componentProps.autoClearSearchValue',
      //   show: ({ values }) => values.componentProps.mode && values.componentProps.showSearch,
      // },
      // {
      //   label: '最大tag文本长度',
      //   type: 'number',
      //   field: 'componentProps.maxTagTextLength',
      //   show: ({ values }) => values.componentProps.mode,
      // },
      // {
      //   label: '最大tag显示数',
      //   type: 'number',
      //   field: 'componentProps.maxTagCount',
      //   show: ({ values }) => values.componentProps.mode,
      // },
      // {
      //   label: '弹出框位置',
      //   type: 'select',
      //   componentProps: {
      //     options: [
      //       {
      //         label: 'bottomLeft',
      //         value: 'bottomLeft',
      //       },
      //       {
      //         label: 'bottomRight',
      //         value: 'bottomRight',
      //       },
      //       {
      //         label: 'topLeft',
      //         value: 'topLeft',
      //       },
      //       {
      //         label: 'topRight',
      //         value: 'topRight',
      //       },
      //     ],
      //   },
      //   field: 'componentProps.placement',
      // },
      // {
      //   label: '可清空',
      //   type: 'switch',
      //   field: 'componentProps.allowClear',
      // },
      // {
      //   label: '禁用',
      //   type: 'switch',
      //   field: 'componentProps.disabled',
      // },
      // {
      //   label: '隐藏',
      //   type: 'switch',
      //   field: 'componentProps.hidden',
      // },
      // {
      //   label: '自定义选项管理',
      //   type: 'EOptionsSelectEditor',
      //   layout: 'vertical',
      //   field: 'componentProps.options',
      // },
      // {
      //   label: '表单校验',
      //   type: 'ERuleEditor',
      //   layout: 'vertical',
      //   field: 'rules',
      //   describe: '校验规则需要配合表单使用',
      // },
    ],
    event: [
      // {
      //   type: 'change',
      //   describe: '值修改',
      // },
      // {
      //   type: 'focus',
      //   describe: '获取焦点',
      // },
      // {
      //   type: 'blur',
      //   describe: '失去焦点',
      // },
    ],
    action: [
      // {
      //   type: 'focus',
      //   describe: '使 input 获取焦点',
      // },
      // {
      //   type: 'blur',
      //   describe: '使 input 失去焦点',
      // },
      // {
      //   type: 'select',
      //   describe: '选中 input 中的文字',
      // },
    ],
  },
  bindModel: 'value',
} as ComponentConfigModel;
