<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-26 16:18:08
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-08 14:26:51
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\components\combination.vue
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
      <template #tableTitle>
        <a-button type="primary" @click="addData" :disabled="props.disabled">添加取值范围</a-button>
      </template>
      <template v-slot:bodyCell="{ text, column, record }">
        <span v-if="props.disabled">{{ text }}</span>
      </template>
      <template #action="{ record, index }">
        <TableAction :actions="getTableAction(index)"/>
        <!-- <a-button @click="delData(index)">删除</a-button> -->
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" setup>
// import { BasicModal, useModalInner } from '/@/components/Modal';
import { reactive, computed, nextTick, ref, watch  } from 'vue';
import { BasicTable, BasicColumn, FormSchema, useTable, ActionItem, TableAction } from '/@/components/Table';
import { getLayerMethod  } from '/@/api/indicatorManagement/index'
import { cloneDeep } from 'lodash-es';

// 声明props
const props = defineProps(['modelValue', 'disabled'])
const emit = defineEmits(['update:modelValue'])

const way = ref();
const wayList = ref()
const columns:BasicColumn[] = [
  {
    title: '（>=）最小值',
    dataIndex: 'minVal',
    edit: true,
    editComponent: 'InputNumber',
    editComponentProps: {
    },
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
    title: '（<）最大值',
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
    title: '得分',
    dataIndex: 'weightVal',
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
// let columns :BasicColumn[] = []
const dataSource = ref([])
const searchFormSchema: FormSchema[] = [
  {
    label: '选择方法',
    field: 'layerMethod',
    component: 'Select',
    slot: 'way',
    colProps: { span: 13 },
  },
]

// 声明表格调用
const [registerTable, { reload, setProps, setTableData, getDataSource, setColumns}] = useTable({
    dataSource: dataSource,
    // api: queryEntList,
    immediate: false,
    columns: columns,
striped:true,//斑马纹设置
    showActionColumn: true,
    showIndexColumn: false,
    useSearchForm: true,
    formConfig: {
      schemas: searchFormSchema,
      labelWidth: 100,
      showActionButtonGroup: false,
    },
    pagination: false,
    showTableSetting: false,
    actionColumn: {
      title: '操作',
      width: 100,
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
});

watch(
  () => props.modelValue,
  (val) => {
    console.log('出发了model value 层差法', val)
    setValue(val)
    // emit('update:modelValue', val)
  },
  {
    deep: true,
    // immediate: true,
  }
)

/**
 * 初始化
 */
async function init() {
  wayList.value = await getLayerMethod()
}
init()

function changeWay(val) {
  props.modelValue.layerMethod = val
}

function setValue(val?) {
  if(val.layerMethod) {
    way.value = val.layerMethod
  } else {
    way.value =  wayList.value ? wayList.value[0].dictCode : undefined
  }
  // way更改后变更列表
  if (way.value == 'positive') {
    columns[0].title = '（>=）最小值'
    columns[0].dataIndex = 'minVal'
    columns[1].title = '（<）最大值'
    columns[1].dataIndex = 'maxVal'
  } else if (way.value == 'negative') {
    columns[0].title = '（<=）最大值'
    columns[0].dataIndex = 'maxVal'
    columns[1].title = '（>）最小值'
    columns[1].dataIndex = 'minVal'
  }
  setColumns(columns)
  setTableData(cloneDeep(val.layer || []))
}

/**
 * 添加表格数据
 */
function addData() {
  let data = getDataSource() || []
  console.log('添加。。。', data)
  let nextValue = {}
  if (data[data.length -1]) {
    nextValue.minVal = data[data.length - 1].maxVal
  }
  data.push(nextValue)
  setTableData(data)
}

/**
 * 操作栏
 */
 function getTableAction(index): ActionItem[] {
  return [
    {
      label: '删除',
      color: 'error',
      onClick: () => {
        let list = getDataSource()
        list.splice(index, 1)
        setTableData(list)
      },
      disabled: props.disabled
    },
  ];
}

/**
 * 编辑完成回调
 */
 async function handleEditEnd({record, index, key, value}) {
  console.log('record', record)
  record[key] = value
}

/**
 * 校验数值
 */
 function validateValue() {
  props.modelValue.layerMethod = way.value
  const values = getDataSource()
  props.modelValue.layer = values 
  console.log('modalvlaues', props.modelValue)
  console.log('values---', values)
  return new Promise<void>((resolve, reject) => {
    // if () {
    //   // reject('错误')
    // } else {

    // }
    emit('update:modelValue', cloneDeep(props.modelValue))
    resolve()
  })
}
defineExpose({validateValue, init})

</script>

<style lang="less" scoped>

</style>