<template>
  <BasicModal @register="register" v-bind="$attrs" title="任务" @ok="handleSubmit" width="40%" @cancel="cancelFn">
    <EBuilder ref="EBuilderref" :pageSchema="pageSchema" />
  </BasicModal>
</template>
<script lang="ts" setup>
import { ref, unref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { useMessage } from '/@/hooks/web/useMessage';
import { EBuilder, PageManager } from '@coderlt/form-designer';
import { superviseEditView, superviseAdd, superviseEdit } from '/@/api/supervise/index'

const isUpdate = ref(true);
const templateId = ref('');
const supId = ref('');
const pageSchema = ref<any>({});
const EBuilderref = ref();

// 声明emit
const emit = defineEmits(['success', 'setModalHidden'])



// 弹窗声明
const [register, { openModal, closeModal, setModalProps }] = useModalInner(async (data) => {
  // 接收参数
  console.log('11111', data)
  pageSchema.value = JSON.parse(data.pageSchema)
  templateId.value = data.templateId
  supId.value = data.supId

  //关闭loading
  setModalProps({ confirmLoading: false });


  // // 赋值
  isUpdate.value = !!data?.isUpdate;

  // // 判断是否更新？即-编辑回显 | unref() 如果参数是一个ref则返回它的value，否则返回参数本身
  if (unref(isUpdate)) {
    const params = { supId: data.supId, templateId: data.templateId }

    //请求数据+回显
    await setResult(params)
  }
})

//查询返回数据
const setResult = (params) => {
  superviseEditView(params).then(res => {

    const data = res.formJsonObj;
    console.log('data', data, data.responsibleDepart)
    // return
    if (data.responsibleDepart) {
      data.responsibleDepart = data.responsibleDepart.split(',')
    }

    if (data.leadDepart) {
      data.leadDepart = data.leadDepart.split(',')
    }
    console.log('data', data)
    setTimeout(() => {
      // 表单赋值
      EBuilderref.value!.setData(data)
    }, 300)

  })
}


//表单提交事件
const handleSubmit = async () => {
  try {
    if (EBuilderref.value) {
      console.log('EBuilderref', await EBuilderref.value.validate());
    }
    const values = await EBuilderref.value.validate();
    console.log('values', values)
    setModalProps({ confirmLoading: true });

    const fn = unref(isUpdate) == true ? superviseEdit : superviseAdd

    let formData = JSON.parse(JSON.stringify(values))

    //附件ids字符串
    if (formData.attachments) {
      const storageIds = formData.attachments.map(item => item.storageId).join(',')
      formData.attachments = storageIds
    }


    //修改责任部门list为逗号隔开的字符串
    if (formData.responsibleDepart) {
      formData.responsibleDepart = formData.responsibleDepart.join(',')
    }

    //修改牵头部门list为逗号隔开的字符串
    if (formData.leadDepart) {
      formData.leadDepart = formData.leadDepart.join(',')
    }


    console.log('formData', formData)
    //提交表单
    let params = {
      supId: "",
      formJsonObj: formData,
      templateId: templateId.value
    }

    if (unref(isUpdate)) {
      params.supId = unref(supId)
    }

    // 请求
    await fn(params)

    //关闭弹窗
    closeModal();
    //刷新列表
    emit('success');
    // 销毁弹窗
    emit('setModalHidden', false)
  } finally {
    setModalProps({ confirmLoading: false });
  }
}

//关闭弹窗
const cancelFn = () => {
  emit('setModalHidden', false)
}

</script>