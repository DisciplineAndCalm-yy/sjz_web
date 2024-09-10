<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-20 17:22:21
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-24 16:37:38
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicTable @register="registerTable" >
    <template #tableTitle>
      <!-- <a-button type="primary" v-if="query.templateId" @click="toPreview">预览</a-button> -->
      <a-button type="primary" class="orangeBtn" @click="handleAverage">一键平权</a-button>
    </template>
    <template v-slot:bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'indicatorWeight'">
        <a-input class="weight" v-model:value="record[column.dataIndex]" type="number" @blur="handleEditEnd({record})"></a-input>
      </template>
    </template>
    <!--操作栏-->
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <div class="tips">注：二级指标权重总和需为100</div>
</template>

<script lang="ts" setup>
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useModal } from '/@/components/Modal';
import { useListPage } from '/@/hooks/system/useListPage';
import { columns2, searchFormSchema } from './index.data';
import { useRoute, useRouter } from 'vue-router';
import { queryIndWeight, saveIndWeight, projectQueryIndWeight, projectSaveIndWeight } from '/@/api/indicatorManagement/index'
import { reactive, computed, nextTick, ref  } from 'vue';
import { averageArr } from '/@/utils/common/compUtils'

const router = useRouter()
const route = useRoute()
const query = route.query
const props = defineProps(['parentValue'])
const emit = defineEmits(['nextStep'])
console.log('props.deinf', props.parentValue)

// 列表页面公共参数、方法
const { tableContext } = useListPage({
  tableProps: {
    title: '政策列表',
    // dataSource: [{}],
    immediate: false,
    api: query.templateId ? queryIndWeight : projectQueryIndWeight,
    columns: columns2,
    size: 'small',
    scroll: { x: 1300 },
    useSearchForm: false,
    showTableSetting: false,
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
      let query = route.query
      if (query.templateId) {
        params.templateId = query.templateId
        params.indicatorId = query.indicatorId
      } else {
        params.projectId = props.parentValue.projectId
        params.indicatorId = props.parentValue.indicatorId
      }
      console.log('params.',params)
    },
    afterFetch(data) {
      let rawData = getRawDataSource()
      // console.log('rawDAta', rawData)
      columns2[0].title = `二级指标名称(${data ? data.length : 0})`
      columns2[columns2.length -1].title = `二级指标权重(${rawData.indWeightSum || 0}/100)`
      setColumns(columns2)
    }
  },
});


//注册table数据
const [registerTable, { reload, clearSelectedRowKeys, setColumns, getForm, getDataSource, getRawDataSource }, { selectedRows, selectedRowKeys }] = tableContext;

/**
 * 初始化表格数据
 */
async function initData() {
  console.log('ssssssss')
  // let list = await queryTemplateChooseList()
  // templateList.value = list
  // if (list[0] && list[0].id) {
  //   console.log('getform', getForm())
  //   getForm().setFieldsValue({templateId: list[0].id})
  // }
  nextTick(async () => {
    await reload()
  })
}

initData()
/**
 * 跳转到预览
 */
function toPreview() {
  router.push({
    path: '/indicatorManagement/indicatorAlgorithmConfiguration/preview'
  })
}

/**
 * 编辑完成回调
 */
async function handleEditEnd({record}) {
  console.log('record', record);
  try {
    if (query.templateId) {
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
    if (!query.templateId) {
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
  if (!query.templateId) {
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
        if (query.templateId) {
          router.push({
            path: '/indicatorManagement/indicatorAlgorithmConfiguration/configureSubIndicator',
            query: {
              indicatorId: record.indicatorId,
              includeQuestion: record.includeQuestion
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