<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-26 16:18:08
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-12-13 16:29:46
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\components\combination.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicModal @register="registerModal" v-bind="$attrs" :title="title" width="40%" :useWrapper="false"
    :canFullscreen="false"  @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #detail="{model, field}">

      </template>
    </BasicForm>
  </BasicModal>
</template>

<script lang="ts" setup>
import { BasicModal, useModalInner } from '/@/components/Modal';
import { reactive, computed, nextTick, ref  } from 'vue';
import { BasicForm, useForm, FormSchema, } from '/@/components/Form/index';
import { projectFinishList, copySendAnswer } from '/@/api/dataReport/index'

// 声明Emits
const emit = defineEmits(['success', 'register']);

const projectList = ref()

const formSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '采集任务',
    field: 'sourceId',
    component: 'Select',
    componentProps: {
      options: projectList,
      fieldNames: {
        label: 'name',
        value: 'id',
      },
    },
    required: true,
  },
] 

// const formData = ref({})
const title = ref('一键报送')
//表单配置
const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
  // layout: 'vertical',
  schemas: formSchema,
  showActionButtonGroup: false,
});

const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data)=>{
  projectList.value = await projectFinishList({projectId: data.id})
  await resetFields();
  setModalProps({ confirmLoading: false });
  await setFieldsValue({ ...data });
});

//弹框确认
function handleSubmit() {
  validate().then( async () => {
    try {
      const values = await getFieldsValue();
      setModalProps({ confirmLoading: true });
      await copySendAnswer({
        sourceId: values.sourceId,
        targetId: values.id
      })
      emit('success');
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  })
}
</script>

<style lang="less" scoped>
</style>