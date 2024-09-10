<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-26 16:18:08
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-09 10:16:11
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\components\combination.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <BasicForm @register="registerForm">
      <template #detail="{model, field}">
        <a-row justify="center" class="row">
          <a-col v-if="model['deductAccord'] == 'case' && model['deductMethod']" class="input-box" >
            <a-input type="number" v-model:value="deviateVal" :disabled="props.disabled">
              <template #addonBefore>超过</template>
              <template #addonAfter>工单案例</template>
            </a-input>
            <a-input type="number" v-model:value="buttonVal" :disabled="props.disabled">
              <template #addonBefore>扣</template>
              <template #addonAfter>{{ model['deductMethod'] == 'grade' ? '分' : '%' }}</template>
            </a-input>
          </a-col>
          <a-col v-if="model['deductAccord'] == 'positiveDeviate' && model['deductMethod']" class="input-box" >
            <a-input type="number" v-model:value="deviateVal" :disabled="props.disabled">
              <template #addonBefore>偏离</template>
              <template #addonAfter>{{ unit }}</template>
            </a-input>
            <a-input type="number" v-model:value="buttonVal" :disabled="props.disabled">
              <template #addonBefore>扣</template>
              <template #addonAfter>{{ model['deductMethod'] == 'grade' ? '分' : '%' }}</template>
            </a-input>
          </a-col>
          <a-col v-if="model['deductAccord'] == 'negativeCase' && model['deductMethod']" class="input-box">
            <a-input type="number" v-model:value="deviateVal" :disabled="props.disabled">
              <template #addonBefore>偏离</template>
              <template #addonAfter>{{ unit }}</template>
            </a-input>
            <a-input type="number" v-model:value="buttonVal" :disabled="props.disabled">
              <template #addonBefore>扣</template>
              <template #addonAfter>{{ model['deductMethod'] == 'grade' ? '分' : '%' }}</template>
            </a-input>
          </a-col>
        </a-row>
        <!-- <div>{{ model['c'] }}</div>
        <div></div>
        <div></div> -->
      </template>
    </BasicForm>
  </div>
</template>

<script lang="ts" setup>
// import { BasicModal, useModalInner } from '/@/components/Modal';
import { reactive, computed, nextTick, ref, watch, onMounted } from 'vue';
import { BasicForm, useForm, FormSchema, } from '/@/components/Form/index';
import { getDeductMethod, getDeductAccord } from '/@/api/indicatorManagement/index'
import { cloneDeep } from 'lodash-es';


// 声明props
const props = defineProps(['modelValue', 'disabled'])
const emit = defineEmits(['update:modelValue'])
const buttonVal = ref()
const deviateVal = ref()
const unit = ref('')

const formSchema: FormSchema[] = [
  {
    label: '止扣值配置',
    field: 'deductVal',
    component: 'InputNumber',
    componentProps: {
    },
    required: true,
    dynamicDisabled: () => {
      return props.disabled
    },
  },
  {
    label: '扣分方法',
    field: 'deductMethod',
    component: 'ApiSelect',
    componentProps: {
      api: getDeductMethod,
      labelField: 'dictName',
      valueField: 'dictCode',
      allowClear: false,
    },
    required: true,
    dynamicDisabled: () => {
      return props.disabled
    },
  },
  {
    label: '扣分依据',
    field: 'deductAccord',
    component: 'ApiSelect',
    componentProps: {
      api: getDeductAccord,
      labelField: 'dictName',
      valueField: 'dictCode',
      allowClear: false,
      onChange: () => {
        buttonVal.value = null
        deviateVal.value = null
      }
    },
    required: true,
    dynamicDisabled: () => {
      return props.disabled
    },
    
  },
  {
    label: '',
    component: 'Input',
    field: 'detail',
    slot: 'detail',
    dynamicRules: ({ values }) => {
      console.log('values:-----', values);
      //需要return
      return [
        {
          //默认开启表单检验
          required: true,
          validator: (_, value) => {
            //需要return 一个Promise对象
            return new Promise((resolve, reject) => {
              if (values.deductAccord && values.deductMethod) {
                if (buttonVal.value && deviateVal.value) {
                  resolve()
                } else {
                  reject('请填写完整')
                }
              }
              resolve();
            });
          },
        },
      ];
    },
    // rules: [
    //   {
    //     validator: (rule, value, callback) => {
    //       if (!value) {
    //         callback('请输入推送名称')
    //       } else {
    //         callback()
    //       }
    //     }
    //   }
    // ],
  },
]

watch(
  () => props.modelValue,
  (val) => {
    console.log('出发了model value 扣分法', val)
    setValue(val || {})
    // emit('update:modelValue', val)
  },
  {
    deep: true,
  }
)

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

/**
 * 初始化
 */
async function setValue(val) {
  await resetFields();
  if (val) {
    console.log('val', val)
    deviateVal.value = val.deviateVal
    buttonVal.value = val.buttonVal
    unit.value = val.unit
  } else {
    deviateVal.value = undefined
    buttonVal.value = undefined
  }
  await setFieldsValue({...val})
}


/**
 * 校验数值
 */
function validateValue() {
  // return new Promise<void>((resolve, reject) => {
    return validate().then(async () => {
      const values = await getFieldsValue()
      values.buttonVal = buttonVal.value
      values.deviateVal = deviateVal.value
      values.unit = unit.value
      console.log('ssss', values)
// 
      emit('update:modelValue', cloneDeep(values))
    })

  // })
}
defineExpose({validateValue, setValue})
</script>

<style lang="less" scoped>
// .input-number {
//   max-width: 200px;
// }
.input-box {
  // background: yellow;
  display: flex;
  justify-content: space-around;
  margin-left: 20%;
  > * {
    max-width: 200px;
  }
}
</style>