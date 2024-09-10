<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :width="600" :useWrapper="false" :canFullscreen="false" title="政策发布确认" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  // import { transmitFormSchema } from './data';
  import { auditPolicy, batchAuditPolicy } from '/@/api/policy/policy'
  import { FormSchema } from '/@/components/Table';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  // 
  const formSchema: FormSchema[] = [
    {
      label: '',
      field: 'auditId',
      component: 'Input',
      show: false,
    },
    {
      label: '',
      field: 'type',
      component: 'Input',
      show: false,
    },
    {
      label: '确认结果',
      field: 'auditResult',
      component: 'Select',
      componentProps: {
        options: [
          {value: '1', label: '通过'},
          {value: '0', label: '驳回'},
        ]
      },
      rules: [
        {
          required: true,
          message: '请选择确认结果',
        },
      ]
    },
    {
      label: '驳回原因',
      field: 'auditOpinion',
      component: 'InputTextArea',
      ifShow: ({values}) => {
        return values.auditResult === '0'
      },
      rules: [
        {
          required: true,
          message: '请输入驳回原因',
        },
      ]
    }
  ] 
  //表单配置
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    schemas: formSchema,
    showActionButtonGroup: false,
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false });
    //查询获取表单数据
    // const res = await getUserAgent({ userName: data.userName });
    // data = res.result ? res.result : data;
    // console.log('data', data)
    //表单赋值
    await setFieldsValue({ ...data });
  });
  //表单提交事件
  async function handleSubmit() {
    try {
      const values = await validate();
      console.log('values', values)
      setModalProps({ confirmLoading: true });
      //提交表单
      // await saveOrUpdateAgent(values);
      if (values.type == 1) {
        await auditPolicy(values)
      } else {
        values.auditIds = values.auditId
        await batchAuditPolicy(values)
      }
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
