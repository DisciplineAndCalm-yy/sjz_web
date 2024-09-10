<template>
  <div class="operate_main">
    <!-- 顶部表单 -->
    <div class="layout_top">
      <a-form layout="inline" :labelCol="{ span: 8 }">
        <a-form-item label="问卷名称" name="name">
          <a-input v-model:value="baseInfo.name" style="width: 100%" />
        </a-form-item>
        <a-form-item label="目标样本量" name="sampleSize">
          <a-input v-model:value="baseInfo.sampleSize" />
        </a-form-item>
      </a-form>
    </div>

    <!-- 中间问卷配置部分 -->
    <div class="layout_middle">
      <!-- 左侧组件功能区 -->
      <div class="func">
        <p class="title">组件</p>
        <draggable
          itemKey="value"
          :list="funcItemAll"
          :force-fallback="true"
          :fallback-class="true"
          :group="{ name: 'list', pull: 'clone', put: false }"
          :sort="false"
        >
          <template #item="{ element }">
            <div class="func_item" @click="() => (templateList.push(element), addFormItemCB(element, element.type))"> {{ element.label }}</div>
          </template>
        </draggable>
      </div>

      <!-- 中间拖转区 -->
      <div class="box">
        <div v-if="templateList.length === 0" class="none">
          <a-spin tip="加载中..." :spinning="loading" style="width: 100%; height: 100%">
            <img src="./img/noneData.png" alt="" />
            <p>从左侧拖入或点选组件进行表单设计</p>
          </a-spin>
        </div>
        <draggable
          ghost-class="normal_item_ghost"
          drag-class="normal_item_drag"
          itemKey="id"
          animation="300"
          handle=".mover"
          class="operate_form_template_box"
          :group="{ name: 'list' }"
          :list="templateList"
          :force-fallback="true"
          :fallback-on-body="true"
          @add="addFormItemCB"
          @update="(element) => sortFormItemCB(element.item.__draggable_context.element.formItemId)"
        >
          <template #item="{ element }">
            <div
              :class="{ normal_item: true, normal_item_active: element.formItemId === activeFormItem.formItemId }"
              @click="activeFormItem = element"
            >
              <!-- 标题 -->
              <div class="normal_item_title">
                <span v-if="element.required" class="dot">*</span>
                <span>{{ element.label }}</span>
              </div>
              <!-- 表单组件 -->
              <div>
                <template v-if="element.type === 'INPUT'">
                  <a-textarea v-if="element.scheme.config.textarea" :placeholder="element.placeholder" style="width: 100%" :rows="1" />
                  <a-input v-else :placeholder="element.placeholder" style="width: 100%" />
                </template>
                <a-select v-if="element.type === 'SELECT'" :placeholder="element.placeholder" style="width: 100%">
                  <a-select-option v-for="(item, key) in element.scheme.config.options" :key="key" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
                <a-rate v-if="element.type === 'RATE'" :value="2" />
                <a-input-number v-if="element.type === 'NUMBER'" :placeholder="element.placeholder" style="width: 100%" />
                <a-radio-group v-if="element.type === 'RADIO'" :value="null">
                  <a-radio v-for="(item, key) in element.scheme.config.options" :key="key">
                    {{ item.label }}
                  </a-radio>
                </a-radio-group>
                <a-checkbox-group v-if="element.type === 'CHECKBOX'" :value="null" :options="element.scheme.config.options" />
              </div>
              <!-- formItem功能块 -->
              <div class="item_func">
                <!-- 拖拽 -->
                <div class="icon_box icon_box_primary mover">
                  <drag-outlined class="icon_primary" />
                </div>
                <!-- 删除 -->
                <div v-if="!element.scheme.config.lock" class="icon_box icon_box_danger" @click="removeFormItem(element)">
                  <delete-outlined class="icon_danger" />
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- 右侧组件属性配置区 -->
      <div class="component_setting">
        <p class="title">组件属性</p>
        <a-empty v-if="!activeFormItem.formItemId">
          <template #description> 暂无选中组件 </template>
        </a-empty>
        <template v-else>
          <div class="setting_item">
            <span class="setting_item_title">组件ID</span>
            <div class="setting_item_com">{{ activeFormItem.formItemId }}</div>
          </div>
          <div class="setting_item">
            <span class="setting_item_title">标题</span>
            <div class="setting_item_com"><a-input v-model:value="activeFormItem.label" style="width: 100%" /></div>
          </div>
          <div v-if="['INPUT', 'NUMBER', 'SELECT'].indexOf(activeFormItem.type) != -1" class="setting_item">
            <span class="setting_item_title">占位文案</span>
            <div class="setting_item_com"><a-input v-model:value="activeFormItem.placeholder" style="width: 100%" /></div>
          </div>
          <div class="setting_item">
            <span class="setting_item_title">是否必填</span>
            <div class="setting_item_com"><a-switch v-model:checked="activeFormItem.required" /></div>
          </div>
          <!-- 数字输入框独占 -->
          <template v-if="activeFormItem.type === 'number'">
            <div class="setting_item">
              <span class="setting_item_title">最大值</span>
              <div class="setting_item_com">
                <a-input-number style="width: 100%" id="inputNumber" />
              </div>
            </div>
            <div class="setting_item">
              <span class="setting_item_title">最小值</span>
              <div class="setting_item_com">
                <a-input-number style="width: 100%" id="inputNumber" />
              </div>
            </div>
          </template>
          <!-- 单选/多选 选项配置 -->
          <template v-if="['RADIO', 'CHECKBOX', 'SELECT'].indexOf(activeFormItem.type) != -1">
            <a-divider>选项</a-divider>
            <div class="select_option" v-for="(item, key) in activeFormItem.scheme.config.options" :key="key">
              <a-input
                placeholder="请输入选项名"
                v-model:value="item.label"
                @input="item.value = item.label"
                :disabled="!activeFormItem_optionCanEdit"
              />
              <minus-circle-outlined
                v-if="activeFormItem_optionCanEdit"
                class="min_icon"
                @click="activeFormItem.scheme.config.options.splice(key, 1)"
              />
            </div>
            <div v-if="activeFormItem_optionCanEdit" class="select_setting">
              <div class="select_setting_add" @click="activeFormItem.scheme.config.options.push({ label: '', value: '' })">
                <plus-circle-outlined />
                <span>添加选项</span>
              </div>
            </div>
          </template>
          <!-- 评分题逻辑 -->
          <template v-if="['RATE'].indexOf(activeFormItem.type) != -1">
            <a-divider>逻辑</a-divider>
            <div style="padding: 0 15px">
              评分低于
              <a-input-number :min="1" :max="5" v-model:value="activeFormItem.scheme.logic.lessValue" style="width: 100px; margin: 0 5px" />
              时显示低分原因
            </div>
            <p style="margin: 15px 15px 0 15px">低分原因选项</p>
            <div class="select_option" v-for="(item, key) in activeFormItem.scheme.logic.lessValueReasonOptions" :key="key">
              <a-input placeholder="请输入选项名" v-model:value="item.label" @input="item.value = item.label" />
              <minus-circle-outlined class="min_icon" @click="activeFormItem.scheme.logic.lessValueReasonOptions.splice(key, 1)" />
            </div>
            <div v-if="activeFormItem_optionCanEdit" class="select_setting">
              <div class="select_setting_add" @click="activeFormItem.scheme.logic.lessValueReasonOptions.push({ label: '', value: '' })">
                <plus-circle-outlined />
                <span>添加选项</span>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="layout_bottom">
      <a-space>
        <a-button type="success" @click="showPreviewDrawer = true">预览</a-button>
        <a-button type="primary" @click="publish">激活</a-button>
        <a-button @click="$router.push({ path: '/enterpriseAppeal/dailySatisfaction' })">关闭</a-button>
      </a-space>
    </div>

    预览抽屉
    <a-drawer v-model:visible="showPreviewDrawer" width="100%" title="预览" placement="right">
      <Preview />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import draggable from 'vuedraggable';
  import Preview from './preview.vue';
  import { ref, Ref, watch, onMounted, computed } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDebounceFn } from '@vueuse/core';
  import { useRoute, useRouter } from 'vue-router';
  import { Modal } from 'ant-design-vue';
  import { DragOutlined, DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons-vue';
  import {
    question_getByKey,
    question_create_item,
    question_sort,
    question_getItemList,
    question_delete_item,
    question_update_item,
    question_updateBaseInfo,
    question_publish,
  } from '/@/api/enterpriseAppeal/index';

  const route = useRoute();
  const router = useRouter();
  const { createMessage } = useMessage();

  const baseInfo = ref({
    formKey: '',
    name: null,
    sampleSize: null,
  });
  const loading = ref(false);

  type formItem = {
    label?: string;
    type?: string;
    formItemId?: string;
    sort?: string;
  };

  // 预览抽屉
  const showPreviewDrawer = ref(false);

  // 左侧组件list
  const funcItemAll: Ref<formItem[]> = ref([
    {
      label: '文本组件',
      type: 'INPUT',
      scheme: {
        config: {
          lock: false,
          options: [],
        },
      },
    },
    {
      label: '单选组件',
      type: 'RADIO',
      scheme: {
        config: {
          lock: false,
          options: [],
        },
      },
    },
    {
      label: '多选组件',
      type: 'CHECKBOX',
      scheme: {
        config: {
          lock: false,
          options: [],
        },
      },
    },
    {
      label: '数字组件',
      type: 'NUMBER',
      scheme: {
        config: {
          lock: false,
          options: [],
        },
      },
    },
    {
      label: '评分组件',
      type: 'RATE',
      scheme: {
        config: {
          lock: false,
          options: [],
        },
      },
    },
    {
      label: '下拉框组件',
      type: 'SELECT',
      scheme: {
        config: {
          lock: false,
          options: [],
        },
      },
    },
  ]);
  // 中间已拖入组件list
  const templateList: Ref<Record<string, any>[]> = ref([]);

  // 中间当前选中的formitem
  const activeFormItem: Ref<Record<string, any>> = ref({});
  // 当前选中的formitem  [RADIO SELECT CHECKBOX]情况下  选项是否可编辑
  const activeFormItem_optionCanEdit = computed(() => (['select1700000000000'].includes(activeFormItem.value.formItemId) ? false : true));

  // 监听问卷基本信息
  watch([() => baseInfo.value.name, () => baseInfo.value.sampleSize], ([newName, newSampleSize], [oldName, oldSampleSize]) => {
    if (oldName === null && oldSampleSize === null) return;

    if (newName !== oldName) {
      updateFormBaseInfo({ paramType: 0, value: newName, isNull: !newName });
    }
    if (newSampleSize !== oldSampleSize) {
      updateFormBaseInfo({ paramType: 1, value: newSampleSize, isNull: !newSampleSize });
    }
  });
  // 问卷 基本信息更新
  const updateFormBaseInfo = useDebounceFn(async (params: { paramType: number; value: string; isNull: boolean }) => {
    try {
      const res = await question_updateBaseInfo({ ...params, formKey: baseInfo.value.formKey });
      if (params.isNull) {
        baseInfo.value[params.paramType === 1 ? 'sampleSize' : 'name'] = res;
        createMessage.error('输入值不可为空，已自动填充为默认值');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }, 1000);

  // 监听组件属性
  watch(
    () => activeFormItem.value,
    (n) => {
      updateFormItem(n);
    },
    {
      deep: true,
    }
  );
  // 问卷子项 属性更新
  const updateFormItem = useDebounceFn((value) => {
    question_update_item({ ...value, formKey: baseInfo.value.formKey });
  }, 800);

  //问卷子项创建 点击或拖拽组件后 回调
  const addFormItemCB = async (element, type = '') => {
    templateList.value = JSON.parse(JSON.stringify(templateList.value));
    // 当前添加组件的下标
    const index = templateList.value.findIndex((item) => !item.formItemId);
    // 设置当前选中项
    activeFormItem.value = templateList.value[index];

    // 添加参数
    // id
    activeFormItem.value.formItemId = `${type || element.item.__draggable_context.element.type}_${Date.now()}`;
    // 必填
    activeFormItem.value.required = true;
    // 数字输入框
    if (activeFormItem.value.type === 'INPUT') {
      activeFormItem.value.placeholder = '请输入';
    }
    // 数字输入框
    if (activeFormItem.value.type === 'NUMBER') {
      activeFormItem.value.placeholder = '请输入';
      activeFormItem.value.scheme = {
        ...activeFormItem.value.scheme,
        max: 100000000,
        min: 0,
      };
    }
    // 选择框
    if (['RADIO', 'CHECKBOX', 'SELECT'].indexOf(activeFormItem.value.type) != -1) {
      try {
        activeFormItem.value.scheme = {
          ...activeFormItem.value.scheme,
          config: {
            options: [
              { label: '选项一', value: '选项一' },
              { label: '选项二', value: '选项二' },
            ],
          },
        };
        activeFormItem.value.placeholder = '请选择';
      } catch (error: any) {
        throw new Error(error);
      }
    }
    // 评分题
    if (['RATE'].indexOf(activeFormItem.value.type) != -1) {
      try {
        activeFormItem.value.scheme = {
          ...activeFormItem.value.scheme,
          config: {
            options: [
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '3', value: '3' },
              { label: '4', value: '4' },
              { label: '5', value: '5' },
            ],
          },
          logic: {
            lessValue: 3,
            lessValueReasonOptions: [
              { label: '选项一', value: '选项一' },
              { label: '选项二', value: '选项二' },
            ],
          },
        };
      } catch (error: any) {
        throw new Error(error);
      }
    }

    try {
      // 创建表单子项
      const res = await question_create_item({ ...activeFormItem.value, formKey: baseInfo.value.formKey });
      templateList.value[index]['sort'] = res.sort;

      // 排序
      sortFormItemCB(activeFormItem.value.formItemId);
    } catch (error: any) {
      // 全集loading 重新获取详情
      throw new Error(error);
    }
  };
  //问卷子项排序
  const sortFormItemCB = (formItemId) => {
    const index = templateList.value.findIndex((item) => item.formItemId === formItemId);
    let sortParams: Record<string, any> = {
      formItemId,
      formKey: baseInfo.value.formKey,
    };
    if (index !== 0) sortParams.beforePosition = templateList.value[index - 1]['sort'];
    if (index != templateList.value.length - 1) sortParams.afterPosition = templateList.value[index + 1]['sort'];
    question_sort(sortParams);
  };
  //问卷子项移除
  const removeFormItem = (element) => {
    activeFormItem.value = {};
    const index = templateList.value.findIndex((item) => item.formItemId === element.formItemId);
    templateList.value.splice(index, 1);
    question_delete_item(element);
  };

  //激活
  const publish = () => {
    Modal.confirm({
      title: '温馨提示',
      content: '问卷系统为编辑自动保存，当前已保存，确定激活当前问卷吗?',
      onOk() {
        return new Promise<void>(async (resolve, reject) => {
          try {
            await question_publish({ formKey: baseInfo.value.formKey });
            createMessage.success('激活成功');
            resolve();
            router.push({ path: '/enterpriseAppeal/dailySatisfaction' });
          } catch (error) {
            reject();
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
      class: 'test',
    });
  };

  onMounted(async () => {
    try {
      loading.value = true;

      const res_baseInfo = await question_getByKey({ key: route.query.key });
      baseInfo.value = {
        formKey: res_baseInfo.formKey,
        name: res_baseInfo.name,
        sampleSize: res_baseInfo.sampleSize,
      };

      const res_formItemList = (await question_getItemList({ key: route.query.key })) || [];
      templateList.value = res_formItemList.map((item) => {
        // 赋值 逻辑字段logic
        switch (item.type) {
          case 'RATE':
            // 初始评分提赋值逻辑字段
            if (!item.scheme.logic || item.scheme.logic.constructor !== Object || !Object.keys(item.scheme.logic).length)
              item.scheme.logic = {
                lessValue: 3,
                lessValueReasonOptions: [
                  { label: '选项一', value: '选项一' },
                  { label: '选项二', value: '选项二' },
                ],
              };
            break;
          default:
            item.scheme.logic = {};
        }
        return item;
      });

      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  });
</script>

<style lang="less" scoped>
  .test {
    width: 100px;
    height: 100px;
    // background-color: red;
  }
  .normal_item_drag {
    height: 70px !important;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
    opacity: 0.5 !important;
    .item_func {
      display: none !important;
    }
  }
  // draggable样式 需写到最外层
  .normal_item_ghost {
    overflow: hidden !important;
    height: 70px !important;
    width: 100% !important;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
    position: relative !important;
    &::before {
      content: ' ' !important;
      position: absolute !important;
      width: 100% !important;
      height: 4px !important;
      top: 0 !important;
      background-color: #1890ff !important;
    }
  }

  .operate_main {
    width: 100%;
    height: calc(100vh - 100px);
    position: relative;
    padding: 51px 0;
    .layout_top {
      position: absolute;
      top: 0;
      width: 100%;
      height: 50px;
      background: white;
      display: flex;
      align-items: center;
    }
    .layout_middle {
      width: 100%;
      height: 100%;
      display: flex;
      .func {
        flex: 0 0 242px;
        height: 100%;
        padding: 8px;
        overflow-y: auto;
        background-color: white;
        .title {
          font-size: 16px;
          color: #222;
          margin: 5px 10px;
          font-weight: 700;
        }
        .func_item {
          padding: 8px 10px;
          font-size: 12px;
          border: 1px solid transparent;
          border-radius: 6px;
          -webkit-box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
          box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
          width: 98%;
          margin: 1%;
          display: inline-block;
          cursor: move;
          text-align: center;
          user-select: none;
          &:hover {
            border-color: #1890ff;
            color: #1890ff;
          }
        }
      }
      .box {
        flex: 1;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        background: white;
        margin: 0 60px;
        padding: 12px;
        position: relative;
        .none {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          p {
            margin-top: 30px;
            font-size: 18px;
            color: #1890ff;
            letter-spacing: 4px;
          }
        }
        .operate_form_template_box {
          height: 100%;
          .normal_item {
            width: 100%;
            min-height: 70px;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
            padding: 0 12px;
            margin-bottom: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            &:hover {
              background: #1890ff0d !important;
              .item_func {
                display: flex;
              }
            }
            .normal_item_title {
              .dot {
                color: red;
                margin-right: 5px;
              }
            }
            .item_func {
              display: none;
              position: absolute;
              top: -10px;
              right: 0;
              .icon_box {
                width: 23px;
                height: 23px;
                border-radius: 10px;
                background: #fff;
                text-align: center;
                line-height: 23px;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                margin-right: 10px;
              }
              .icon_box_primary {
                border: 1px solid #1890ff;
                cursor: move;
                &:hover {
                  background: #1890ff;

                  border-color: #1890ff;
                  color: white;
                  .icon_primary {
                    color: white;
                  }
                }
                .icon_primary {
                  color: #1890ff;
                  font-size: 15px;
                }
              }
              .icon_box_danger {
                border: 1px solid #f5222d;
                cursor: pointer;
                &:hover {
                  background: #f5222d;
                  border-color: #f5222d;
                  color: white;
                  .icon_danger {
                    color: white;
                  }
                }
                .icon_danger {
                  color: #f5222d;
                  font-size: 15px;
                }
              }
            }
          }
          .normal_item_active {
            background: #1890ff0d !important;
            .item_func {
              display: flex;
            }
          }
        }
      }
      .component_setting {
        flex: 0 0 350px;
        height: 100%;
        overflow-y: auto;
        padding: 8px;
        background-color: white;
        .title {
          font-size: 16px;
          color: #222;
          margin: 5px 10px;
          font-weight: 700;
        }
        .select_option {
          width: 100%;
          padding: 8px 15px;
          display: flex;
          align-items: center;

          .min_icon {
            color: red;
            font-size: 22px;
            margin-left: 10px;
          }
        }
        .setting_item {
          display: flex;
          align-items: center;
          padding: 12px 18px 15px 15px;
          font-size: 14px;
          color: #606266;
          .setting_item_title {
            flex: 0 0 90px;
            margin-right: 12px;
          }
        }
        .select_setting {
          width: 100%;
          display: flex;
          justify-content: center;
          .select_setting_add {
            font-size: 14px;
            color: #1890ff;
            display: flex;
            align-items: center;
            user-select: none;
            margin-top: 10px;
            cursor: pointer;
            span {
              margin-left: 5px;
            }
          }
        }
      }
    }
    .layout_bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 50px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 60px;
    }
  }
</style>
