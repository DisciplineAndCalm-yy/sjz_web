<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-12 10:03:40
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-14 20:22:39
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/butler-binding/index.vue
 * @Description  : 企业服务管家绑定
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <!-- :rowSelection="rowSelection" -->
  <BasicTable @register="registerTable">
    <!--插槽:table标题-->
    <template #tableTitle>
      <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 批量导出</a-button>
    </template>
    <!--操作栏-->
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <BindingEnterpriseModal destroyOnClose width="50vw" @register="registerBindingEnterpriseModal" @success="reload" />
  <PreviewBindingEnterpriseModal destroyOnClose width="50vw" @register="registerPreviewBindingEnterpriseModal"
    @success="reload" />
</template>

<script setup lang="ts">
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { enterpriseEntMangerBindingList, getExportUrl } from './index.api';
import { columns, searchFormSchema } from './index.data';
import BindingEnterpriseModal from "./BindingEnterpriseModal.vue";
import PreviewBindingEnterpriseModal from "./PreviewBindingEnterpriseModal.vue";
import { useModal } from '/@/components/Modal';
import dayjs from 'dayjs';

// 列表页面公共参数、方法
const { tableContext, onExportXls } = useListPage({
  designScope: 'enterprise-library',
  tableProps: {
    showIndexColumn: true,
    api: enterpriseEntMangerBindingList,
    columns: columns,
    size: 'small',
    showTableSetting: false,
    formConfig: {
      showAdvancedButton: false,
      baseColProps: {
        span: 8,
        lg: 8,
        xxl: 8
      },
      labelWidth: 100,
      labelAlign: 'left',
      schemas: searchFormSchema,
      fieldMapToTime: [
        ['toDate', ['startDate', 'endDate'], 'x']
      ]
    },
    actionColumn: {
      fixed: 'right',
      width: 240,
    },
  },
  exportConfig: {
    name: () => `企业服务管家${dayjs(new Date()).format('YYYYMMDDHHmmss')}`,
    url: getExportUrl,
  },
});



const [registerTable, { reload }] = tableContext;
const [registerBindingEnterpriseModal, { openModal: openBindingEnterpriseModal }] = useModal();
const [registerPreviewBindingEnterpriseModal, { openModal: openPreviewBindingEnterpriseModal }] = useModal();

/**
* 操作栏
*/
function getTableAction(record): ActionItem[] {

  return [
    {
      label: '绑定企业',
      onClick: () => {
        openBindingEnterpriseModal(true, record)
      },
      // ifShow: () => hasPermission('system:user:edit'),
    },
    {
      label: '查看服务企业',
      onClick: () => {
        openPreviewBindingEnterpriseModal(true, record)
        // openBindingEnterpriseModal(true, { title: '查看绑定企业', showFooter: false })
      },
      // ifShow: () => hasPermission('system:user:edit'),
    }
  ];
}


</script>

<style></style>