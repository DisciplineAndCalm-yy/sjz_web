<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-08-21 17:04:21
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-05 18:27:37
 * @FilePath: \yst-city-qixian-PolicyRecommendationSystem-web\src\views\precisePush\components\companyModal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <BasicTable @register="registerTable" @edit-end="handleEditEnd">
      <template #form-way>
        <a-select v-model:value="way" @change="changeWay" :disabled="props.disabled">
          <a-select-option v-for="item in wayList" :key="item.dictCode" :value="item.dictCode">{{ item.dictName }}</a-select-option>
        </a-select>
      </template>
      <template v-slot:bodyCell="{ text, column, record }">
        <span v-if="props.disabled">{{ text }}</span>
      </template>
    </BasicTable>
    <p v-if="way == 1 || way == 2">配置满分条件后，若采集数据结果到达满分条件，该指标直接得满分</p>
    <p v-if="way == 3">若采集结果&gt;阈值上限，得满分；若采集结果&lt;阈值下限，得零分；</p>
    <p v-if="way == 4">若采集结果&gt;阈值上限，得零分；若采集结果&lt;阈值下限，得满分；</p>
  </div>
</template>
<script lang="ts" setup>
// import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicTable, BasicColumn, FormSchema, useTable } from '/@/components/Table';
import { reactive, computed, nextTick, ref, watch, onBeforeMount} from 'vue';
import { getEfficacyMethod, getGreaterRule, getLessRule } from '/@/api/indicatorManagement/index'
import { useMessage } from '/@/hooks/web/useMessage';
import { cloneDeep } from 'lodash-es';

// 声明props
const props = defineProps(['modelValue', 'disabled'])
const emit = defineEmits(['update:modelValue'])
const { createMessage } = useMessage()

const way = ref();
const wayList = ref()
const markRuleList = ref()  // 规则列表
const lessRuleList = ref()  // 小于规则列表
const greaterRuleList = ref()  // 大于规则列表

const allColumns: BasicColumn[] = [
  {
    title: '运算符号',
    dataIndex: 'fullMarkRule',
    edit: true,
    editComponent: 'Select',
    editComponentProps: {
      options: markRuleList,
      fieldNames: {
        label: 'dictName',
        value: 'dictCode',
      },
      allowClear: true
    },
    // editRule: true,
    width: 120,
  },
  {
    title: '满分条件',
    dataIndex: 'fullMarkVal',
    edit: true,
    editComponent: 'InputNumber',
    // editRule: true,
    editValueMap: (value) => {
      if (value === 0) {
        return '0'
      } else {
        return value
      }
    },
    width: 120,
  },
  {
    title: '运算符号',
    dataIndex: 'minRule',
    edit: true,
    editComponent: 'Select',
    editComponentProps: {
      options: lessRuleList,
      fieldNames: {
        label: 'dictName',
        value: 'dictCode',
      },
      allowClear: true
    },
    width: 120,
  },
  {
    title: '阈值下限',
    dataIndex: 'minVal',
    edit: true,
    editComponent: 'InputNumber',
    width: 120,
    editValueMap: (value) => {
      if (value === 0) {
        return '0'
      } else {
        return value
      }
    },
  },
  {
    title: '运算符号',
    dataIndex: 'maxRule',
    edit: true,
    editComponent: 'Select',
    editComponentProps: {
      options: greaterRuleList,
      fieldNames: {
        label: 'dictName',
        value: 'dictCode',
      },
      allowClear: true
    },
    width: 120,
  },
  {
    title: '阈值上限',
    dataIndex: 'maxVal',
    edit: true,
    editComponent: 'InputNumber',
    width: 120,
    editValueMap: (value) => {
      if (value === 0) {
        return '0'
      } else {
        return value
      }
    },
  },
  {
    title: '*止扣值',
    dataIndex: 'deductVal',
    edit: true,
    editComponent: 'InputNumber',
    width: 120,
    editValueMap: (value) => {
      if (value === 0) {
        return '0'
      } else {
        return value
      }
    },
  },
]
let columns :BasicColumn[] = []

const searchFormSchema: FormSchema[] = [
  {
    label: '选择方法',
    field: 'efficacyMethod',
    component: 'Select',
    slot: 'way',
    colProps: { span: 13 },
    // componentProps: {
    //   options: [
    //     {value: 1, label: '正向功效法'},
    //     {value: 2, label: '负向功效法'},
    //     {value: 3, label: '正向定额功效法'},
    //     {value: 4, label: '负向定额功效法'},
    //   ],
    // }
  },
]


// const wayList = ref([
//   {value: 1, label: '正向功效法'},
//   {value: 2, label: '负向功效法'},
//   {value: 3, label: '正向定额功效法'},
//   {value: 4, label: '负向定额功效法'},
// ])
const dataSource = ref([{}])

// 声明表格调用
const [registerTable, { reload, setProps, getForm, setColumns, setTableData}] = useTable({
  dataSource: dataSource,
  // api: queryEntList,
  immediate: false,
  columns: columns,
striped:true,//斑马纹设置
  showActionColumn: false,
  showIndexColumn: false,
  useSearchForm: true,
  formConfig: {
    schemas: searchFormSchema,
    labelWidth: 100,
    showActionButtonGroup: false,
  },
  pagination: false,
  showTableSetting: false,
});

// const myModelValue = computed({
//   get() {
//     return props.modelValue
//   },
//   set(value) {
//     console.log('chufale value改变', value)
//     emit('update:modelValue', value)
//   }
// })

/**
 * 初始化
 */
async function init() {
  console.log('chufale init')
  // emit('update:modelValue', {})
  wayList.value = await getEfficacyMethod()
  lessRuleList.value = await getLessRule()
  greaterRuleList.value = await getGreaterRule()
  console.log(' layrulelist--', lessRuleList.value)
  console.log(' greaterRuleList--', greaterRuleList.value)
  // setValue()
  // way.value = wayList.value ? wayList.value[0].dictCode : undefined
  // changeWay(way.value)
}


async function setValue(val?) {
  // 初始进来， 设置way，设置list
  if(val.efficacyMethod) {
    way.value = val.efficacyMethod
  } else {
    way.value =  wayList.value ? wayList.value[0].dictCode : undefined
  }
  console.log('formdatisabel.vale', val.disabled)
  // way更改后变更列表
  if (way.value == 'positive') {
    markRuleList.value = greaterRuleList.value
    columns = allColumns.filter(item => ['fullMarkRule', 'fullMarkVal', 'deductVal'].includes(item.dataIndex))
  } else if (way.value == 'negative') {
    markRuleList.value = lessRuleList.value
    columns = allColumns.filter(item => ['fullMarkRule', 'fullMarkVal', 'deductVal'].includes(item.dataIndex))
  } else {
    columns = allColumns.filter(item => ['minRule', 'minVal', 'maxRule', 'maxVal', 'deductVal'].includes(item.dataIndex))
  }
  console.log('markrulelsit', markRuleList.value)
  setColumns(columns)
  let list = [{}]
  if (val) {
    list = [
      JSON.parse(JSON.stringify(val))
    ]
  }
  setTableData(list)
}

/**
 * 更改选择方法
 * @param value 
 */
function changeWay(value) {
  // if (value == 'positive') {
  //   markRuleList.value = greaterRuleList.value
  //   columns = allColumns.filter(item => ['fullMarkRule', 'fullMarkVal', 'deductVal'].includes(item.dataIndex))
  // } else if (value == 'negative') {
  //   markRuleList.value = lessRuleList.value
  //   columns = allColumns.filter(item => ['fullMarkRule', 'fullMarkVal', 'deductVal'].includes(item.dataIndex))
  // } else {
  //   columns = allColumns.filter(item => ['minRule', 'minVal', 'maxRule', 'maxVal'].includes(item.dataIndex))
  // }
  // setTableData([{}])
  // props.modelValue.efficacyMethod = value
  emit('update:modelValue', {
    efficacyMethod: value
  })
}

watch(
  () => props.modelValue,
  async (val, oVal) => {
    console.log('出发了model value, 功效法', val)
    if (!oVal) {
      await init()
    }
    await setValue(val)
    // emit('update:modelValue', val)
  },
  {
    deep: true,
    // immediate: true,
  }
)
/**
 * 编辑完成回调
 */
 async function handleEditEnd({record, index, key, value}) {
  props.modelValue[key] = value
}


//声明弹窗
// const record = reactive({})
const companyNum = ref('')


/**
 * 校验数值
 */
function validateValue() {
  props.modelValue.efficacyMethod = way.value
  const values = cloneDeep(props.modelValue)
  return new Promise<void>((resolve, reject) => {
    console.log('values,校验',values)
    // 止扣值必填
    if (!values.deductVal && values.deductVal !== 0) {
      createMessage.error('请填写止扣值')
      reject('请填写止扣值')
      return
    }
    if (values.efficacyMethod == 'positive' || values.efficacyMethod == 'negative') {
      // 正向功效法和负向功效发
      if (values.fullMarkRule || (values.fullMarkVal || values.fullMarkVal === 0)) {
        // 满分条件和运算符号有一个有值,两个必须同时有值
        if (!values.fullMarkRule || (!values.fullMarkVal && values.fullMarkVal !== 0)) {
          createMessage.error('请填写完整')
          reject('请填写完整')
          return
        }
      }
    } else {
      if (values.minRule || (values.minVal || values.minVal === 0)) {
        // 满分条件和运算符号有一个有值,两个必须同时有值
        if (!values.minRule || (!values.minVal && values.minVal !== 0)) {
          createMessage.error('请填写完整')
          reject('请填写完整')
          return
        }
      }
      if (values.maxRule || (values.maxVal || values.maxVal === 0)) {
        // 满分条件和运算符号有一个有值,两个必须同时有值
        if (!values.maxRule || (!values.maxVal && values.maxVal !== 0)) {
          createMessage.error('请填写完整')
          reject('请填写完整')
          return
        }
      }
    }
    resolve()
  })
}
defineExpose({validateValue, init})
</script>