<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-24 17:46:03
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-24 16:37:15
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\configureSubIndicator.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- <a-breadcrumb class="breadcrumb" v-if="query.indicatorId">
    <a-breadcrumb-item>
      <a href="">指标算法配置</a>
    </a-breadcrumb-item>
    <a-breadcrumb-item>配置下级指标</a-breadcrumb-item>
  </a-breadcrumb> -->
  <div class="table-content">
    <div class="table-box">
      <div class="left" v-if="query.includeQuestion === '0' || (props.parentValue && props.parentValue.includeQuestion === '0')">
        <BasicTable @register="register" >
          <!-- <template #tableTitle>
            <a-button type="primary" @click="handleAverage">一键平权</a-button>
          </template> -->
          <template v-slot:bodyCell="{ column, record, index, text }">
            <template v-if="column.dataIndex === 'indicatorName'">
              <div :title="text" :class="['cursor', index == nowListIndex ? 'selected' : '']" @click="clickIndicator(record, index)">
                {{ record[column.dataIndex] }}
              </div>
            </template>
            <template v-if="column.dataIndex === 'weightValue'">
              <a-input class="weight" v-model:value="record[column.dataIndex]" type="number" @blur="tableEditEnd({record})"></a-input>
            </template>
          </template>
        </BasicTable>
        <a-button class="orangeBtn" type="primary" @click="handleAverage">一键平权</a-button>
      </div>
      <div class="right">
        <!-- <a-table ref="table" :columns="columns2" :dataSource="dataSource">
        </a-table> -->
        <BasicTable @register="register2">
          <template v-slot:bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'weightValue'">
              <span v-if="record.isSettingWeight == '0'">无需配置</span>
              <a-input v-else class="weight" v-model:value="record[column.dataIndex]" type="number" @blur="table2EditEnd({record})"></a-input>
            </template>
            <template v-if="column.dataIndex === 'scoreFlag'">
              <span v-if="record.isSettingScore == '0'">{{ record.scoreFlag == '1' ? '是' : '否' }}</span>
              <a-select v-else  v-model:value="record[column.dataIndex]" @change="table2EditEnd({record})"> 
                <a-select-option v-for="item in scoreFlagList" :key="item.dictCode" :value="item.dictCode">{{ item.dictName }}</a-select-option>
              </a-select>
            </template>
          </template>
          <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
          </template>
        </BasicTable>
      </div>
    </div>
    <div class="btn-box">
      <!-- <a-button type="primary" size="large" @click="handleSave">保存</a-button> -->
      <a-button type="primary" ghost size="large" @click="goBack">返回</a-button>
    </div>
  </div>
  <configModal @register="registerModal" @success="configSuccess" :modalType="modalType"></configModal>
</template>
  
<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BasicTable, BasicColumn, useTable, TableAction, ActionItem} from '/@/components/Table';
import { useModal } from '/@/components/Modal';
import configModal from './components/configModal.vue'
import { queryLastIndWeight, saveLastIndWeight, projectQueryLastIndWeight, projectSaveLastIndWeight, projectAdd, getScoreFlag, saveIndWeight, projectSaveIndWeight } from '/@/api/indicatorManagement/index'
import { averageArr } from '/@/utils/common/compUtils'
import { cloneDeep } from 'lodash-es';


const router = useRouter()
const route = useRoute()
const query = route.query
const props = defineProps(['parentValue'])
const modalType = ref('indicator')  // 弹框类型：分为指标(indicator)和项目(project)
// const props = withDefaults(defineProps(), {
//   parentValue: () => {
//     return {
//       includeQuestion: undefined
//     }
//   }
// })
const emit = defineEmits(['nextStep', 'prevStep'])
let scoreFlagList = ref([])

const columns: BasicColumn[] = [
  {
    title: '三级指标名称',
    dataIndex: 'indicatorName',
    width: 120,
  },
  {
    title: '三级指标权重',
    dataIndex: 'weightValue',
    width: 120,
    // edit: true,
    // editComponent: 'InputNumber',
    // editValueMap: (value) => {
    //   if (value === 0) {
    //     return '0'
    //   } else {
    //     return value
    //   }
    // },
  },
]
const columns2: BasicColumn[] = [
  {
    title: '指标项说明',
    dataIndex: 'description',
    width: 120,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 50,
  },
  {
    title: '指标类型',
    dataIndex: 'questionType',
    width: 120,
  },
  {
    title: '是否纳入算分',
    dataIndex: 'scoreFlag',
    width: 120,
    // edit: true,
    // editComponent: 'Select',
    // editComponentProps: {
    //   options: scoreFlagList,
    //   fieldNames: {
    //     label: 'dictName',
    //     value: 'dictCode',
    //   },
    // },
    // editValueMap: (value) => {
    //   if (value == '0') {
    //     return '否'
    //   } else if (value == '1') {
    //     return '是'
    //   } else {
    //     return value
    //   }
    // },
    ifShow: () => {
      return !query.indicatorId
    }
  },
  {
    title: '计分方法',
    dataIndex: 'configTypeDesc',
    width: 120,
  },
  {
    title: '权重',
    dataIndex: 'weightValue',
    width: 120,
    // edit: true,
    // editValueMap: (value) => {
    //   if (value === 0) {
    //     return '0'
    //   } else {
    //     return value
    //   }
    // },
    // editComponent: 'InputNumber',
  },
  // {
  //   title: '操作',
  //   dataIndex: 'policySerialNumber',
  //   width: 120,
  // },
]

const dataSource = ref([])
const nowListIndex = ref(0) // 当前点击的三级指标，默认为第0个
// const nowLastWeightSum = ref('0.0') // 当前点击的三级指标的权重

// 注册列表
const [register,  { reload, setProps, getDataSource, setTableData, setColumns, getRawDataSource }] = useTable({
  api: query.indicatorId? queryLastIndWeight : projectQueryLastIndWeight,
  immediate: false,
  // columns: columns,
  striped:true,//斑马纹设置
  childrenColumnName: 'a',  // 这里不用树的结构，随便指定一个非childern字段
  // dataSource: dataSource,
  actionColumn: null,
  useSearchForm: false,
  formConfig: undefined,
  showTableSetting: false,
  showIndexColumn: false,
  pagination: false,
  fetchSetting: {
    listField: 'lastWeightList'
  },
  rowKey: 'id',
  beforeFetch(params) {
    if (query.indicatorId) {
      params.indicatorId = query.indicatorId
    } else {
      params.indicatorId = props.parentValue.indicatorId
    }
  },
  afterFetch(data) {
    let rawData = getRawDataSource()
    console.log('rawdata',rawData)
    columns[columns.length -1].title = `三级指标权重(${rawData.lastWeightSum}/100)`
    setColumns(columns)
    if (data && data[nowListIndex.value]) {
      clickIndicator(data[nowListIndex.value], nowListIndex.value)
    } else {
      clickIndicator({
        lastWeightSum: '0.0'
      }, 0)
    }
  }
});

// 注册列表
const [register2,  { reload: reload2, setProps: setProps2, setTableData: setTableData2, getDataSource: getDataSource2, setColumns: setColumns2, getRawDataSource: getRawDataSource2 }] = useTable({
  api: query.includeQuestion === '0' || (props.parentValue && props.parentValue.includeQuestion === '0') ?  undefined : query.indicatorId ? queryLastIndWeight : projectQueryLastIndWeight,
  // columns: columns2,
  immediate: false,
  pagination: false,
  // dataSource: dataSource,
  actionColumn: {
    width: 200,
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  },
  fetchSetting: {
    listField: 'lastWeightList'
  },
  rowKey: 'id',
  beforeFetch(params) {
    if (query.indicatorId) {
      params.indicatorId = query.indicatorId
    } else {
      params.indicatorId = props.parentValue.indicatorId
    }
  },
  afterFetch(data) {
    let rawData = getRawDataSource2()
    // console.log('问题对应的原始数据', rawData)
    // console.log('columns2', columns2)
    columns2[columns2.length -1].title = `权重(${rawData.lastWeightSum}/100)`
    setColumns2(columns2)
  },
  showIndexColumn: false,
  useSearchForm: false,
  formConfig: undefined,
  showTableSetting: false,
});


const [registerModal, { openModal} ] = useModal()

/**
 * 初始化表格数据
 */
async function initData() {
  scoreFlagList.value = await getScoreFlag()
  console.log('scoreflaglise', scoreFlagList.value)
  console.log('props', props.parentValue)
  if (query.includeQuestion === '0' || (props.parentValue && props.parentValue.includeQuestion === '0')) {
    nextTick(async () => {
      await reload()
    })
  } else {
    nextTick(async () => {
      await reload2()
    })
  }
  if (query.indicatorId) {
    modalType.value  = 'indicator'
  } else {
    modalType.value = 'project'
  }
}
initData()

/**
 * 点击三级指标
 * @param record
 */
async function clickIndicator(record, index) {
  nowListIndex.value = index 
  let list = []
  if (record && record.children) {
    // list = record.children
    list = cloneDeep(record.children)
  } else {
    list = []
  }
  // console.log(' 列表2对应list', list)
  columns2[columns2.length -1].title = `权重(${record.lastWeightSum}/100)`
  await setColumns2(cloneDeep(columns2))
  await setTableData2(list)
}

/**
 * 平权
 */
 async function handleAverage() {
  let dataSource = getDataSource()
  console.log('datasource', dataSource)
  let arr = averageArr(dataSource, 'weightValue')
  if (query.indicatorId) {
    await saveIndWeight(arr)
  } else {
    await projectSaveIndWeight(arr)
  }
  await reload()
}
/**
 * 列表一编辑
 */
async function tableEditEnd({record}) {
  try {
    if (query.indicatorId) {
      await saveIndWeight([{
        id: record.id,
        templateId: record.templateId,
        weightValue: record.weightValue
      }])
    } else {
      await projectSaveIndWeight([{
        id: record.id,
        projectId: record.projectId,
        weightValue: record.weightValue
      }])
    }
  } finally {
    reload()
  }
  
}

/**
 * 列表二编辑
 */
async function table2EditEnd({record}) {
  // console.log('key',key)
  try {
    let saveMethod
    if (query.indicatorId) {
      saveMethod = saveLastIndWeight
    } else {
      saveMethod = projectSaveLastIndWeight
    }
    await saveMethod([{...record}])
  } finally {
    if (query.includeQuestion === '0' || (props.parentValue && props.parentValue.includeQuestion === '0')) {
      await reload()
    } else {
      await reload2()
    }
  }
}
/**
 * 配置完成
 */
async function configSuccess() {
  console.log('query.includeQuestion', query.includeQuestion);
  console.log('props.parentvalue', props.parentValue);
  if (query.includeQuestion === '0' || (props.parentValue && props.parentValue.includeQuestion === '0')) {
    await reload()
  } else {
    await reload2()
  }
}

/**
 * 操作栏
 */
function getTableAction(record): ActionItem[] {
  return [
    {
      label: '配置',
      onClick: () => {
        openModal(true, record)
      },
      ifShow: () => {
        return record.configTypeDesc != '无需配置'
      },
    }
  ];
}

/**
 * 保存
 */
async function handleSave() {
  let saveMethod
  if (query.indicatorId) {
    saveMethod = saveLastIndWeight
  } else {
    saveMethod = projectSaveLastIndWeight
  }
  if (query.includeQuestion === '0' || (props.parentValue && props.parentValue.includeQuestion === '0')) {
    let list = getDataSource()
    console.log('baocun....', list)
    await saveMethod(list)
    await reload()
  } else {
    let list = getDataSource2()
    console.log('baocun....', list)
    await saveMethod(list)
    await reload2()
  }
}

/**
 * 返回
 */
function goBack() {
  if(query.indicatorId) {
    router.go(-1)
  } else {
    emit('prevStep')
  }
}
</script>
  
<style lang="less" scoped>
.breadcrumb {

}
.table-content {
  .first {
    padding: 10px;
  }
  .table-box {
    display: flex;
    background: white;
    border-bottom: 1px solid #EDEDED;
    .left {
      width: 30%;
      padding: 10px;
      box-sizing: border-box;
      /deep/ tr{
        td:has(.cursor.selected),
        td:has(.cursor.selected)~td { 
          background: #D6E1FF;
        }
      } 
      .cursor {
        cursor: pointer;
        &.selected {
          color: #1890ff;
        }
      }
    }
    .right {
      width: 70%;
      padding: 10px;
      box-sizing: border-box;
      &:first-child {
        width: 100%;
      }
    }
  }
}
.btn-box {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  button {
    margin-right: 20px;
  }
}
.weight {
  max-width: 100px;
  border-radius: 4px;
}

.averageBtn {
  background-color: #FF820F;
  border: 0
}
</style>