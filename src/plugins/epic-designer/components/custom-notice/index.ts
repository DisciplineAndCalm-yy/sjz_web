import { type ComponentConfigModel } from '@coderlt/form-designer';
import { ComponentTypeEnum } from '../../enums/component';
export const customNoticeConfig = {
  component: () => import('./customNotice.vue'),
  defaultSchema: {
    icon: 'epic-icon-zhage',
    childImmovable: true,
    rules: [{ type: 'string', trigger: ['change'], required: false, message: '' }],
  },
  config: {
    attribute: [
      {
        label: '垂直对齐方式',
        type: 'select',
        componentProps: {
          style: { width: '100%' },
          options: [
            {
              label: 'top',
              value: 'top',
            },
            {
              label: 'middle',
              value: 'middle',
            },
            {
              label: 'bottom',
              value: 'bottom',
            },
          ],
          placeholder: '请选择',
        },
        field: 'componentProps.align',
      },
      {
        label: '水平排列方式',
        type: 'select',
        componentProps: {
          style: { width: '100%' },
          options: [
            {
              label: 'start',
              value: 'start',
            },
            {
              label: 'end',
              value: 'end',
            },
            {
              label: 'center',
              value: 'center',
            },
            {
              label: 'space-around',
              value: 'space-around',
            },
            {
              label: 'space-around',
              value: 'space-around',
            },
          ],
          placeholder: '请选择',
        },
        field: 'componentProps.justify',
      },
      {
        label: '栅格间距',
        type: 'input',
        field: 'componentProps.gutter',
        componentProps: {
          placeholder: '请输入',
        },
      },
      {
        label: '列编辑',
        type: 'EColEditor',
        field: 'children',
      },
      {
        label: '隐藏',
        type: 'switch',
        field: 'componentProps.hidden',
      },
    ],
  },
} as ComponentConfigModel;
