import { SchemaGroup, deepClone } from '@coderlt/form-designer';
import { SchemaItem } from '/@/plugins/epic-designer/types/components';
import { atomicComponent } from './component';

const isProd = ['uat', 'production'].includes(import.meta.env.MODE);
// const isProd = true;

interface Config {
  isUnique?: boolean;
  isFixed?: boolean;
  isHide?: boolean;
  isShow?: boolean;
  isRequired?: boolean;
  prefix: string;
}

const generateConfig = (type: keyof typeof atomicComponent, params: Config): SchemaItem => {
  if (!(type in atomicComponent)) {
    throw `${type} 改类型组件不存在`;
  }

  const defaultSchemaConfig = deepClone(atomicComponent[type].defaultSchema || {});
  const defaultConfig = deepClone(atomicComponent[type].config || {});

  params.isUnique && (defaultSchemaConfig.isUnique = true);

  if (params.isFixed) {
    defaultSchemaConfig.hideCopy = true;
    defaultSchemaConfig.hideDel = true;
  } else {
    defaultConfig.attribute = defaultConfig.attribute || [];

    defaultConfig.attribute.push({
      label: '表单校验',
      type: 'CustomRuleEditor',
      layout: 'vertical',
      field: 'rules',
      describe: '',
      onChange: ({ value, values }) => {
        if (value && value.length) {
          values.isRequired = value[0].required
        } else {
          values.isRequired = false
        }
      },
    });
  }

  // fix: 全部去掉编辑按钮
  defaultSchemaConfig.hideCopy = true;

  // 本地保存调试,添加 isShow 字段
  // if (!isProd) {
  defaultConfig.attribute = defaultConfig.attribute || [];
  defaultConfig.attribute.push({
    label: '是否列表字段',
    type: 'switch',
    field: 'isShow',
  });
  // }

  defaultSchemaConfig.forbid = params.isFixed || false; // 是否固定字段
  defaultSchemaConfig.isRequired = params.isRequired || false; // 是否必填
  defaultSchemaConfig.isShow = params.isShow || false; // 是否列表字段
  defaultSchemaConfig.type = `${params.prefix}${defaultSchemaConfig.id}`;

  params.isHide && (defaultSchemaConfig.hide = true);

  return {
    ...atomicComponent[type],
    defaultSchema: defaultSchemaConfig,
    config: defaultConfig,
  };
};

// 督办组件配置
const supervisePrefix = 'supervise';
const superviseConfigMap: Record<string, Config> = {
  keyTask: { isUnique: true, isFixed: true, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true }, // 重点任务
  mainContent: { isUnique: true, isFixed: true, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true }, // 主要内容
  content: { isUnique: true, isFixed: true, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true }, // 内容
  firstIndicatorName: { isUnique: true, isFixed: false, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true }, // 一级指标
  secondIndicatorName: { isUnique: true, isFixed: false, isHide: isProd, prefix: supervisePrefix, isRequired: false, isShow: true }, // 二级指标
  responsibleDepart: { isUnique: true, isFixed: true, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true }, // 责任单位
  deadlineType: { isUnique: true, isFixed: true, isHide: isProd, prefix: supervisePrefix }, // 完成时限
  requireEndTime: { isUnique: true, isFixed: true, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: false }, // 要求完成时间
  attachments: { isUnique: true, isFixed: true, isHide: isProd, prefix: supervisePrefix }, // 附件
  demand: { isUnique: true, isFixed: true, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true }, // 总体要求
  goal: { isUnique: true, isFixed: true, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true }, // 主要目标
  title: { isUnique: true, isFixed: true, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true }, // 标题
  reformMatter: { isUnique: true, isFixed: true, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true }, // 改革事项
  promotionMeasure: { isUnique: true, isFixed: true, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true }, // 复制推广举措
  leadDepart: { isUnique: true, isFixed: true, isHide: isProd, prefix: supervisePrefix, isRequired: true, isShow: true }, // 牵头单位

  linkman: { isUnique: true, isFixed: false, prefix: supervisePrefix }, // 联系人
  phone: { isUnique: true, isFixed: false, prefix: supervisePrefix }, // 联系电话
  remarks: { isUnique: true, isFixed: false, prefix: supervisePrefix }, // 备注
  time: { isUnique: true, isFixed: false, prefix: supervisePrefix }, // 时间范围
  emergency: { isUnique: true, isFixed: false, prefix: supervisePrefix }, // 紧急程度
  indicator: { isUnique: true, isFixed: false, prefix: supervisePrefix }, // 对应指标
  notice: { isUnique: true, isFixed: true, isHide: isProd, prefix: supervisePrefix }, // 通知
};
// 督办默认展示组件
export const superviseTilte = '督办组件';
export const superviseFormConfig: SchemaGroup = {
  title: superviseTilte,
  list: Object.entries(superviseConfigMap).map(([type, params]) => generateConfig(type as keyof typeof atomicComponent, params)),
};

// 督办自定义组件配置
const superviseCustomPrefix = 'superviseCustom';
const superviseCustomConfigMap: Record<string, Config> = {
  title: { isUnique: true, isFixed: true, isHide: isProd, prefix: superviseCustomPrefix, isRequired: true, isShow: true }, // 标题
  deadlineType: { isUnique: true, isFixed: true, isHide: isProd, prefix: superviseCustomPrefix, isRequired: false, isShow: true }, // 完成时限
  requireEndTime: { isUnique: true, isFixed: true, isHide: isProd, prefix: superviseCustomPrefix, isRequired: true }, // 要求完成时间
  attachments: { isUnique: true, isFixed: true, isHide: isProd, prefix: superviseCustomPrefix, isRequired: false }, // 附件
  responsibleDepart: { isUnique: true, isFixed: true, isHide: isProd, prefix: superviseCustomPrefix, isRequired: true, isShow: true }, // 责任单位

  goal: { isUnique: true, isFixed: false, prefix: superviseCustomPrefix }, // 主要目标
  keyTask: { isUnique: true, isFixed: false, prefix: superviseCustomPrefix }, // 重点任务
  mainContent: { isUnique: true, isFixed: false, prefix: superviseCustomPrefix }, // 主要内容
  demand: { isUnique: true, isFixed: false, prefix: superviseCustomPrefix }, // 总体要求
  linkman: { isUnique: true, isFixed: false, prefix: superviseCustomPrefix }, // 联系人
  phone: { isUnique: true, isFixed: false, prefix: superviseCustomPrefix }, // 联系电话
  leadDepart: { isUnique: true, isFixed: false, prefix: superviseCustomPrefix }, // 牵头单位
  remarks: { isUnique: true, isFixed: false, prefix: superviseCustomPrefix }, // 备注
  time: { isUnique: true, isFixed: false, prefix: superviseCustomPrefix }, // 时间范围
  emergency: { isUnique: true, isFixed: false, prefix: superviseCustomPrefix }, // 紧急程度
};
export const superviseCustomTilte = '督办自定义组件';
export const superviseCustomFormConfig: SchemaGroup = {
  title: superviseCustomTilte,
  list: Object.entries(superviseCustomConfigMap).map(([type, params]) => generateConfig(type as keyof typeof atomicComponent, params)),
};
