<template>
  <BasicTable @register="registerTable" :rowSelection="rowSelection">
    <template #bodyCell="{ column, record }">
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

<script lang="ts" name="system-user" setup>
  import { useRoute, useRouter } from 'vue-router';
  import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, searchFormSchema } from './data';
  import { checkTemplateList, exportCheckAnswer } from '/@/api/smartRating/index';
  import { useMethods } from '/@/hooks/system/useMethods';
  import { exportMethod } from '/@/utils/file/download';
  import {setColor} from '/@/utils/perry'

  //   声明路由
  const router = useRouter();

  // 禁止勾选
  //   const getCheckboxProps = (record) => {
  //     //禁用的方法
  //     return {
  //       disabled: record.activateStatus != '2',
  //     };
  //   };

  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    tableProps: {
      api: checkTemplateList,
      columns: columns,
      striped:true,//斑马纹设置
      size: 'small',
      scroll: { x: 1300 },
      expandRowByClick: true,
      showTableSetting: false,
      formConfig: {
        labelWidth: 150,
        schemas: searchFormSchema,
        showAdvancedButton: false,
        fieldMapToTime: [['createTime', ['startDate', 'endDate'], 'YYYY-MM-DD']],
        resetFunc: async () => {
          // currentAuditStatus.value = 0
        },
      },
      actionColumn: {
        width: 250,
        fixed: 'right',
      },
      rowKey: 'id',
      rowSelection: {
        preserveSelectedRowKeys: false,
        // getCheckboxProps: getCheckboxProps,
      },
      // 请求之前对参数做处理
      beforeFetch(params) {},
    },
  });

  //注册table数据
  const [registerTable, { reload, clearSelectedRowKeys, setColumns, getForm }, { rowSelection, selectedRows, selectedRowKeys }] = tableContext;

  /**
   * 操作栏
   */
  function getTableAction(record): ActionItem[] {
    return [
      //   {
      //     label: '激活',
      //     popConfirm: {
      //       title: '是否确认激活当前采集任务？',
      //       confirm: handleActive.bind(null, record),
      //     },
      //     ifShow: () => {
      //       return record.activateStatus == '1';
      //     },
      //   },
      //   {
      //     label: '配置算法',
      //     onClick: toNextPage.bind(null, record, 'algorithm'),
      //     ifShow: () => {
      //       return record.activateStatus != '1';
      //     },
      //   },
      {
        label: '校核',
        onClick: toNextPage.bind(null, record, 1),
        ifShow: () => {
          return record.checkStatus == '1';
        },
      },
      {
        label: '查看',
        onClick: toNextPage.bind(null, record, 0),
        ifShow: () => {
          return record.checkStatus == '0';
        },
      },
      {
        label: '导出',
        onClick: toExport.bind(null, record),
        // ifShow: () => {
        //   return record.checkStatus == '0';
        // },
      },
      //   {
      //     label: '删除',
      //     popConfirm: {
      //       title: '是否确认删除？',
      //       confirm: handleDelete.bind(null, record),
      //     },
      //     ifShow: () => {
      //       return record.activateStatus == '1';
      //     },
      //   },
    ];
  }
  
  // 数据导出
  const toExport = (record) => {
    exportMethod(exportCheckAnswer, `${record.name}`, { id: record.id });
  };

  // 跳转问题校核页面
  const toNextPage = (record, status) => {
    let queryObj = { id: record.id, name: record.name, status: status };
    router.push({ path: '/smartRating/dataCheckQuestion', query: queryObj });
  };
</script>

<style scoped></style>
