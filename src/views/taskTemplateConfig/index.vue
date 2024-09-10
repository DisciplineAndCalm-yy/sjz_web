<template>
  <BasicTable @register="registerTable" :rowSelection="rowSelection">
    <template #tableTitle>
      <a-button type="primary" @click="router.push({ path: '/taskTemplateConfig/edit' })">新建督办模板</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'switchFlagDesc'">
        <a-switch v-model:checked="record.switchFlag" checkedValue="1" unCheckedValue="0" @click="(val) => handleSwitch(val, record)" />
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
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, searchFormSchema } from './index.data';
  import { useRouter, useRoute } from 'vue-router';
  import { getTemplateList, enableTemplate, getTemplateDetail } from '/@/api/taskTemplateConfig';
  import { useMessage } from '/@/hooks/web/useMessage'

  const router = useRouter();
  const route = useRoute();
  const query = route.query;
  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    tableProps: {
      title: '督办模板',
      // dataSource: [{}],
      immediate: true,
      api: getTemplateList,
      columns: columns,
      size: 'small',
      scroll: { x: 1300 },
      useSearchForm: !query.id,
      formConfig: {
        labelWidth: 100,
        schemas: searchFormSchema,
        showAdvancedButton: false,
      },
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
      rowKey: 'templateId',
      rowSelection: {
        preserveSelectedRowKeys: false,
      },
    },
  });

  const [registerTable, , { rowSelection }] = tableContext;

  const { createMessage } = useMessage();

  async function initData() {}
  initData();

  function getTableAction(record): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: () => {
          getTemplateDetail({ templateId: record.templateId }).then((res) => {
            if (res.switchFlag === '1') {
              createMessage.error('操作失败，当前督办模板已开启，不允许编辑');
            } else {
              router.push({
                path: '/taskTemplateConfig/edit',
                query: {
                  templateId: record.templateId,
                },
              });
            }
          });
        },
      },
    ];
  }

  const handleSwitch = (status, record) => {
    enableTemplate({ switchFlag: status, templateId: record.templateId, webComponent: 'supervise/index' }).then(
      (res) => {
        console.log(res, 'res');
      },
      () => {
        record.switchFlag = record.switchFlag === '1' ? '0' : '1';
      }
    );
  };
</script>

<style lang="less" scoped>
  .tips {
    margin: 10px;
    color: red;
  }

  .weight {
    max-width: 200px;
  }
</style>
