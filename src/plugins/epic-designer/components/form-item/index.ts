import { type ComponentConfigModel } from '@coderlt/form-designer';

export default {
  component: () => import('./formItem.vue'),
  defaultSchema: {
    label: '表单项',
    type: 'form-item',
    icon: 'epic-icon-qiapian',
  },
  config: {},
} as ComponentConfigModel;
