import { EventEnum, ComponentTypeEnum, DataPickerEnum } from '/@/plugins/epic-designer/';

export const atomicComponent = {
  keyTask: {
    componentType: ComponentTypeEnum.INPUT,
    defaultSchema: {
      label: '重点任务',
      id: 'keyTask',
      immovable: false,
    },
    config: {
      attribute: [],
    },
  },
  mainContent: {
    componentType: ComponentTypeEnum.TEXTAREA,
    defaultSchema: {
      label: '主要内容',
      id: 'mainContent',
    },
  },
  content: {
    componentType: ComponentTypeEnum.TEXTAREA,
    defaultSchema: {
      label: '内容',
      id: 'content',
    },
  },
  firstIndicatorName: {
    componentType: ComponentTypeEnum.INPUT,
    defaultSchema: {
      label: '对应一级指标',
      id: 'firstIndicatorName',
    },
  },
  secondIndicatorName: {
    componentType: ComponentTypeEnum.INPUT,
    defaultSchema: {
      label: '对应二级指标',
      id: 'secondIndicatorName',
    },
  },
  responsibleDepart: {
    componentType: ComponentTypeEnum.SELECT,
    defaultSchema: {
      label: '责任单位',
      id: 'responsibleDepart',
      componentProps: {
        mode: 'multiple',
        placeholder: '请选择',
      },
      rules: [{ type: 'array', trigger: ['change'], required: false, message: '责任单位不能为空' }],
      on: {
        // 获取责任单位数据
        [EventEnum.Mounted]: [
          {
            args: undefined,
            componentId: null,
            methodName: 'getResponsibleOrgApi',
            type: 'custom',
          },
        ],
        // 责任单位的回调
        change: [
          {
            args: undefined,
            componentId: null,
            methodName: 'handResponsibleDepartChange',
            type: 'custom',
          },
        ],
      },
    },
  },
  deadlineType: {
    componentType: ComponentTypeEnum.SELECT,
    defaultSchema: {
      label: '完成时限',
      id: 'deadlineType',
      componentProps: {
        placeholder: '请选择',
      },
      on: {
        [EventEnum.Mounted]: [
          {
            args: undefined,
            componentId: null,
            methodName: 'getDeadlineTypeApi',
            type: 'custom',
          },
        ],
        // 设置自定义通知的回调
        change: [
          {
            args: undefined,
            componentId: null,
            methodName: 'handleDeadlineTypeChange',
            type: 'custom',
          },
        ],
      },
    },
  },
  requireEndTime: {
    componentType: ComponentTypeEnum.DATA_PICKER,
    defaultSchema: {
      label: '要求完成时间',
      id: 'requireEndTime',
      componentProps: {
        valueFormat: 'YYYY-MM-DD',
        type: DataPickerEnum.DATE,
      },
      rules: [{ trigger: ['change'], required: false, type: 'string', message: '' }],
    },
  },
  attachments: {
    componentType: ComponentTypeEnum.UPLOAD,
    defaultSchema: {
      label: '附件',
      id: 'attachments',
      componentProps: {
        maxCount: 5,
        multiple: true,
        maxSize: 50,
        action: '/jeecgboot/sys/common/upload',
      },
    },
  },
  demand: {
    componentType: ComponentTypeEnum.TEXTAREA,
    defaultSchema: {
      label: '总体要求',
      id: 'demand',
    },
  },
  goal: {
    componentType: ComponentTypeEnum.TEXTAREA,
    defaultSchema: {
      label: '主要目标',
      id: 'goal',
    },
  },
  title: {
    componentType: ComponentTypeEnum.TEXTAREA,
    defaultSchema: {
      label: '标题',
      id: 'title',
    },
  },
  reformMatter: {
    componentType: ComponentTypeEnum.TEXTAREA,
    defaultSchema: {
      label: '改革事项',
      id: 'reformMatter',
    },
  },
  promotionMeasure: {
    componentType: ComponentTypeEnum.TEXTAREA,
    defaultSchema: {
      label: '复制推广举措',
      id: 'promotionMeasure',
    },
  },
  leadDepart: {
    componentType: ComponentTypeEnum.SELECT,
    defaultSchema: {
      label: '牵头单位',
      id: 'leadDepart',
      componentProps: {
        mode: 'multiple',
        placeholder: '请选择',
      },
      rules: [{ type: 'array', trigger: ['change'], required: false, message: '牵头单位不能为空' }],
      on: {
        // 获取牵头单位数据
        [EventEnum.Mounted]: [
          {
            args: undefined,
            componentId: null,
            methodName: 'getLeadDepartApi',
            type: 'custom',
          },
        ],
        // 设置自定义通知的回调
        change: [
          {
            args: undefined,
            componentId: null,
            methodName: 'handLeleadDepartChange',
            type: 'custom',
          },
        ],
      },
    },
  },
  linkman: {
    componentType: ComponentTypeEnum.INPUT,
    defaultSchema: {
      label: '联系人',
      id: 'linkman',
    },
  },
  phone: {
    componentType: ComponentTypeEnum.INPUT,
    defaultSchema: {
      label: '联系电话',
      id: 'phone',
    },
  },
  remarks: {
    componentType: ComponentTypeEnum.TEXTAREA,
    defaultSchema: {
      label: '备注',
      id: 'remarks',
    },
  },
  time: {
    componentType: ComponentTypeEnum.DATA_PICKER,
    defaultSchema: {
      label: '时间范围',
      id: 'time',
      fieldList: ['startTime', 'endTime'],
      componentProps: {
        valueFormat: 'YYYY-MM-DD',
        type: DataPickerEnum.DATARANGE,
      },
    },
  },
  emergency: {
    componentType: ComponentTypeEnum.SELECT,
    defaultSchema: {
      label: '紧急程度',
      id: 'emergency',
      on: {
        [EventEnum.Mounted]: [
          {
            args: undefined,
            componentId: null,
            methodName: 'getEmergencyApi',
            type: 'custom',
          },
        ],
      },
    },
  },
  indicator: {
    componentType: ComponentTypeEnum.SELECT,
    defaultSchema: {
      label: '对应指标',
      id: 'indicator',
      on: {
        [EventEnum.Mounted]: [
          {
            args: undefined,
            componentId: null,
            methodName: 'getIndicatorApi',
            type: 'custom',
          },
        ],
      },
    },
  },
  notice: {
    componentType: ComponentTypeEnum.CUSTOM_NOTICE,
    defaultSchema: {
      label: '通知',
      id: 'customNotice',
      componentProps: {
        completionDeadline: '',
        noticeTimeOptions: [],
        noticeCycleOptions: [],
      },
      on: {
        [EventEnum.Mounted]: [
          {
            args: undefined,
            componentId: null,
            methodName: 'setNoticeData',
            type: 'custom',
          },
        ],
      },
    },
  },
};

export enum DeadlineTypeEnum {
  DATE_SELECT = '1',
  SUSTAIN = '0',
}
