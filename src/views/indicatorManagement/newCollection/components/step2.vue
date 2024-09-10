<template>
  <!-- <button @click="expandAll()">展开</button> -->
  <BasicTable @register="registerTable" :defaultExpandAllRows="true"   :isTreeTable="true">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'openStatus'">
        <a-switch v-model:checked="record.openStatusBoolean"
          @change="changeSwitch(record.id, record.openStatusBoolean)" />
      </template>
      <template v-if="column.key === 'configStatusText'">
        <a-tag :color="setColor('checkStatus', record.configStatus == 0? 1 : 0)" >{{ record.configStatusText }}</a-tag>
      </template>
    </template>
    <!--操作栏-->
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
</template>
  
<script lang="ts" setup>
import { defineProps, provide, ref } from 'vue';
import { useModal } from '/@/components/Modal';
import { useListPage } from '/@/hooks/system/useListPage';
import { BasicTable, useTable, BasicColumn, TableAction, FormSchema } from '/@/components/Table';
import { useRoute, useRouter } from 'vue-router';
import { queryProjectIndicatorTree, indicatorTemplateDel, queryTemplateChooseList, updateIndicatorStatus } from '/@/api/indicatorManagement/index'
import {setColor} from '/@/utils/perry'
// 声明props
const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})

const tableKey = ref(false)

//   声明路由
const router = useRouter()

const columns: BasicColumn[] = [
  {
    title: '指标名称',
    dataIndex: 'indicatorName',
    align: 'left'
  },
  {
    title: '指标说明',
    dataIndex: 'description'
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
    title: '指标体系列表',
    api: queryProjectIndicatorTree,
    columns: columns,
    striped:true,//斑马纹设置
    size: 'small',
    // scroll: { x: 1300 },
    useSearchForm: false,
    expandRowByClick: true,
    defaultExpandAllRows: true,
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
    actionColumn: {
      width: 120,
      fixed: 'right'
    },
    rowKey: 'id',
    // 请求之前对参数做处理
    beforeFetch(params) {
      console.log('props', props)
      params.id = props.id
    },
    afterFetch(){
      setTimeout(()=>{
        expandAll()
    },200)
    }
  },
});


//注册table数据
const [registerTable, { reload, clearSelectedRowKeys, setColumns, expandAll }] = tableContext;

// expandAll()
/**
 * 操作栏
 */
function getTableAction(record): ActionItem[] {
  return [
    {
      label: '配置下级指标',
      onClick: toSetRules.bind(null, record),
      ifShow: () => {
        return record.includeQuestion == '1'
      },
    }
  ];
}


// 声明事件
const emit = defineEmits(['setindicatorId'])
// 方法
const toSetRules = (record) => {
  emit('setindicatorId', record.id)
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
  updateIndicatorStatus({ id: id, openStatus: openStatus }).then(res => {
    reload()
  })

}

// 声明provide
provide('provideState', {
  reload
})


</script>
  
<style lang="less" scoped></style>