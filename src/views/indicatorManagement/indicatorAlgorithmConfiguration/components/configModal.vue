<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-26 16:18:08
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-23 11:44:50
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\components\combination.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicModal @register="registerModal" v-bind="$attrs" title="配置" width="60%" :useWrapper="false"
    :canFullscreen="false"  @ok="handleSubmit" :showOkBtn="!props.disabled" :showCancelBtn="!props.disabled">
    <BasicForm @register="registerForm">
      <!-- 功效法 -->
      <template #efficacy="{model}">
        <div class="type-content" v-show="model.quConfigType == 'efficacy'">
          <efficiency v-model="efficacyValue" :disabled="props.disabled" ref="efficiencyRef"></efficiency>
        </div>
      </template>
      <template #deduct="{model}">
        <div class="type-content" v-show="model.quConfigType == 'deduct'">
          <deduction v-model="deductionValue" :disabled="props.disabled" ref="deductionRef"></deduction>
        </div>
      </template>
      <template #layer="{model}">
        <div class="type-content" v-show="model.quConfigType == 'layer'">
          <tierDiff v-model="tierDiffValue" :disabled="props.disabled" ref="tierDiffRef"></tierDiff>
        </div>
      </template>
      <template #monitor="{model}">
        <div class="type-content" v-show="model.quConfigType == 'monitor'">
          <combination v-model="combinationValue" :disabled="props.disabled" ref="combinationRef" :modalType="props.modalType"></combination>
        </div>
      </template>
    </BasicForm>
    <!-- <div class="select-type">
      选择计分方法：
      <a-select v-model:value="quConfigType">
        <a-select-option v-for="item in typeList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </div>
    <div class="type-content">

    </div> -->
  </BasicModal>
</template>

<script lang="ts" setup>
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicForm, useForm, FormSchema, } from '/@/components/Form/index';
import { reactive, computed, nextTick, ref  } from 'vue';
import { getQuestionConfigType, saveQuRule, queryQuRule, projectSaveQuRule, projectQueryQuRule } from '/@/api/indicatorManagement/index'
import efficiency from './efficiency.vue';
import tierDiff from './tierDiff.vue';
import deduction from './deduction.vue';
import combination from './combination.vue';
import { cloneDeep } from 'lodash-es';

// 声明Emits
const emit = defineEmits(['success', 'register']);
const props = defineProps(['disabled', 'modalType'])
const quConfigType = ref()
const typeList = ref([])
// const formDisabled = ref(false)

const formSchema: FormSchema[] = [
  {
    label: '',
    field: 'questionId',
    component: 'Input',
    show: false,
  },
  {
    label: '',
    field: 'indicatorId',
    component: 'Input',
    show: false,
  },
  {
    label: '计分方法',
    field: 'quConfigType',
    component: 'ApiSelect',
    componentProps: {
      api: getQuestionConfigType,
      labelField: 'dictName',
      valueField: 'dictCode',
      allowClear: false,
      onchange: changeType,
    },
    dynamicDisabled: () => {
      return props.disabled
    },
    defaultValue: 'deduct',
    required: true,
  },
  {
    label: '',
    field: 'efficacy',
    component: 'Input',
    colSlot: 'efficacy',
    colProps: { span: 24 },
    // ifShow: ({ values }) => {
    //   return values.quConfigType == 'efficacy'
    // }
  },
  {
    label: '',
    field: 'deduct',
    component: 'Input',
    colSlot: 'deduct',
    colProps: { span: 24 },
    // ifShow: ({ values }) => {
    //   return values.quConfigType == 'deduct'
    // }
  },
  {
    label: '',
    field: 'layer',
    component: 'Input',
    colSlot: 'layer',
    colProps: { span: 24 },
    // ifShow: ({ values }) => {
    //   return values.quConfigType == 'layer'
    // }
  },
  {
    label: '',
    field: 'monitor',
    component: 'Input',
    colSlot: 'monitor',
    // ifShow: ({ values }) => {
    //   return values.quConfigType == 'monitor'
    // }
  },
]
const efficacyValue = ref()
const deductionValue = ref()
const tierDiffValue = ref()
const combinationValue = ref()
let efficiencyRef = ref()
let deductionRef = ref()
let tierDiffRef = ref()
let combinationRef = ref()

//表单配置
const [registerForm, { resetFields, setFieldsValue, validate, }] = useForm({
  schemas: formSchema,
  showActionButtonGroup: false,
});

const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data)=>{
  await resetFields();
  setModalProps({ confirmLoading: false });
  data.questionId = data.id
  data.indicatorId = data.parentId
  let res 
  if (props.modalType == 'indicator') {
    res = await queryQuRule({quConfigType: data.configType, quId: data.questionId})
  } else if (props.modalType == 'project') {
    res = await projectQueryQuRule({quConfigType: data.configType, quId: data.questionId})
  }
  if (res) {
    data = { 
      quConfigType: data.quConfigType,
      indicatorId: data.indicatorId,
      questionId: data.questionId, 
      unit: data.unit, 
      parentId: data.parentId,
      ...res,
    }
    // console.log('formdisabled.value', formDisabled.value)
  }
  if (data.quConfigType) {
    console.log('data---', data)
    // TODO 设置修改方法时，方法被替换
    if (data.quConfigType == 'efficacy') {
      efficacyValue.value = cloneDeep(data)
      deductionValue.value = {unit: data.unit}
      tierDiffValue.value = {}
      combinationValue.value = {parentId: data.parentId, questionId: data.questionId}
    } else if (data.quConfigType == 'deduct') {
      deductionValue.value = cloneDeep(data)
      efficacyValue.value = {}
      tierDiffValue.value = {}
      combinationValue.value = {parentId: data.parentId, questionId: data.questionId}
    } else if (data.quConfigType == 'layer') {
      tierDiffValue.value = cloneDeep(data)
      efficacyValue.value = {}
      deductionValue.value = {unit: data.unit}
      combinationValue.value = {parentId: data.parentId, questionId: data.questionId}
    } else if (data.quConfigType == 'monitor') {
      combinationValue.value = cloneDeep(data)
      efficacyValue.value = {}
      deductionValue.value = {unit: data.unit}
      tierDiffValue.value = {}
    } else {
      efficacyValue.value = {}
      deductionValue.value = {unit: data.unit}
      tierDiffValue.value = {}
      combinationValue.value = {parentId: data.parentId, questionId: data.questionId}
    }
  } else {
    efficacyValue.value = {}
    deductionValue.value = {unit: data.unit}
    tierDiffValue.value = {}
    combinationValue.value = {parentId: data.parentId, questionId: data.questionId}
  }
  await setFieldsValue({...data});
});

function changeType(value) {
  
}

//弹框确认
async function handleSubmit() {
  try {
    let values = await validate();
    let params = {
      ...values
    }
    console.log('cofigmodal submit vlaues', values)
    setModalProps({ confirmLoading: true });
    // console.log('effe', efficacyValue.value)
    if (values.quConfigType) {
      if (values.quConfigType == 'efficacy') {
        await efficiencyRef.value.validateValue()
        // params = {...efficacyValue.value}
        params = cloneDeep(efficacyValue.value)
      }
      if (values.quConfigType == 'deduct') {
        await deductionRef.value.validateValue()
        // params = { ...deductionValue.value}
        params = cloneDeep(deductionValue.value)
      }
      if (values.quConfigType == 'layer') {
        await tierDiffRef.value.validateValue()
        // params = {...tierDiffValue.value}
        params = cloneDeep(tierDiffValue.value)
      }
      if (values.quConfigType == 'monitor') {
        await combinationRef.value.validateValue()
        // params = {...combinationValue.value}
        params = cloneDeep(combinationValue.value)
      }
    }
    params = { ...params, ...values,}
    console.log('params', params)
    if (props.modalType == 'indicator') {
      await saveQuRule(params)
    } else if (props.modalType == 'project') {
      await projectSaveQuRule(params)
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
.select-type {

}
.type-content {
  display: flex;
  justify-content: center;
  > * {
    width: 85%;
  }
}
</style>