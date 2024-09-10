<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-12 10:04:42
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-05-16 16:05:12
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/service-log/index.vue
 * @Description  : 服务记录
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <BasicTable @register="registerTable">
    <!--操作栏-->
    <!-- <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template> -->
  </BasicTable>
</template>

<script lang="ts" setup name="service-service-log">
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { enterpriseEntMangerRecordList, qixianMangerMangerServiceRecord } from './index.api';
import { columns, searchFormSchema, apiType } from './index.data';
import { nextTick, watch } from 'vue';

// import { useGo } from '/@/hooks/web/usePage';
// const go = useGo()
// 列表页面公共参数、方法
const { tableContext } = useListPage({
  designScope: 'enterprise-library',
  tableProps: {
    showIndexColumn: true,
    api: enterpriseEntMangerRecordList,
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
      ],
      resetFunc() {
        console.log('rest');
        resetFunc()
        return new Promise(() => {
          Promise.resolve()
        })
      }
    },
    actionColumn: false,
    beforeFetch(params) {
      if (params.type !== 'zf') {
        params.mangerName = params.realName || ''
        delete params.realName
      }
      return params
    },
    afterFetch(data) {
      if (apiType.value !== 'zf') {
        return data.map(current => {
          return {
            ...current,
            realName: current.mangerName,
            type: 'sq',
            entName: current.enterprise,
            createTime: current.serviceTime
          }
        })
      }
    }
  },
});

const [registerTable, { setProps, getForm, reload }] = tableContext;

var resetFunc = () => {
  try {
    const { setFieldsValue } = getForm()
    setFieldsValue({
      type: 'zf'
    })
    apiType.value = 'zf'
    nextTick(() => {
      reload()
    })
  } catch (_) {

  }
}

watch(apiType, () => {
  if (apiType.value === 'zf') {
    setProps({
      api: enterpriseEntMangerRecordList
    })
  } else {
    setProps({
      api: qixianMangerMangerServiceRecord
    })
  }

})

/**
* 操作栏
*/
function getTableAction(record): ActionItem[] {
  return [
    {
      label: '详情',
      onClick: () => {
        console.log(record);
        // go(`/service/enterprise-library/details?id=${record.entId}`)
      },
      // ifShow: () => hasPermission('system:user:edit'),
    },
  ];
}

</script>

<style></style>