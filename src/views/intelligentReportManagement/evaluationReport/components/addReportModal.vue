<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-26 16:18:08
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-12-08 18:03:02
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
import { addDirStorage, updateDirStorage } from '/@/api/intelligentReport'

// 声明Emits
const emit = defineEmits(['success', 'register']);

const maxCount = ref(1)
const formSchema: FormSchema[] = [
    {
      label: '',
      field: 'dirId',
      component: 'Input',
      show: false,
    },
    {
      label: '',
      field: 'dirStorageId',
      component: 'Input',
      show: false,
    },
    {
      label: '上传报告',
      field: 'storageId',
      component: 'JUpload',
      componentProps: {
        bizPath: 'storage',
        maxCount: 10,
        returnUrl: false,
        multiple: false,
        accept: '.pdf',
        maxSize: 20,
      },
      required: true,
      ifShow: ({values}) => {
        return !values.dirStorageId
      }
    },
    {
      label: '上传报告',
      field: 'storageId',
      component: 'JUpload',
      componentProps: {
        bizPath: 'storage',
        maxCount: 1,
        returnUrl: false,
        multiple: false,
        accept: '.pdf',
        maxSize: 20,
      },
      required: true,
      ifShow: ({values}) => {
        return !!values.dirStorageId
      }
    },
  ] 

// const formData = ref({})
const title = ref('上传报告')
//表单配置
const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
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
  if (!data.dirStorageId) {
    title.value = '上传报告'
    maxCount.value = 10
  } else {
    title.value = '编辑报告'
    maxCount.value = 1
    data.storageId = [{
      storageName: data.storageName,
      storageUrl: data.storageUrl,
      storageId: data.storageId,
    }]
    console.log('data', data)
  }
  await setFieldsValue({ ...data });
});

//弹框确认
function handleSubmit() {
  validate().then( async () => {
    try {
      const values = await getFieldsValue();
      if (values.storageId && values.storageId.length > 0) {
        values.storageId = values.storageId.map((item) => {
          return item.storageId
        }).join(',')
      }
      console.log('values', values)
      setModalProps({ confirmLoading: true });
      if (values.dirStorageId) {
        await updateDirStorage(values)
      } else {
        await addDirStorage(values)
      }
      emit('success');
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  })
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