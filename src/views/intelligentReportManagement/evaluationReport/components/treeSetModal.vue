<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-26 16:18:08
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-11-28 17:36:16
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
import { addDir, editDir } from '/@/api/intelligentReport'

// 声明Emits
const emit = defineEmits(['success', 'register']);


const formSchema: FormSchema[] = [
    {
      label: '',
      field: 'id',
      component: 'Input',
      show: false,
    },
    {
      label: '',
      field: 'parentId',
      component: 'Input',
      show: false,
    },
    {
      label: '目录名称',
      field: 'dirName',
      component: 'Input',
      componentProps: {
        maxlength: 20
      },
      required: true,
      ifShow: ({values}) => {
        return values.id
      },
    },
    {
      label: '下级目录名称',
      field: 'dirName',
      component: 'Input',
      componentProps: {
        maxlength: 20
      },
      required: true,
      ifShow: ({values}) => {
        return !values.id
      },
    },
  ] 

const formData = ref({})
const title = ref('添加下级目录')
//表单配置
const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
  // layout: 'vertical',
  schemas: formSchema,
  showActionButtonGroup: false,
  // labelCol: {
  //   offset: 2,
  // },          
  // wrapperCol: {
  //   offset: 2,
  //   sm: 20,
  // }
});

const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data)=>{
  await resetFields();
  setModalProps({ confirmLoading: false });
  formData.value = {...data}
  if (data.id) {
    title.value = '编辑目录'
  } else {
    title.value = '添加下级目录'
  }
  await setFieldsValue({ ...data });
});

//弹框确认
async function handleSubmit() {
  try {
    const values = await validate();
    setModalProps({ confirmLoading: true });
    if (values.id) {
      await editDir(values)
    } else {
      await addDir(values)
    }
    emit('success');
    closeModal();
    //刷新列表
  } finally {
    setModalProps({ confirmLoading: false });
  }
}
</script>

<style lang="less" scoped>
// .input-number {
//   max-width: 200px;
// }
.input-box {
  // background: yellow;
  display: flex;
  justify-content: space-around;
  > * {
    max-width: 300px;
  }
}
</style>