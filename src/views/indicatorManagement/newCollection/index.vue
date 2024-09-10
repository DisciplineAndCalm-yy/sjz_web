<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-20 17:22:21
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-11-23 14:25:38
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicTable @register="registerTable" :rowSelection="rowSelection">
    <template #tableTitle>
      <a-button type="primary" @click="router.push({ path: '/indicatorManagement/newCollection/new' })" preIcon="ant-design:plus-outlined">新建采集任务</a-button>
      <a-button  class="orangeBtn" :disabled="selectedRows.length == 0" sendAnnounce @click="sendAnnounce">催报</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'projectStatusText'">
        <a-tag :color="setColor('activateStatus', record.activateStatus)">{{ record.projectStatusText }}</a-tag>
        <!-- <a-button size="small" :style="{'background': setColor('activateStatus', record.activateStatus), 'color':'white'}">{{ record.projectStatusText }}</a-button> -->
      </template>
      <template v-if="column.key === 'checkStatusText'">
        <a-tag :color="setColor('checkStatus', record.checkStatus)" v-if="record.checkStatus == 0 || record.checkStatus == 1">{{ record.checkStatusText }}</a-tag>
        <span v-else>{{ record.checkStatusText }}</span>
      </template>
    </template>
    <!--操作栏-->
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
</template>
  
<script lang="ts" setup>
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useModal } from '/@/components/Modal';
import {setColor} from '/@/utils/perry'
import { useListPage } from '/@/hooks/system/useListPage';
import { columns, searchFormSchema, currentAuditStatus } from './index.data';
import { useRoute, useRouter } from 'vue-router';
import { projectList, projectDel, activate, sendProjectAnnounce, projectFinish, projectFinishCheck } from '/@/api/indicatorManagement/index'

//   声明路由
const router = useRouter()

// 禁止勾选
const getCheckboxProps = (record) => {           //禁用的方法
  return {
    disabled: record.activateStatus != '2'
  };
}


// 列表页面公共参数、方法
const { tableContext } = useListPage({
  tableProps: {
    title: '指标体系列表',
    api: projectList,
    columns: columns,
    striped:true,//斑马纹设置
    size: 'small',
    scroll: { x: 1300 },
    formConfig: {
      labelWidth: 150,
      schemas: searchFormSchema,
      showAdvancedButton: false,
      fieldMapToTime: [
        ['createTime', ['startDate', 'endDate'], 'YYYY-MM-DD']
      ],
      resetFunc: async () => {
        // currentAuditStatus.value = 0
      },
    },
    actionColumn: {
      width: 250,
      fixed: 'right'
    },
    rowKey: 'id',
    rowSelection: {
      preserveSelectedRowKeys: false,
      getCheckboxProps: getCheckboxProps
    },
    // 请求之前对参数做处理
    beforeFetch(params) {
    },
  },
});


//注册table数据
const [registerTable, { reload, clearSelectedRowKeys, setColumns, getForm }, { rowSelection, selectedRows, selectedRowKeys }] = tableContext;


/**
 * 操作栏
 */
function getTableAction(record): ActionItem[] {
  return [
    {
      label: '激活',
      popConfirm: {
        title: '是否确认激活当前采集任务？',
        confirm: handleActive.bind(null, record),
      },
      ifShow: () => {
        return record.activateStatus == '1'
      },
    },
    {
      label: '查看',
      onClick: toNextPage.bind(null, record, 'detail')
    },
    {
      label: '配置算法',
      onClick: toNextPage.bind(null, record, 'algorithm'),
      ifShow: () => {
        return record.activateStatus != '1' && record.checkStatus != '0'
      },
    },
    {
      label: '编辑',
      color: 'warning',
      onClick: toNextPage.bind(null, record, 'new'),
      ifShow: () => {
        return record.activateStatus == '1'
      },
    },
    {
      label: '删除',
      color: 'error',
      popConfirm: {
        title: '是否确认删除？',
        confirm: handleDelete.bind(null, record),
      },
      ifShow: () => {
        return record.activateStatus == '1'
      },
    },
    {
      label: '结束',
      popConfirm: {
        title: '是否结束当前采集任务？',
        confirm: handleEnd.bind(null, record),
      },
      ifShow: () => {
        return record.activateStatus == '2'
      },
    },
    {
      label: '结束校核',
      popConfirm: {
        title: '当前采集任务确定要结束校核吗？',
        confirm: handleEndCheck.bind(null, record),
      },
      ifShow: () => {
        return record.activateStatus == '3' && record.checkStatus != '0'
      },
    },
  ];
}

// 催报
const sendAnnounce = () => {
  sendProjectAnnounce({ ids: selectedRowKeys.value.join(',') }).then(res => {
    clearSelectedRowKeys()
    reload()
  })
};




// 方法
const toNextPage = (record, suffix) => {
  let queryObj = { id: record.id }
  if (suffix == 'detail') {
    queryObj.name = record.templateName
  }
  router.push({ path: '/indicatorManagement/newCollection/' + suffix, query: queryObj })
};

/**
   * 删除事件
   */
async function handleDelete(record) {
  await projectDel({ id: record.id }).then(res => {
    reload()
  })
}

/**
   * 结束事件
   */
async function handleEnd(record) {
  await projectFinish({ id: record.id }).then(res => {
    reload()
  })
}

/**
   * 结束核验
   */
async function handleEndCheck(record) {
  await projectFinishCheck({ id: record.id }).then(res => {
    reload()
  })
}


//激活
async function handleActive(record) {
  await activate({ id: record.id }).then(res => {
    reload()
  })
}


</script>