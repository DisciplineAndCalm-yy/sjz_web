<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-20 14:45:26
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-04-21 17:17:19
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/monthly-report/index.vue
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
    </template>
  </BasicTable>
</template>

<script lang="ts" setup name="service-monthly-report">
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { enterpriseEntMangerRecordReportList, getExportUrl } from './index.api';
import { columns, searchFormSchema } from './index.data';
import dayjs from 'dayjs';

// import { useGo } from '/@/hooks/web/usePage';
// const go = useGo()

// 列表页面公共参数、方法
const { tableContext, onExportXls } = useListPage({
  designScope: 'enterprise-library',
  tableProps: {
    showIndexColumn: true,
    api: enterpriseEntMangerRecordReportList,
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
        ['Date', ['startDate', 'endDate'], 'YYYY-MM-DD']
      ]
    },
    actionColumn: false,
  },
  exportConfig: {
    name: () => `服务月报表${dayjs(new Date()).format('YYYYMMDDHHmmss')}`,
    url: getExportUrl,
  },
});

const [registerTable] = tableContext;


</script>

<style></style>