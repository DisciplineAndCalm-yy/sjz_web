<template>
  <div class="baseinfo">
    <BasicForm @register="registerForm" @submit="handleSubmit" style="margin-top: 50px; margin-left: 50px" />
  </div>
</template>

<script lang="ts" setup>
  import { watch } from 'vue';
  import { useForm, BasicForm, FormSchema } from '/@/components/Form';
  import { BaseInfo, citeTypeOptions } from '../index.data';

  export interface FormData {
    templateName: string;
    citeType: string;
  }

  const props = withDefaults(defineProps<{ templateData: BaseInfo }>(), {
    templateData: () => ({
      citeType: '',
      templateName: '',
    }),
  });

  const emit = defineEmits<{
    (event: 'nextStep', data: FormData): void;
  }>();

  const formSchemas: FormSchema[] = [
    {
      label: '模版名称',
      field: 'templateName',
      component: 'Input',
      labelWidth: 150,
      labelLength: 3,
      required: true,
    },
    {
      label: '引用流程类型',
      field: 'citeType',
      component: 'Select',
      labelWidth: '150px',
      required: true,
      componentProps: {
        options: citeTypeOptions,
      },
    },
  ];

  const [registerForm, { setFieldsValue }] = useForm({
    schemas: formSchemas,
    autoSubmitOnEnter: false,
    showResetButton: false,
    submitButtonOptions: { text: '下一步', preIcon: '' },
    actionColOptions: { span: 17 },
  });

  function handleSubmit(values: FormData) {
    if (Object.keys(values).length) {
      emit('nextStep', values);
    }
  }

  watch(
    () => props.templateData,
    (val: BaseInfo) => {
      setFieldsValue(val);
    },
    {
      deep: true,
    }
  );
</script>

<style lang="less" scoped></style>
