<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-20 17:22:21
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-10-23 14:19:29
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- departType: {{ currentDepartType }}
  <hr>
  selectedRowKeys: {{ selectedRowKeys }} -->
  <BasicTable @register="registerTable" :rowSelection="rowSelection">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'description'">
        <span @click="sendParams(record.departType, record.id)" :class="{ active: record.id == currentId }"
          style="cursor: pointer;">{{ record.description }}</span>
      </template>
      <template v-if="column.key === 'openStatus'">
        <a-switch v-model:checked="record.openStatusBoolean"
          @change="changeSwitch(record.id, record.openStatusBoolean)" />
      </template>
      <template v-if="column.key === 'configStatusText'">
        <a-tag :color="setColor('checkStatus', record.configStatus == 0? 1 : 0)" >{{ record.configStatusText }}</a-tag>
      </template>
    </template>
  </BasicTable>

  <!-- 报送范围设置 -->
  <collection-set ref="collectionSetRef" v-if="isShow" :monitorType="props.monitorType" :departType="currentDepartType"
    :questionIds="selectedRowKeys" :questionId="currentId" @getList="refresh"></collection-set>
</template>
  
<script lang="ts" setup>
import { defineProps, ref, computed, reactive } from 'vue';
import { useModal } from '/@/components/Modal';
import collectionSet from './collectionSet.vue';
import { useListPage } from '/@/hooks/system/useListPage';

import { BasicTable, BasicColumn, TableAction, FormSchema } from '/@/components/Table';
import { useRoute, useRouter } from 'vue-router';
import { queryQuestionList, indicatorTemplateDel, updateQuestionStatus } from '/@/api/indicatorManagement/index'
import {setColor} from '/@/utils/perry'
const currentId = ref('')
const currentDepartType = ref('')
const isShow = ref(false)
const refreshParams = reactive({
  departType: "",
  questionId: ""
})

// 声明props
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  monitorType: {//1是市、2是区
    type: String,
    default: ''
  }
})


// 通过computed获得doubleCount
// const selectKeys = computed(() => {
//   console.log(1111111111111, getSelectRowKeys())
//     return getSelectRowKeys()
//   })




//   声明路由
const router = useRouter()

const columns: BasicColumn[] = [
  // {
  //   title: '三级指标名称',
  //   dataIndex: 'name'
  // },
  {
    title: '指标项说明',
    dataIndex: 'description'
  },
  {
    title: '单位',
    dataIndex: 'unit'
  },
  {
    title: '类型',
    dataIndex: 'questionTypeText'
  },

  {
    title: '配置状态',
    dataIndex: 'configStatusText'
  },
  {
    title: '开启指标',
    dataIndex: 'openStatus'
  },

]

//审核状态传参，父页面监听-执行
// export const currentAuditStatus = ref(0);


// 列表页面公共参数、方法
const { tableContext } = useListPage({
  tableProps: {
    // title: '指标体系列表',
    api: queryQuestionList,
    columns: columns,
    striped:true,//斑马纹设置
    size: 'small',
    // scroll: { x: 1300 },
    useSearchForm: false,
    formConfig: {
      labelWidth: 150,
      //   schemas: searchFormSchema,
      showAdvancedButton: false,
      // fieldMapToTime: [
      //   ['auditCreatedTime', ['startDate', 'endDate'], 'YYYY-MM-DD'],
      //   ['releaseCreatedTime', ['startDate', 'endDate'], 'YYYY-MM-DD'],
      // ],
      resetFunc: async () => {
        // currentAuditStatus.value = 0
      },
    },
    showTableSetting: false,
    pagination: false,
    maxHeight: 300,
    showActionColumn: false,
    actionColumn: {
      width: 120,
      fixed: 'right'
    },
    rowKey: 'id',
    //定义rowSelection的类型，默认是checkbox多选，可以设置成radio单选 
    // rowSelection: {
    //   preserveSelectedRowKeys: false,
    // },
    // 请求之前对参数做处理
    beforeFetch(params) {
      console.log('props', props)
      params.indicatorId = props.id
    },
    afterFetch(data) {
      console.log('data', data)
      let departType =""
      // currentId.value = data[0].id
      // // selectedRowKeys.value = [data[0].id]
      if (refreshParams.departType == "") {
        departType = data[0].departType == null? "1" : data[0].departType;
        selectedRowKeys.value = [data[0].id]
        sendParams(departType, data[0].id)
      }else{
        sendParams(refreshParams.departType, refreshParams.questionId)
      }
      
      
      // currentQuestionId.value = data[0].id
      isShow.value = true
    },
  },
});


//注册table数据
const [registerTable, { reload, clearSelectedRowKeys, getSelectRowKeys }, { rowSelection, selectedRows, selectedRowKeys }] = tableContext;


// 刷新列表
const refresh =(data)=>{
  console.log('data', data)
  refreshParams.departType = data.departType
  refreshParams.questionId = currentId.value
  clearSelectedRowKeys()
  reload()
}

// 方法
const toNextPage = (record) => {
  router.push({ path: '/indicatorManagement/indicatorTemplate/build', query: { id: record.id, name: record.name, description: record.description } })
};

/**
   * 删除事件
   */
async function handleDelete(record) {
  await indicatorTemplateDel({ id: record.id }).then(res => {
    reload()
  })
}

//开启指标
const changeSwitch = (id, openStatus) => {
  updateQuestionStatus({ id: id, openStatus: openStatus }).then(res => {
    reload()
  })

}

// 子组件ref
const collectionSetRef = ref('collectionSetRef')

//发送数据打collectionSet.vue
const sendParams = (departType, questionId) => {
  console.log(departType, questionId)
  // selectedRowKeys.value = [questionId]
  currentId.value = questionId
  currentDepartType.value = departType == null ? "1" : departType;
  // currentQuestionId.value = questionId
  setTimeout(()=>{
    collectionSetRef.value.clear()
  },100)
}

</script>
  
<style lang="less" scoped>
.active {
  color: #1890ff;
}
</style>