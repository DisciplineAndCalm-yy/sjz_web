<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-26 16:18:08
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-09 11:13:25
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\components\combination.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <BasicForm @register="registerForm">
      <template #scoreRuleJson="{model, field}">
        <div class="rule-content">
          <div class="rule-select">
            <div class="rule-value">
              <a-tag v-for="item in selectedList" :key="item.value" color="processing" @click="addItem(item)">{{ item.label }}</a-tag>
            </div>
            <div class="rule-symbol">
              <a-tag v-for="item in symbollist" :key="item.value" color="processing" @click="addItem(item)">{{ item.label }}</a-tag>
              <a-tag color="processing" @click="addNum">常数</a-tag>
              <a-button size="small" type="primary" danger ghost @click="clearTag" :disabled="props.disabled">清空</a-button>
            </div>
          </div>
          <a-divider />
          <div class="rule-result">
            <a-tag :disabled="props.disabled" v-for="item,index in scoreRuleJson" :key="item.value" :closable="!props.disabled" @close="closeTag(index)">{{ item.label }}</a-tag>
            <a-input
              :disabled="props.disabled"
              v-if="inputObj.visible"
              v-model:value="inputObj.value"
              ref="inputRef"
              type="number"
              size="small"
              :style="{ width: '78px' }"
              @blur="handleInputConfirm"
              @keyup.enter="handleInputConfirm"
            />
          </div>
        </div>
      </template>
      <template #childConfigRule="{model}">
        <div class="type-content">
          <efficiency v-show="model.childConfigType == 'efficacy'" v-model="efficacyValue" :disabled="props.disabled" ref="efficiencyRef"></efficiency>
          <!-- <deduction v-show="model.childConfigType == 'deduct'" v-model="deductionValue" :disabled="props.disabled" ref="deductionRef"></deduction> -->
          <tierDiff v-show="model.childConfigType == 'layer'" v-model="tierDiffValue" :disabled="props.disabled" ref="tierDiffRef"></tierDiff>
        </div>
      </template>
    </BasicForm>
  </div>
</template>

<script lang="ts" setup>
// import { BasicModal, useModalInner } from '/@/components/Modal';
import { reactive, computed, nextTick, ref, watch, onMounted, unref } from 'vue';
import { BasicForm, useForm, FormSchema, } from '/@/components/Form/index';
import { queryMonitor, projectQueryMonitor, getQuestionConfigType } from '/@/api/indicatorManagement/index'
import efficiency from './efficiency.vue';
import tierDiff from './tierDiff.vue';
import deduction from './deduction.vue';

// 声明props
const props = defineProps(['modelValue', 'disabled', 'modalType'])
const emit = defineEmits(['update:modelValue'])

const selectedList = ref([])  // 已选的检测项列表
const symbollist = ref([
  {value: '+', label: '+'},
  {value: '-', label: '-'},
  {value: '*', label: '*'},
  {value: '/', label: '/'},
  {value: '(', label: '('},
  {value: ')', label: ')'},
])  // 符号列表
const scoreRuleJson = ref([])   // 规则列表
const monitorList = ref([]) // 检测项列表
const inputObj = reactive({
  value: undefined,
  visible: false
})    // 输入的常数
const formSchema: FormSchema[] = [
  {
    label: '选择监测项',
    field: 'monitorItem',
    component: 'Select',
    componentProps: {
      options: monitorList,
      fieldNames: {
        label: 'description',
        value: 'questionCode',
      },
      mode: 'multiple',
      onChange: changeMonitor
    },
    required: true,
    dynamicDisabled: () => {
      return props.disabled
    },
  },
  {
    label: '计分规则',
    component: 'Select',
    field: 'scoreRuleJson',
    slot: 'scoreRuleJson',
  },
  {
    label: '计分方法',
    field: 'childConfigType',
    component: 'ApiSelect',
    componentProps: {
      api: getQuestionConfigType,
      labelField: 'dictName',
      valueField: 'dictCode',
      allowClear: false,
      params: {
        isAll: 0,
      }
      // onchange: changeType
    },
    defaultValue: 'efficacy',
    required: true,
    dynamicDisabled: () => {
      return props.disabled
    },
  },
  {
    label: '',
    component: 'Input',
    field: 'childConfigRule',
    colSlot: 'childConfigRule',
    
  },
]

const efficacyValue = ref()
const deductionValue = ref()
const tierDiffValue = ref()
let efficiencyRef = ref()
let deductionRef = ref()
let tierDiffRef = ref()
const inputRef = ref();

watch(
  () => props.modelValue,
  (val, oVal) => {
    console.log('出发了model value 监测点组合', val)
    // if (!oVal) {
    //   setValue(val || {})
    // }
    setValue(val || {})
    // emit('update:modelValue', val)
  },
  {
    deep: true,
  }
)

//表单配置
const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
  schemas: formSchema,
  showActionButtonGroup: false,
});

/**
 * 初始化
 */
async function setValue(val) {
  await resetFields();
  if (val.parentId) {
    let list
    if (props.modalType == 'indicator') {
      list = await queryMonitor({indicatorId: val.parentId, quId: val.questionId})
    } else if (props.modalType == 'project') {
      list = await projectQueryMonitor({indicatorId: val.parentId, quId: val.questionId})
    }
    monitorList.value = list
    if (val.monitorItem) {
      let selectedValue = val.monitorItem instanceof Array ? val.monitorItem : val.monitorItem.split(',')
      val.monitorItem = selectedValue
      selectedList.value = selectedValue.map(item => {
        console.log('monitorlist.value', monitorList.value)
        console.log('monitorlist.value -item', item)
        let itemObj = monitorList.value.find(ele => ele.questionCode == item) || {}
        console.log('itemobj', itemObj)
        return {
          value: `${item}`,
          label: itemObj.description
        }
      })
    } else {
      selectedList.value = []
    }
  }
  if (val.childConfigType && val.childConfigRule) {
    if (val.childConfigType == 'efficacy') {
      efficacyValue.value = JSON.parse(JSON.stringify(val.childConfigRule))
      // deductionValue.value = {unit: val.unit}
      tierDiffValue.value = {}
    }
    // if (val.childConfigType == 'deduct') {
    //   deductionValue.value = JSON.parse(JSON.stringify(val.childConfigRule))
    //   efficacyValue.value = {unit: val.unit}
    //   tierDiffValue.value = {}
    // }
    if (val.childConfigType == 'layer') {
      // console.log('val,chiled', val.childConfigRule)
      tierDiffValue.value = JSON.parse(JSON.stringify(val.childConfigRule))
      efficacyValue.value = {}
      // deductionValue.value = {}
    }
  } else {
    efficacyValue.value = {}
    // deductionValue.value = {unit: val.unit}
    tierDiffValue.value = {}
  }
  scoreRuleJson.value = JSON.parse(JSON.stringify(val.scoreRuleJson || []))
  console.log('val', val)
  await setFieldsValue({...val})
}
/**
 * 添加常数
 */
function addNum() {
  if (!props.disabled) {
    inputObj.visible = true;
    nextTick(() => {
      inputRef.value.focus();
    });
  }
}
/**
 * 更改检测项
 */
function changeMonitor(value) {
  console.log('value', value)
  let selectedValue = value
  selectedList.value = selectedValue.map(item => {
    let itemObj = monitorList.value.find(ele => ele.questionCode == item)
    return {
      value: `${item}`,
      label: itemObj.description
    }
  })
}

/**
 * 添加计分规则
 */
function addItem(item) {
  if (!props.disabled) {
    scoreRuleJson.value.push({...item})
    // setFieldsValue({scoreRuleJson: scoreRuleJson.value})
  }
}
/**
 * 输入常数完成回调
 */
function handleInputConfirm() {
  console.log('inputvalue', inputObj.value )
  inputObj.visible = false;
  
  if (inputObj.value || inputObj.value === 0) {
    scoreRuleJson.value.push({
      value: inputObj.value,
      label: inputObj.value
    })
    // setFieldsValue({scoreRuleJson: scoreRuleJson.value})
    inputObj.value = undefined
  }
}
/**
 * 清空tag
 */
 function clearTag() {
  scoreRuleJson.value = []
  // setFieldsValue({scoreRuleJson: scoreRuleJson.value})
}
/**
 * 删除tag
 */
function closeTag(index) {
  scoreRuleJson.value.splice(index, 1)
  // setFieldsValue({scoreRuleJson: scoreRuleJson.value})
}

/**
 * 校验数值
 */
function validateValue() {
  // return new Promise<void>((resolve, reject) => {
  return validate().then(async () => {
    await setFieldsValue({scoreRuleJson: scoreRuleJson.value})
    const values = await getFieldsValue()
    if (values.childConfigType == 'efficacy') {
      await efficiencyRef.value.validateValue()
      values.childConfigRule = {...efficacyValue.value}
    }
    if (values.childConfigType == 'deduct') {
      await deductionRef.value.validateValue()
      values.childConfigRule = { ...deductionValue.value}
    }
    if (values.childConfigType == 'layer') {
      await tierDiffRef.value.validateValue()
      values.childConfigRule = {...tierDiffValue.value}
    }
    emit('update:modelValue', values)
  })
  // })
}
defineExpose({validateValue, setValue})
</script>

<style lang="less" scoped>
.rule-content {
  min-height: 200px;
  border: 1px solid #d9d9d9;
  padding: 10px;
  .rule-select {
    .rule-value {
      margin-bottom: 10px;
    }
    .ant-tag {
      cursor: pointer;
    }
  }
  .rule-result {
    
  }
}
.type-content {
  margin-left: 7%;
}
</style>