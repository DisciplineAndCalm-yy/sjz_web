import { MethodModel, PluginManager } from '@coderlt/form-designer';

/**
 * 注册公共方法
 * @param pluginManager form-designer pluginManager 实例
 * @param methods 表单配置数据 MethodModel[]
 */
export function setupPublicMethods(pluginManager: PluginManager, methods: MethodModel[]) {
  methods.forEach((method) => {
    pluginManager.addPublicMethod(method);
  });
}

/**
 * 注册公共方法
 * @param pluginManager form-designer pluginManager 实例
 */
export function setupExtensionsComponent(pluginManager: PluginManager) {
  pluginManager.component('CustomRuleEditor', async () => await import('./ERuleEditor/index.vue'));
}
