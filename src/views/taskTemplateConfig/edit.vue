<template>
  <div class="supervision">
    <div class="header">
      <div class="back" @click="handleBack">
        <left-outlined />
      </div>
      <div class="steps">
        <a-steps v-model:current="currentStep">
          <a-step title="基本信息" />
          <a-step title="模板配置" />
        </a-steps>
        <div class="save" v-if="currentStep === 1">
          <!-- <a-button type="primary" @click="handleReset">重置</a-button> -->
          <a-button type="primary" @click="handleSave">保存</a-button>
        </div>
      </div>
    </div>
    <div class="content">
      <Baseinfo
        class="baseinfo"
        :template-data="{ citeType: templateData.citeType, templateName: templateData.templateName }"
        v-show="currentStep === 0"
        @next-step="handleNextStep"
      />
      <div class="designer" v-show="currentStep === 1">
        <EDesigner class="designer" ref="signer" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { LeftOutlined } from '@ant-design/icons-vue';
  import { EDesigner, pluginManager, deepClone, useShareStore } from '@coderlt/form-designer';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { addTemplate, editTemplate, getTemplateDetail } from '/@/api/taskTemplateConfig';
  import Baseinfo, { FormData } from './children/baseInfo.vue';
  import { TemplateDetail } from './index.data';
  import { customSchema, defaultSchema, defaultNoticeSchema } from './designerConfig';

  const route = useRoute();
  const router = useRouter();
  const { canvasScale } = useShareStore();
  const { close: closeTab } = useTabs();
  const defaultTemplateIds = ['111', '222', '333'];

  onMounted(() => {
    if (route.query.templateId) {
      templateData.value.templateId = route.query.templateId as string;
      pluginManager.setCurrentSchemaType([defaultTemplateIds.includes(templateData.value.templateId) ? '督办组件' : '督办自定义组件']);
      getDetail();
    } else {
      pluginManager.setCurrentSchemaType(['督办自定义组件']);
      const { schemas, script } = deepClone(customSchema);
      templateData.value.schemasJson = {
        script,
        schemas: formatSchema(schemas, false), // 编辑的时候去掉 schema
      };
    }
    // pluginManager.setCurrentSchemaType([]);
  });

  const getDetail = () => {
    getTemplateDetail({ templateId: templateData.value.templateId }).then((res) => {
      const { citeType, templateName, schemasJson } = res;
      const { schemas, script } = JSON.parse(schemasJson);

      templateData.value = {
        citeType,
        schemasJson: {
          script,
          schemas: formatSchema(schemas, false), // 编辑的时候去掉 schema
        },
        templateId: templateData.value.templateId,
        templateName,
      };
    });
  };

  const templateData = ref<TemplateDetail>({
    citeType: '',
    schemasJson: '',
    templateId: '',
    templateName: '',
  });

  const currentStep = ref(0);

  const signer = ref<InstanceType<typeof EDesigner> | null>(null);

  const handleNextStep = (values: FormData) => {
    templateData.value.citeType = values.citeType;
    templateData.value.templateName = values.templateName;

    currentStep.value += 1;
  };

  const handleReset = () => {
    templateData.value.schemasJson = defaultSchema;
    signer.value && signer.value.setData(defaultSchema, true);
  };

  const handleSave = async () => {
    if (signer.value) {
      templateData.value.schemasJson = deepClone(signer.value.getData());

      const { schemasJson, ...params } = templateData.value;
      const { schemas, script } = schemasJson;
      const data = {
        ...params,
        schemasJson: JSON.stringify({
          schemas: formatSchema(schemas, true),
          script,
        }),
      };

      console.log('data', JSON.parse(data.schemasJson));

      if (templateData.value.templateId) {
        await editTemplate(data);
      } else {
        await addTemplate(data);
      }
      handleBack();
    }
  };

  const handleBack = () => {
    router.go(-1);
    closeTab();
  };

  watch(
    () => currentStep.value,
    (val) => {
      if (val === 1) {
        canvasScale.value = 1.0;
        signer.value && signer.value.setData(templateData.value.schemasJson, true);
      }
    }
  );

  // 编辑的时候,元素固定的禁用,去掉通知; 保存的时候,元素开启编辑,添加通知
  const formatSchema = (schema: any, isSave: boolean) => {
    if (!schema.length) {
      return [];
    }

    const formConfig = schema[0].children[0];

    if (isSave) {
      formConfig.children.forEach((i) => {
        i.disabled = false;
      });

      formConfig.children.push(defaultNoticeSchema);
    } else {
      formConfig.children = formConfig.children.filter((i) => i.id !== 'customNotice');

      formConfig.children.forEach((i) => {
        i.disabled = i.forbid;
      });
    }

    return schema;
  };
</script>

<style lang="less" scoped>
  .supervision {
    padding: 10px;
    display: flex;
    flex-direction: column;
    height: 720px;
    background-color: #eff1f4;

    .header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      background-color: #fff;

      .back {
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }

      .steps {
        width: 50%;
      }

      .save {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .content {
      flex: 1;
      display: flex;
      overflow: hidden;
      margin-top: 15px;
      background-color: #fff;
      .baseinfo {
        width: 50%;
        position: relative;
        margin: 0 auto;
      }

      /deep/ .designer {
        position: relative;
        flex: 1;
        width: 100%;

        // 高度自适应
        .epic-edit-range {
          height: auto !important;
          max-height: 100% !important;
          .box-border {
            height: auto !important;
          }
        }

        .epic-header-container,
        .epic-header-toolbar,
        .epic-action-bar,
        .edit-toolbar,
        .actions-container .action-item:nth-child(3) {
          display: none;
        }
      }
    }
  }
</style>
