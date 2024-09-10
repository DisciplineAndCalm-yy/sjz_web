<template>
  <BasicTable @register="registerTable" :rowSelection="rowSelection">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'checkStatusText'">
        <a-tag :color="setColor('checkStatus', record.checkStatus)" v-if="record.checkStatus == 0 || record.checkStatus == 1">{{
          record.checkStatusText
        }}</a-tag>
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
  import { scoreTemplateList } from '/@/api/smartRating/index';
  import { setColor } from '/@/utils/perry';

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
      api: scoreTemplateList,
      columns: columns,
      striped: true, //斑马纹设置
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
        label: '评分预览',
        onClick: toNextPage.bind(null, record, 'new'),
        ifShow: () => {
          return record.activateStatus == '3';
        },
      },
      // {
      //   label: '查看',
      //   onClick: toNextPage.bind(null, record, 'new'),
      //   ifShow: () => {
      //     return record.checkFlag == '是';
      //   },
      // },
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

  // 跳转评分预览页面
  const toNextPage = (record) => {
    let showBtn = record.reportStatus == '0' && record.checkStatus == '0' && record.activateStatus == '3' ? '0' : '1';
    let queryObj = { id: record.id, name: record.name, showBtn: showBtn };
    router.push({ path: '/smartRating/evaluatePrediction', query: queryObj });
  };
</script>

<style scoped></style>
