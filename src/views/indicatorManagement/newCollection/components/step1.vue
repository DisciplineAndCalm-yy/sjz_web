<template>
  <a-card style="min-height: 400px">
    <BasicForm @register="registerForm">
      <template #templateId="{ model, field }">
        <a-select v-model:value="model[field]" :allowClear="false" show-search :filter-option="filterOption" placeholder="请选择指标体系"
          optionFilterProp="label">
          <a-select-option :value="item.id" v-for="item in templateList" :key="item.id" :label="item.name">{{ item.name
          }}</a-select-option>
        </a-select>
      </template>
    </BasicForm>
  </a-card>
</template>
<script lang="ts" setup>
import { ref, unref, defineExpose } from 'vue';
import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
import { queryTemplateChooseList, queryMonitorTypeList, projectAdd, projectEdit } from '/@/api/indicatorManagement/index';
import { dispose } from 'echarts';
import { object } from 'vue-types';
const isUpdate = ref(true);

const templateList = ref([])  // 指标体系列表
// 声明colums
const schemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: '采集id',
    show: false
  },
  {
    field: 'name',
    component: 'Input',
    label: '任务名称',
    // required: true,
    // componentProps: {
    //   placeholder: '请输入',
    // },
    //支持正则表达式pattern 和 自定义提示信息 message
    rules: [{ required: true, message: '请输入' }, { min: 1, max: 50, message: '长度为1-50字', trigger: 'blur' }]
  },
  {
    label: '选择指标体系',
    field: 'templateId',
    slot: 'templateId',
    component: 'ApiSelect',
    required: true,
    
    // componentProps: {
    //   // mode: 'multiple',
    //   api: queryTemplateChooseList,
    //   numberToString: true,
    //   labelField: 'name',
    //   valueField: 'id',
    // },
  },
  {
    label: '采集范围',
    field: 'monitorType',
    required: true,
    component: 'JDictSelectTag',
    componentProps: () => {
      return {
        dictCode: 'monitor_type',
      };
    },
  },
];

//查询指标列表
const getTemplateChooseList = async ()=>{
  const list = await queryTemplateChooseList()
  templateList.value = list
}

getTemplateChooseList()

// 表单声明、配置
const [registerForm, { setProps, setFieldsValue, resetFields, validate }] = useForm({
  labelWidth: 150,
  schemas,
  size: 'large',
  // disabled: true,
  autoSetPlaceHolder: true, //自动设置表单内组件的 placeholder，自定义组件需自行实现
  rulesMessageJoinLabel: true, //如果表单项有校验，会自动生成校验信息，该参数控制是否将字段中文名字拼接到自动生成的信息后方
  actionColOptions: {
    span: 24,
  },
  // autoAdvancedLine: 1,
  showActionButtonGroup: false,
  showSubmitButton: true,
  fieldMapToTime: [
    //将表单内时间区域的值映射成 2 个字段
    ['time', ['startTime', 'endTime'], 'YYYY-MM-DD'],
  ],
});


// 回显
const setFields = (data) => {
  console.log('data', data)
  setFieldsValue(data)
}

//过滤规则
const filterOption = (input: string, option: any) => {
  return option.label.indexOf(input) >= 0;
};

//提交
const handleSubmit = async () => {
  try {
    const values = await validate();
    console.log('values', values)

    const fn = values.id ? projectEdit : projectAdd
    //提交表单
    values.id = await fn(values)
    console.log('values----', values)
    return values
  }
  finally {

  }
}

// 输出组件的方法，让外部组件可以调用
defineExpose({
  handleSubmit,
  setFields
})
</script>
<style scoped>
/** 时间和数字输入框样式 */
:deep(.ant-input-number) {
  width: 100%;
}

:deep(.ant-picker) {
  width: 100%;
}
</style>