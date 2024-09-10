import { type PluginManager } from '@coderlt/form-designer';
import { generateSchemaByConfig } from '../utils/common';
import { formConfig } from './form';
import formItemSchema from './form-item';
import { ComponentManagerParmas, SchemaGroup, SchemaItem } from '../types/components';

/**
 * 注册表单和组
 * @param pluginManager form-designer pluginManager 实例
 * @param config 表单配置数据 SchemaGroup
 */
export function setupComponentManager(pluginManager: PluginManager, config: SchemaGroup, parmas: ComponentManagerParmas) {
  const { title, list } = config;

  const schemaList: SchemaItem[] = generateSchemaByConfig(list, parmas.mode || 'merge');

  function registerComponents(config: SchemaItem[]) {
    config.forEach((item) => {
      pluginManager.registerComponent(item);
    });
  }

  registerComponents(schemaList);

  console.log('注册表单', schemaList);

  // 表单所需，特殊处理 form-item
  pluginManager.registerComponent(formConfig);
  pluginManager.registerComponent(formItemSchema);

  const schemaNameList: string[] = schemaList.filter((i) => !i.defaultSchema.hide).map((i) => i.defaultSchema.type);
  pluginManager.addSchemaGroup({
    title,
    list: schemaNameList,
  });
}
