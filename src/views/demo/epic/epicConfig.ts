import { MethodModel, deepClone } from '@coderlt/form-designer';
import { getAdLevelApi } from '/@/api/demo/thinkTank';
import { EventEnum, ComponentTypeEnum, DataPickerEnum } from '/@/plugins/epic-designer/';
import { SchemaGroup } from '/@/plugins/epic-designer/types/components';

const atomicComponent = {
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
  responsibleDepart: {
    componentType: ComponentTypeEnum.SELECT,
    defaultSchema: {
      label: '责任单位',
      id: 'responsibleDepart',
      on: {
        // 获取责任单位数据
        // [EventEnum.Mounted]: [
        //   {
        //     args: undefined,
        //     componentId: null,
        //     methodName: 'setCorrespondingIndicatorsData',
        //     type: 'custom',
        //   },
        // ],
      },
    },
  },
  deadlineType: {
    componentType: ComponentTypeEnum.SELECT,
    defaultSchema: {
      label: '完成时限',
      id: 'deadlineType',
      componentProps: {
        options: [
          { label: '日期选择', value: '1' },
          { label: '持续根据', value: '2' },
        ],
        placeholder: '请选择',
      },
      on: {
        // 设置自定义通知的回调
        change: [
          {
            args: undefined,
            componentId: null,
            methodName: 'handleDataPicker1Change',
            type: 'custom',
          },
        ],
      },
    },
  },
  requireTime: {
    componentType: ComponentTypeEnum.DATA_PICKER,
    defaultSchema: {
      label: '要求完成时间',
      id: 'requireTime',
      componentProps: {
        valueFormat: 'YYYY-MM-DD',
        type: DataPickerEnum.DATARANGE,
      },
    },
  },
  attachments: {
    componentType: ComponentTypeEnum.UPLOAD,
    defaultSchema: {
      label: '附件',
      id: 'attachments',
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
      on: {
        // 获取牵头单位数据
        // [EventEnum.Mounted]: [
        //   {
        //     args: undefined,
        //     componentId: null,
        //     methodName: 'setCorrespondingIndicatorsData',
        //     type: 'custom',
        //   },
        // ],
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
            methodName: 'setUrgencyData',
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
            methodName: 'setCorrespondingIndicatorsData',
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

interface Config {
  isUnique?: boolean;
  isFixed?: boolean;
  isHide?: boolean;
}
const generateConfig = (type: string | number, params: Config) => {
  if (type in atomicComponent) {
    const config = deepClone(atomicComponent[type]);

    if (params.isUnique) {
      config.defaultSchema.isUnique = true;
    }

    if (params.isFixed) {
      config.defaultSchema.hideCopy = true;
      config.defaultSchema.hideDel = true;
      config.defaultSchema.type = `fixed${config.defaultSchema.id}`;
    } else {
      config.defaultSchema.type = `custom${config.defaultSchema.id}`;

      if (!config.config) {
        config.config = {};

        if (!config.config.attribute) {
          config.config.attribute = [];
        }

        config.config.attribute.push({
          label: '表单校验',
          type: 'CustomRuleEditor',
          layout: 'vertical',
          field: 'rules',
          describe: '',
        });
      }
    }

    config.defaultSchema.forbid = params.isFixed || false; // 是否固定字段
    config.defaultSchema.isRequired = params.isFixed || false; // 是否必填

    if (params.isHide) {
      config.defaultSchema.hide = true;
    }

    return config;
  } else {
    console.error(`${type} 改类型组件不存在`);
    return {};
  }
};

const isProd = false;
// 督办默认展示组件
const superviseFormConfig: SchemaGroup = {
  title: '督办组件',
  list: [
    generateConfig('keyTask', { isUnique: true, isFixed: true, isHide: isProd }),
    generateConfig('mainContent', { isUnique: true, isFixed: true, isHide: isProd }),
    generateConfig('responsibleDepart', { isUnique: true, isFixed: true, isHide: isProd }),
    // generateConfig('completionDeadline', { isUnique: true, isFixed: true, isHide: isProd }),
    generateConfig('deadlineType', { isUnique: true, isFixed: true, isHide: isProd }),
    generateConfig('requireTime', { isUnique: true, isFixed: true, isHide: isProd }),
    generateConfig('attachments', { isUnique: true, isFixed: false, isHide: isProd }),
    generateConfig('demand', { isUnique: true, isFixed: true, isHide: isProd }),
    generateConfig('goal', { isUnique: true, isFixed: true, isHide: isProd }),
    generateConfig('title', { isUnique: true, isFixed: true, isHide: isProd }),
    generateConfig('reformMatter', { isUnique: true, isFixed: true, isHide: isProd }),
    generateConfig('promotionMeasure', { isUnique: true, isFixed: true, isHide: isProd }),
    generateConfig('leadDepart', { isUnique: true, isFixed: true, isHide: isProd }),
    generateConfig('linkman', { isUnique: true, isFixed: false }),
    generateConfig('phone', { isUnique: true, isFixed: false }),
    generateConfig('remarks', { isUnique: true, isFixed: false }),
    generateConfig('time', { isUnique: true, isFixed: false }),
    generateConfig('emergency', { isUnique: true, isFixed: false }),
    generateConfig('indicator', { isUnique: true, isFixed: false }),
    generateConfig('notice', { isUnique: true, isFixed: false }),
  ],
};

// 督办自定义模板展示
export const superviseCustomFormConfig: SchemaGroup = {
  title: '督办自定义组件',
  list: [
    // 重点任务
    //     generateConfig('5', { isUnique: true, isFixed: true, isHide: isProd }),
    //     generateConfig('completionDeadline', { isUnique: true, isFixed: true, isHide: isProd }),
    //     generateConfig('upload', { isUnique: true, isFixed: true, isHide: isProd }),
    //     generateConfig('2', { isUnique: true, isFixed: true, isHide: isProd }),
    //
    //     generateConfig('4', { isUnique: true, isFixed: false }),
    //     generateConfig('task', { isUnique: true, isFixed: false }),
    //     generateConfig('1', { isUnique: true, isFixed: false }),
    //     generateConfig('3', { isUnique: true, isFixed: false }),
    //     generateConfig('9', { isUnique: true, isFixed: false }),
    //     generateConfig('contactsNumber', { isUnique: true, isFixed: false }),
    //     generateConfig('8', { isUnique: true, isFixed: false }),
    //     generateConfig('desc', { isUnique: true, isFixed: false }),
    //     generateConfig('10', { isUnique: true, isFixed: false }),
    //     generateConfig('urgency', { isUnique: true, isFixed: false }),
  ],
};

const superviseMethodsConfig: MethodModel[] = [
  {
    methodName: 'getSuperviseExpandFieldStatic',
    method() {
      console.log('测试静态数据扩展方法');
      const data = [
        {
          delFlag: 0,
          dropChild: null,
          field: 'problems',
          format: '文本域类型',
          id: '1714589962079358977',
          name: '存在问题',
          type: 'text',
          value: null,
        },
        {
          delFlag: 0,
          dropChild: null,
          field: 'personLeader',
          format: '文本框类型',
          id: '1714894639376650242',
          name: '责任领导',
          type: 'varchar',
          value: null,
        },
      ];
      return data.map((i) => ({ label: i.name, value: i.id }));
    },
    describe: '这是一个测试函数描述',
  },
  {
    methodName: 'getNoticeTypes',
    method() {
      const data = {
        weekType: [
          {
            dictCode: '1',
            dictName: '只通知一次',
          },
          {
            dictCode: '2',
            dictName: '每天通知',
          },
        ],
        daysType: [
          {
            dictCode: '1',
            dictName: '即时通知',
          },
          {
            dictCode: '2',
            dictName: '提前',
          },
          {
            dictCode: '3',
            dictName: '延后',
          },
        ],
      };
      return data;
    },
    describe: '这是一个测试函数描述',
  },
  {
    methodName: 'getSuperviseExpandField',
    async method() {
      console.log('测试动态数据扩展方法');
      const res = await getAdLevelApi();
      return res.map((i) => ({ label: i.title, value: i.value }));
    },
    describe: '这是一个测试函数描述',
  },
];

const scriptCode = `const { defineExpose, find, getSuperviseExpandFieldStatic, getSuperviseExpandField, getNoticeTypes } = epic;

function test (){
  console.log('test')
}

function setUrgencyData() {
  const data = getSuperviseExpandFieldStatic()
  find('urgency').setAttr('options', data)
}

// 完成时限变动，修改通知的属性
function handleDataPicker1Change() {
  const deadlineTypeDetail = find('deadlineType')
  console.log('deadlineTypeDetail', deadlineTypeDetail)
  if (deadlineTypeDetail) {
    // 通知
    const detail = find('customNotice')
    if (detail) {
      detail.setAttr('completionDeadline', deadlineTypeDetail.getValue())
    } else {
      console.error('未找到完成通知组件', 'customNotice')
    }

    // 要求完成时间
    const requireTimeDetail = find('requireTime')
    console.log('requireTimeDetail', requireTimeDetail)
    if (requireTimeDetail) {
      requireTimeDetail.setAttr('hidden', deadlineTypeDetail.getValue() === '2')
    }
  } else {
    console.error('未找到完成时间组件', 'deadlineType')
  }
}

// 设置通知数据
function setNoticeData() {
  const data = getNoticeTypes()
  console.log(data)

  const detail = find('customNotice')
  if (detail) {
    detail.setAttr('noticeTimeOptions', data.daysType.map(i => ({ label: i.dictName, value: i.dictCode })))
    detail.setAttr('noticeCycleOptions', data.weekType.map(i => ({ label: i.dictName, value: i.dictCode })))
  }
}

async function setCorrespondingIndicatorsData() {
  const data = await getSuperviseExpandField()
  find('correspondingIndicators').setAttr('options', data)
}

// 通过defineExpose暴露的函数或者属性
defineExpose({
 test,
 setUrgencyData,
 setCorrespondingIndicatorsData,
 handleDataPicker1Change,
 setNoticeData
})`;

const defaultSchema = {
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

export { superviseFormConfig, superviseMethodsConfig, scriptCode, defaultSchema };
