<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-12 10:05:27
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-28 16:16:55
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/application-list/index.vue
 * @Description  : 企业管家申请清单
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <BasicTable @register="registerTable">
    <!--操作栏-->
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>

  <BindingModal destroyOnClose width="50vw" @register="registerBindingModal" @success="reload" />
  <PreviewModal destroyOnClose width="50vw" @register="registerPreviewModal" @success="reload" />
  <NotBoundModal destroyOnClose width="50vw" @register="registerNotBoundModal" @success="reload" />
</template>

<script lang="ts" setup>
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { enterpriseEntMangerApplyList } from './index.api';
import { columns, searchFormSchema } from './index.data';
import { useModal } from '/@/components/Modal';

import BindingModal from "./BindingModal.vue";
import PreviewModal from "./PreviewModal.vue";
import NotBoundModal from "./NotBoundModal.vue";
import { useGo } from '/@/hooks/web/usePage';

const [registerBindingModal, { openModal: openBindingModal }] = useModal();
const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();
const [registerNotBoundModal, { openModal: openNotBoundModal }] = useModal();


const go = useGo()

// 列表页面公共参数、方法
const { tableContext } = useListPage({
  designScope: 'enterprise-library',
  tableProps: {
    showIndexColumn: true,
    api: enterpriseEntMangerApplyList,
    columns: columns,
    size: 'small',
    showTableSetting: false,
    formConfig: {
      showAdvancedButton: false,
      labelWidth: 100,
      labelAlign: 'left',
      schemas: searchFormSchema,
      fieldMapToTime: [
        ['Date', ['startDate', 'endDate'], 'YYYY-MM-DD']
      ]
    },
    actionColumn: {
      fixed: 'right',
      width: 180,
    },
  },
});

const [registerTable, { reload }] = tableContext;


/**
* 操作栏
*/
function getTableAction(record): ActionItem[] {
  return [
    {
      label: '详情',
      onClick: () => {
        go(`/service/application-list/details?id=${record.entId}`)
      },
      // ifShow: () => hasPermission('system:user:edit'),
    },
    {
      label: '绑定',
      onClick: () => {
        openBindingModal(true, record)
        // openMaintenanceModal(true, record)
      },
      ifShow: () => record.status == 1,
    },
    {
      label: '暂不绑定',
      onClick: () => {
        openNotBoundModal(true, record)
        // openMaintenanceModal(true, record)
      },
      ifShow: () => record.status == 1,
    },
    {
      label: '查看绑定',
      onClick: () => {
        openPreviewModal(true, record)
        // openMaintenanceModal(true, record)
      },
      ifShow: () => record.status === '2',
      // ifShow: () => hasPermission('system:user:edit'),
    },
    // {
    //   label: '暂不绑定',
    //   popConfirm: {
    //     title: '确认暂不绑定该条数据吗?',
    //     confirm: async () => {
    //       reload()
    //     }
    //   }
    // },
  ];
}

</script>

<style></style>