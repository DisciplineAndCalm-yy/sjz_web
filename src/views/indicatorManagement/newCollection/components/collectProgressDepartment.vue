<template>
  <BasicTable @register="indicatorRegisterTable">
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { queryDepartProcess } from '/@/api/indicatorManagement';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicTable, BasicColumn, TableAction, ActionItem } from '/@/components/Table';
  import { CollectDepartProcess } from '../index.data';
  const props = withDefaults(defineProps<{ pid: string }>(), {
    pid: '',
  });

  const router = useRouter();

  const indicatorColumns: BasicColumn[] = [
    {
      title: '报送部门',
      width: 100,
      dataIndex: 'departName',
      align: 'left'
    },
    {
      title: '填报进度',
      width: 100,
      dataIndex: 'answerProcess',
    },
  ];
  const { tableContext: indicatorTableContext } = useListPage({
    tableProps: {
      title: '',
      api: queryDepartProcess,
      columns: indicatorColumns,
      striped:true,//斑马纹设置
      size: 'small',
      useSearchForm: false,
      showTableSetting: false,
      expandRowByClick: true,
      pagination: false,
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
      rowKey: 'id',
      // 请求之前对参数做处理
      beforeFetch(params) {
        params.id = props.pid;
      },
    },
  });
  const [indicatorRegisterTable] = indicatorTableContext;

  const onDetailClick = (record: CollectDepartProcess) => {
    router.push({
      path: '/indicatorManagement/newCollection/thirdDepartmentDetail',
      query: {
        departId: record.id,
        pid: props.pid,
        departName: record.departName,
      },
    });
  };
  function getTableAction(record: CollectDepartProcess): ActionItem[] {
    return [
      {
        label: '查看',
        onClick: () => onDetailClick(record),
        ifShow: () => {
          return !!record.parentId;
        },
      },
    ];
  }
</script>
