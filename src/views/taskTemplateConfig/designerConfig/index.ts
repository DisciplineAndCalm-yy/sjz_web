import { PluginManager } from '@coderlt/form-designer';
import { setupComponentManager, setupPublicMethods } from '/@/plugins/epic-designer';
import { scriptCode, superviseMethodsConfig } from './config';
import { superviseCustomFormConfig, superviseFormConfig } from './supervise';

export { DeadlineTypeEnum } from './component';

export const defaultSchema = {
  schemas: [
    {
      type: 'page',
      id: 'root',
      label: '页面',
      children: [
        {
          label: '表单',
          isUnique: true,
          id: 'union-form',
          type: 'form',
          icon: 'epic-icon-daibanshixiang',
          labelWidth: 100,
          name: 'default',
          hideCopy: true,
          hideDel: true,
          componentProps: {
            layout: 'horizontal',
            labelWidth: 100,
            labelLayout: 'fixe',
            labelCol: {
              span: 5,
            },
            wrapperCol: {
              span: 19,
            },
            hideRequiredMark: false,
            colon: true,
            labelAlign: 'right',
            size: 'middle',
          },
          children: [],
        },
      ],
      componentProps: {
        style: {
          padding: '16px',
        },
      },
    },
  ],
  script: scriptCode,
};

export const customSchema = {
  schemas: [
    {
      type: 'page',
      id: 'root',
      label: '页面',
      children: [
        {
          label: '表单',
          isUnique: true,
          id: 'union-form',
          type: 'form',
          icon: 'epic-icon-daibanshixiang',
          labelWidth: 100,
          name: 'default',
          hideCopy: true,
          hideDel: true,
          componentProps: {
            layout: 'horizontal',
            labelWidth: 100,
            labelLayout: 'fixe',
            labelCol: {
              span: 5,
            },
            wrapperCol: {
              span: 19,
            },
            hideRequiredMark: false,
            colon: true,
            labelAlign: 'right',
            size: 'middle',
          },
          children: [
            {
              icon: 'epic-icon-edit',
              input: true,
              componentProps: {
                placeholder: '请输入',
              },
              rules: [
                {
                  type: 'string',
                  trigger: ['change'],
                  required: true,
                  message: '标题不能为空',
                },
              ],
              label: '标题',
              id: 'title',
              isUnique: true,
              hideCopy: true,
              hideDel: true,
              forbid: true,
              isRequired: true,
              isShow: true,
              type: 'superviseCustomtitle',
              field: 'title',
            },
            {
              icon: 'epic-icon-xiala',
              input: true,
              componentProps: {
                placeholder: '请选择',
                options: [
                  {
                    label: '持续跟进',
                    value: '0',
                  },
                  {
                    label: '时间范围',
                    value: '1',
                  },
                ],
              },
              rules: [
                {
                  type: 'string',
                  trigger: ['change'],
                  required: true,
                  message: '完成时限不能为空',
                },
              ],
              label: '完成时限',
              isShow: true,
              id: 'deadlineType',
              on: {
                vnodeMounted: [
                  {
                    componentId: null,
                    methodName: 'getDeadlineTypeApi',
                    type: 'custom',
                  },
                ],
                change: [
                  {
                    componentId: null,
                    methodName: 'handleDeadlineTypeChange',
                    type: 'custom',
                  },
                ],
              },
              isUnique: true,
              hideCopy: true,
              hideDel: true,
              forbid: true,
              isRequired: true,
              type: 'superviseCustomdeadlineType',
              field: 'deadlineType',
            },
            {
              label: '要求完成时间',
              type: 'superviseCustomrequireEndTime',
              icon: 'epic-icon-calendar',
              field: 'requireEndTime',
              input: true,
              componentProps: {
                valueFormat: 'YYYY-MM-DD',
                type: 'date',
              },
              rules: [
                {
                  trigger: ['change'],
                  required: true,
                  type: 'string',
                  message: '要求完成时间不能为空',
                },
              ],
              id: 'requireEndTime',
              isUnique: true,
              hideCopy: true,
              hideDel: true,
              forbid: true,
              isRequired: true,
            },
            {
              icon: 'epic-icon-upload',
              input: true,
              componentProps: {
                maxCount: 5,
                multiple: true,
                maxSize: 50,
                action: '/jeecgboot/sys/common/upload',
              },
              rules: [
                {
                  trigger: ['change'],
                  type: 'array',
                  required: true,
                  message: '附件不能为空',
                },
              ],
              label: '附件',
              id: 'attachments',
              isUnique: true,
              hideCopy: true,
              hideDel: true,
              forbid: true,
              isRequired: true,
              type: 'superviseCustomattachments',
              field: 'attachments',
            },
            {
              icon: 'epic-icon-xiala',
              input: true,
              componentProps: {
                options: [
                  {
                    label: '选项1',
                    value: '选项1',
                  },
                  {
                    label: '选项2',
                    value: '选项2',
                  },
                ],
                listHeight: 256,
                placeholder: '请选择',
                placement: 'bottomLeft',
                mode: 'multiple',
              },
              rules: [
                {
                  type: 'array',
                  trigger: ['change'],
                  required: true,
                  message: '责任单位不能为空',
                },
              ],
              label: '责任单位',
              isShow: true,
              id: 'responsibleDepart',
              on: {
                vnodeMounted: [
                  {
                    componentId: null,
                    methodName: 'getResponsibleOrgApi',
                    type: 'custom',
                  },
                ],
                change: [
                  {
                    componentId: null,
                    methodName: 'handResponsibleDepartChange',
                    type: 'custom',
                  },
                ],
              },
              isUnique: true,
              hideCopy: true,
              hideDel: true,
              forbid: true,
              isRequired: true,
              type: 'superviseCustomresponsibleDepart',
              field: 'responsibleDepart',
            },
          ],
        },
      ],
      componentProps: {
        style: {
          padding: '16px',
        },
      },
    },
  ],
  script: scriptCode,
};

export const defaultNoticeSchema = {
  icon: 'epic-icon-zhage',
  childImmovable: true,
  rules: [
    {
      type: 'string',
      trigger: ['change'],
      required: false,
      message: '通知不能为空',
    },
  ],
  label: '通知',
  id: 'customNotice',
  componentProps: {
    completionDeadline: '',
    noticeTimeOptions: [
      {
        label: '即时通知',
        value: '1',
      },
      {
        label: '提前',
        value: '2',
      },
    ],
    noticeCycleOptions: [
      {
        label: '只通知一次',
        value: '1',
      },
      {
        label: '每天通知',
        value: '2',
      },
    ],
  },
  on: {
    vnodeMounted: [
      {
        componentId: null,
        methodName: 'setNoticeData',
        type: 'custom',
      },
    ],
  },
  isUnique: true,
  hideCopy: true,
  hideDel: true,
  forbid: true,
  isRequired: true,
  type: 'supervisecustomNotice',
  field: 'customNotice',
};

export const setupTaskTemplatePlugin = (pluginManager: PluginManager) => {
  setupComponentManager(pluginManager, superviseFormConfig, { mode: 'cover' });
  setupComponentManager(pluginManager, superviseCustomFormConfig, { mode: 'cover' });
  setupPublicMethods(pluginManager, superviseMethodsConfig);
};
