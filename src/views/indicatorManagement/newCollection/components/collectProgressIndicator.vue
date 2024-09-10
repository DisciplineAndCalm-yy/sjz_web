<template>
  <BasicTable @register="indicatorRegisterTable">
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { queryIndicatorProcess } from '/@/api/indicatorManagement';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicTable, BasicColumn, ActionItem, TableAction } from '/@/components/Table';
  import { CollectIndicatorProcess } from '../index.data';
  const props = withDefaults(defineProps<{ pid: string }>(), {
    pid: '',
  });

  const router = useRouter();

  const indicatorColumns: BasicColumn[] = [
    {
      title: '指标名称',
      width: 100,
      align:'left',
      dataIndex: 'indicatorName',
    },
    {
      title: '采集进度',
      width: 100,
      dataIndex: 'answerProcess',
    },
  ];
  const { tableContext: indicatorTableContext } = useListPage({
    tableProps: {
      title: '',
      api: queryIndicatorProcess,
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

  const onDetailClick = (record: CollectIndicatorProcess) => {
    router.push({
      path: '/indicatorManagement/newCollection/thirdIndicatorsDetail',
      query: {
        pid: record.id,
        name: record.indicatorName,
      },
    });
  };

  function getTableAction(record: CollectIndicatorProcess): ActionItem[] {
    return [
      {
        label: '查看',
        onClick: () => onDetailClick(record),
        ifShow: () => {
          return record.includeQuestion === '1';
        },
      },
    ];
  }
</script>
