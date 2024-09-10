<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-20 17:22:21
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-29 16:37:12
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button type="primary" v-if="!query.id" @click="handleExport">导出</a-button>
      <a-button type="primary" v-if="!query.id" @click="toPreview">预览</a-button>
      <a-button type="primary" class="orangeBtn" @click="handleAverage">一键平权</a-button>
    </template>
    <template #form-templateId="{ model, field }">
      <a-select v-model:value="model[field]" :allowClear="false" show-search :filter-option="filterOption" optionFilterProp="label">
        <a-select-option :value="item.id" v-for="item in templateList" :key="item.id" :label="item.name">{{ item.name }}</a-select-option>
      </a-select>
    </template>
    <template v-slot:bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'indicatorWeight'">
        <a-input class="weight" v-model:value="record[column.dataIndex]" type="number"
          @blur="handleEditEnd({ record })"></a-input>
      </template>
    </template>
    <!--操作栏-->
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <div class="tips">注：一级指标权重总和需为100</div>
</template>

<script lang="ts" setup>
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useModal } from '/@/components/Modal';
import { useListPage } from '/@/hooks/system/useListPage';
import { columns, searchFormSchema, currentAuditStatus, myState } from './index.data';
import { useRouter, useRoute } from 'vue-router';
import { queryTemplateChooseList, queryIndWeight, saveIndWeight, templateWeightExport, projectQueryIndWeight, projectSaveIndWeight } from '/@/api/indicatorManagement/index'
import { reactive, computed, nextTick, ref } from 'vue';
import { averageArr } from '/@/utils/common/compUtils'
import { exportMethod } from '/@/utils/file/download'
import dayjs from 'dayjs';
import { template } from 'lodash-es';

const router = useRouter()
const route = useRoute()
const query = route.query
const templateList = ref([])  // 指标体系列表
const emit = defineEmits(['nextStep'])
// const templateId = ref()

// 列表页面公共参数、方法
const { tableContext } = useListPage({
  tableProps: {
    title: '指标算法配置',
    // dataSource: [{}],
    immediate: false,
    api: query.id ? projectQueryIndWeight : queryIndWeight,
    columns: columns,
    striped: true,//斑马纹设置
    showTableSetting: false,
    size: 'small',
    scroll: { x: 1300 },
    useSearchForm: !query.id,
    formConfig: {
      labelWidth: 150,
      schemas: searchFormSchema,
      showAdvancedButton: false,
      resetFunc: async () => {
        return new Promise(() => {
          // if (!query.id) {
          let list = templateList.value
          getForm().setFieldsValue({ templateId: list[0].id })
          // } else {

          // }
          return reload()
        })
      },
    },
    actionColumn: {
      width: 120,
      fixed: 'right',
    },
    rowKey: 'indicatorId',
    fetchSetting: {
      listField: 'weightList'
    },
    // 请求之前对参数做处理
    beforeFetch(params) {
      console.log('请求前参数处理')
      if (query.id) {
        params.projectId = query.id
      }
      if (params.templateId) {
        myState.setTemplateId(params.templateId)
      }
    },
    afterFetch(data) {
      let rawData = getRawDataSource()
      // console.log('rawDAta', rawData)
      columns[0].title = `一级指标名称(${data ? data.length : 0})`
      columns[columns.length - 1].title = `配置一级指标权重(${rawData.indWeightSum}/100)`
      setColumns(columns)
    },
  },
});


//注册table数据
const [registerTable, { reload, clearSelectedRowKeys, setColumns, getForm, getDataSource, getRawDataSource }, { selectedRows, selectedRowKeys }] = tableContext;

//过滤规则
const filterOption = (input: string, option: any) => {
  return option.label.indexOf(input) >= 0;
};

/**
 * 初始化表格数据
 */
async function initData() {
  console.log('ssssssss', query)
  if (!query.id) {
    let list = await queryTemplateChooseList()
    let findItem = list.find(item => item.id == myState.templateId)
    templateList.value = list
    if (findItem && myState.templateId) {
      getForm().setFieldsValue({templateId: myState.templateId})
    } else {
      if (list[0] && list[0].id) {
        console.log('getform', getForm())
        getForm().setFieldsValue({templateId: list[0].id})
      }
    }
  }
  nextTick(async () => {
    await reload()
  })
}

initData()
/**
 * 跳转到预览
 */
function toPreview() {
  let params = getForm().getFieldsValue()
  router.push({
    path: '/indicatorManagement/indicatorAlgorithmConfiguration/preview',
    query: {
      templateId: params.templateId
    }
  })
}

/**
 * 导出
 */
function handleExport() {
  let params = getForm().getFieldsValue()
  if (params.templateId) {
    let templateItem = templateList.value.find(item => item.id == params.templateId)
    let days = dayjs().format('YYMMDD')
    exportMethod(templateWeightExport, `${templateItem.name}-指标权重-${days}.xlsx`, { templateId: params.templateId })
  }
}

/**
 * 编辑完成回调
 */
async function handleEditEnd({ record }) {
  try {
    console.log('record', record);
    if (!query.id) {
      await saveIndWeight([{
        id: record.indicatorId,
        templateId: record.templateId,
        weightValue: record.indicatorWeight
      }])
    } else {
      await projectSaveIndWeight([{
        id: record.indicatorId,
        projectId: record.projectId,
        weightValue: record.indicatorWeight
      }])
    }
  } finally {
    await reload()
  }
}

/**
 * 平权
 */
async function handleAverage() {
  let dataSource = getDataSource()
  console.log('datasource', dataSource)
  let arr = averageArr(dataSource, 'indicatorWeight')
  let params = arr.map(item => {
    if (query.id) {
      return {
        id: item.indicatorId,
        projectId: item.projectId,
        weightValue: item.indicatorWeight
      }
    } else {
      return {
        id: item.indicatorId,
        templateId: item.templateId,
        weightValue: item.indicatorWeight
      }
    }
  })
  if (query.id) {
    await projectSaveIndWeight(params)
  } else {
    await saveIndWeight(params)
  }
  await reload()
}


/**
 * 操作栏
 */
function getTableAction(record): ActionItem[] {
  return [
    {
      label: '配置下级指标',
      onClick: () => {
        if (!query.id) {
          router.push({
            path: '/indicatorManagement/indicatorAlgorithmConfiguration/secondConfig',
            query: {
              templateId: record.templateId,
              indicatorId: record.indicatorId
            }
          })
        } else {
          emit('nextStep', record)
        }

      },
      // ifShow: () => {
      //   return record.auditStatus != '0'
      // },
    }
  ];
}

</script>

<style lang="less" scoped>
.tips {
  margin: 10px;
  color: red;
}

.averageBtn {
  background-color: #FF820F;
  border: 0
}

.weight {
  max-width: 100px;
  border-radius: 4px;
}
</style>