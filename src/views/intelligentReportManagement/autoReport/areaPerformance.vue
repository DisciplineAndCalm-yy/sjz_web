<template>
  <a-card class="area-performance" size="small" :title="reportName">
    <a-row>
      <a-col :span="6">
        <div class="report-list">
          <div class="title">自动报告库</div>
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
      </a-col>
      <a-col :span="18">
        <a-table
          bordered
          row-key="id"
          :loading="isLoading"
          :columns="tableColumns"
          :dataSource="data"
          :pagination="false"
          :scroll="{ x: getTableColumnWidth }"
        />
        <div class="back">
          <a-button @click="handleBack">返回</a-button>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getAutoReportPreview, getFirstLevelList } from '/@/api/intelligentReport';
  import { BasicColumn } from '/@/components/Table';
  import { PerformanceTypeEnum } from './index.data';

  const route = useRoute();
  const router = useRouter();
  const reportId = ref(route.query.id);
  const reportName = ref(route.query.reportName);
  const type = ref<`${PerformanceTypeEnum}`>(route.query.type as `${PerformanceTypeEnum}`);

  // 分类
  const reportList = ref<{ label: string; key: string }[]>([]);
  const activeReportId = ref('');
  const handleReportClick = (record) => {
    activeReportId.value = record.key;
    getList();
  };
  const getAreaReportList = () => {
    getFirstLevelList({
      reportId: reportId.value,
    }).then((res) => {
      reportList.value = res.map((i) => ({
        label: i.name,
        key: i.id,
      }));

      if (reportList.value.length) {
        activeReportId.value = reportList.value[0].key;
        getList();
      }
    });
  };

  getAreaReportList();

  const tableColumns = ref<BasicColumn[]>([]);
  const data = ref([]);
  const isLoading = ref(false);

  const getList = () => {
    const params = {
      reportId: reportId.value,
      indicatorId: activeReportId.value,
    };

    isLoading.value = true;

    getAutoReportPreview(params)
      .then((res) => {
        const { columns, scoreMapList } = res;
        switch (type.value) {
          case PerformanceTypeEnum.AREA:
            tableColumns.value = columns.map((i) => ({
              ...i,
              width: 150,
            }));
            break;
          case PerformanceTypeEnum.LOSE_POINT:
            initAreaColumn();
            break;
        }
        data.value = scoreMapList;
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  // 地县类型表头初始化
  const initAreaColumn = () => {
    tableColumns.value = [
      {
        title: '指标项说明',
        width: 300,
        dataIndex: 'indicatorName',
      },
      {
        title: '归属二级指标',
        width: 200,
        align: 'center',
        dataIndex: 'parentName',
      },
      {
        title: '失分城市占比(%)',
        width: 120,
        align: 'center',
        dataIndex: 'losingCityProportion',
      },
      {
        title: '最佳实践城市',
        width: 200,
        align: 'center',
        dataIndex: 'bestCity',
      },
      {
        title: '失分城市',
        width: 200,
        align: 'center',
        dataIndex: 'losingCity',
      },
    ];
  };

  const getTableColumnWidth = computed(() =>
    tableColumns.value.reduce((prev, next) => {
      return prev + Number(next.width);
    }, 0)
  );

  const handleBack = () => {
    router.back();
  };
</script>

<style lang="less" scoped>
  .area-performance {
    margin: 10px;

    .report-list {
      height: 100%;
      padding-bottom: 12px;
      border-right: 1px solid #f0f0f0;
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
    .back {
      margin-top: 10px;
      text-align: center;
    }
  }
</style>
