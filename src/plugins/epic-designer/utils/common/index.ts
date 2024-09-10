import { deepClone } from '@coderlt/form-designer';
import { uniqueId } from 'lodash-es';
import { ComponentTypeEnum } from '../../enums/component';
import { inputConfig } from '../../components/input';
import { formConfig } from '../../components/form';
import { selectConfig } from '../../components/select';
import { switchConfig } from '../../components/switch';
import { treeSelectConfig } from '../../components/treeSelect';
import { uploadConfig } from '../../components/upload';
import { radioConfig } from '../../components/radio';
import { textareaConfig } from '../../components/textarea';
import { dataPickerCofnig } from '../../components/date-picker';
import { componsiteComponentConfig } from '../../components/composite-component';
import { customNoticeConfig } from '../../components/custom-notice';
import { SchemaItem } from '../../types/components';

const componentTypeConfig = {
  [ComponentTypeEnum.FORM]: formConfig,
  [ComponentTypeEnum.INPUT]: inputConfig,
  [ComponentTypeEnum.RADIO]: radioConfig,
  [ComponentTypeEnum.SELECT]: selectConfig,
  [ComponentTypeEnum.SWITCH]: switchConfig,
  [ComponentTypeEnum.TEXTAREA]: textareaConfig,
  [ComponentTypeEnum.TREE_SELECT]: treeSelectConfig,
  [ComponentTypeEnum.UPLOAD]: uploadConfig,
  [ComponentTypeEnum.DATA_PICKER]: dataPickerCofnig,
  [ComponentTypeEnum.COMPOSITE_COMPONENT]: componsiteComponentConfig,
  [ComponentTypeEnum.CUSTOM_NOTICE]: customNoticeConfig,
};

type GenerateSchemaByType = (config: SchemaItem, mode: 'cover' | 'merge') => SchemaItem;
export const generateSchemaByType: GenerateSchemaByType = (config, mode: 'cover' | 'merge') => {
  // 合并配置项
  const { defaultSchema, groupName, config: schemaConfig } = config;

  // 根据分类找出对应的默认配置
  const defaultConfig = deepClone(componentTypeConfig[config.componentType]);

  const resultConfig: any = {
    defaultSchema: {},
    config: {
      attribute: [],
      event: [],
      action: [],
    },
    component: defaultConfig.component,
    bindModel: defaultConfig.bindModel,
  };

  // 合并 defaultSchema
  resultConfig.defaultSchema = {
    ...(defaultConfig.defaultSchema || {}),
    ...defaultSchema,
  };

  if (defaultSchema.isUnique) {
    if (!defaultSchema.id) {
      return console.error('唯一组件 id 不能为空');
    }
    resultConfig.defaultSchema.type = defaultSchema.type || defaultSchema.id;
    resultConfig.defaultSchema.field = defaultSchema.id;
  } else {
    if (!defaultSchema.type || !defaultSchema.id) {
      return console.error('不唯一组件 type，id 不能为空');
    }
    resultConfig.defaultSchema.field = uniqueId();
  }

  // 设置禁用文字和状态
  if ('rules' in resultConfig.defaultSchema) {
    resultConfig.defaultSchema.rules[0].required = defaultSchema.isRequired;
    resultConfig.defaultSchema.rules[0].message = `${resultConfig.defaultSchema.label}不能为空`;
  }

  groupName && (resultConfig.groupName = groupName);

  if (mode === 'merge') {
    resultConfig.config = {
      attribute: defaultConfig.config.attribute || [],
      event: defaultConfig.config.event || [],
      action: defaultConfig.config.action || [],
    };
  }

  if (schemaConfig) {
    const attrList = ['attribute', 'event', 'action'];
    attrList.forEach((attr) => {
      if (schemaConfig && schemaConfig[attr]?.length) {
        schemaConfig[attr].forEach((val: any) => {
          // 合并
          if (mode === 'merge') {
            const detailIndex = defaultConfig.config[attr].findIndex((i) => i.label === val.label);
            // 已有配置的，覆盖，没有的最后新加
            if (detailIndex !== -1) {
              resultConfig.config[attr][detailIndex as number] = attr;
            } else {
              resultConfig.config[attr].push(attr);
            }
          } else {
            // 覆盖
            resultConfig.config[attr].push(val);
          }
        });
      }
    });
  }

  return resultConfig;
};

/**
 * 通过配置生成 form-designer 所需的表单文件
 */
export const generateSchemaByConfig = (config: SchemaItem[], mode: 'cover' | 'merge') => {
  const finalySchemaList: SchemaItem[] = [];

  config.forEach((config) => {
    finalySchemaList.push(generateSchemaByType(config, mode));
  });

  return finalySchemaList;
};
