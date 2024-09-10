<template>
  <div class="report">
    <div class="search">
      <a-button type="primary" preIcon="ant-design:export-outlined" @click="handleExport"> 导出</a-button>
    </div>
    <div class="content">
      <div class="report-list">
        <div class="title">自动报告库</div>
        <div class="filter-input">
          <a-input v-model:value="projectName" placeholder="请输入" @change="handleProjectNameChange" />
        </div>
        <div class="list">
          <div
            :class="['item', { active: item.key === activeReportId }]"
            v-for="item in reportList"
            :key="item.key"
            @click="() => handleReportClick(item)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
      <div class="table-list">
        <BasicTable @register="indicatorRegisterTable" :rowSelection="rowSelection">
          <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
          </template>
        </BasicTable>
      </div>
    </div>
    <distributionModal @register="registerDistributionModal" @success="reload" />
  </div>
</template>

<script lang="ts" setup name="autoReport">
  import { ref } from 'vue';
  import { useDebounceFn } from '@vueuse/core';
  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { deleteReport, getReportList, getReportTypeList } from '/@/api/intelligentReport';
  import { exportMethod } from '/@/utils/file/download';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import distributionModal from './components/distributionModal.vue';
  import { PerformanceTypeEnum, indicatorColumns } from './index.data';

  const router = useRouter();

  // 分发modal
  const [registerDistributionModal, { openModal: openDistributionModal }] = useModal();

  // 分类
  const reportList = ref<{ label: string; key: string }[]>([]);
  const activeReportId = ref('');
  const activeReportName = ref('');
  const projectName = ref('');
  const handleReportClick = (record) => {
    activeReportId.value = record.key;
    activeReportName.value = record.label;
    reload();
  };
  const getReportTypeListApi = () => {
    getReportTypeList({ projectName: projectName.value }).then((res) => {
      reportList.value = res.map((i) => ({
        label: i.name,
        key: i.id,
      }));

      if (reportList.value.length) {
        activeReportId.value = reportList.value[0].key;
        activeReportName.value = reportList.value[0].label;
        reload();
      }
    });
  };

  const handleProjectNameChange = useDebounceFn(getReportTypeListApi, 500);

  getReportTypeListApi();

  // 列表数据
  const { tableContext: indicatorTableContext } = useListPage({
    tableProps: {
      title: '',
      api: getReportList,
      columns: indicatorColumns,
      size: 'small',
      useSearchForm: false,
      showTableSetting: false,
      actionColumn: {
        width: 220,
      },
      rowKey: 'id',
      beforeFetch(params) {
        params.projectId = activeReportId.value;
      },
      rowSelection: { type: 'checkbox' },
      immediate: false,
      pagination: false,
    },
  });
  const [indicatorRegisterTable, { reload }, { rowSelection, selectedRowKeys }] = indicatorTableContext;

  const onPreviewClick = (record) => {
    const path = `/intelligentReportManagement/autoReport/${
      record.reportType === PerformanceTypeEnum.QUOTA ? 'indicatorPerformance' : 'areaPerformance'
    }`;

    router.push({
      path,
      query: {
        id: record.id,
        reportName: record.reportName,
        type: record.reportType,
      },
    });
  };

  function getTableAction(record): ActionItem[] {
    return [
      {
        label: '预览',
        onClick: () => onPreviewClick(record),
      },
      {
        label: '分发',
        auth: 'autoReport:distribute',
        onClick: () =>
          openDistributionModal(true, {
            reportId: record.id,
          }),
      },
      {
        label: '删除',
        color: 'error',
        ifShow: () => {
          return record.isSend == '0';
        },
        popConfirm: {
          title: '是否确认删除',
          confirm: async () => {
            await deleteReport({
              reportId: record.id,
            });
            reload();
          },
        },
      },
    ];
  }

  const handleExport = () => {
    if (!selectedRowKeys.value.length) {
      return message.error('请先勾选报表主题名称');
    }

    exportMethod(
      '/project/projectReport/export',
      `${activeReportName.value}-${dayjs().format('YYYYMMDD')}.zip`,
      {
        reportIds: selectedRowKeys.value,
        projectId: activeReportId.value,
      },
      'post'
    );
  };
</script>

<style lang="less" scoped>
  [data-theme='dark'] {
    .report {
      .search {
        color: #c9d1d9;
        background: #151515;
      }
      .content {
        background: #151515;
        .report-list {
          border-right: 1px solid #303030;
        }
      }
    }
  }
  [data-theme='light'] {
    .report {
      .search {
        color: #000000d9;
        background: #fff;
      }
      .content {
        background: #fff;
        .report-list {
          border-right: 1px solid #eaeaea;
        }
      }
    }
  }
  .report {
    padding: 10px;
    .search {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 10px;
      margin-bottom: 10px;
      padding: 10px;
      /deep/ .ant-form {
        padding: 10px;
        .ant-form-item {
          margin-bottom: 0;
        }
      }
    }
    .content {
      display: flex;
      .report-list {
        width: 30%;
        padding: 12px 0;
        .title {
          margin-bottom: 10px;
          padding: 10px 20px;
          background: #4476f7;
          color: #fff;
        }
        .list {
          .item {
            padding: 0 19px;
            font-size: 14px;
            height: 36px;
            line-height: 36px;
            color: #666666;
            cursor: pointer;
          }
          .item.active {
            color: #4476f7;
            background-color: #ecf0ff;
          }
        }
      }

      .table-list {
        width: 70%;
      }
    }
  }
</style>
