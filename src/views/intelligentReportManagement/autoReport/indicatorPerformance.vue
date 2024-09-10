<template>
  <a-card class="indicator-performance" size="small" :title="reportName">
    <a-table :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)" bordered row-key="id"
      :loading="isLoading" :columns="indicatorColumns" :dataSource="data" :pagination="false" :scroll="{ x: 1100 }" />
    <div class="back">
      <a-button @click="handleBack">返回</a-button>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAutoReportPreview } from '/@/api/intelligentReport';
import { BasicColumn } from '/@/components/Table';

const router = useRouter();
const route = useRoute();
const reportId = ref(route.query.id);
const reportName = ref(route.query.reportName);

// 列表数据
const indicatorColumns: BasicColumn[] = [
  {
    title: '指标名称（一级指标及二级指标）',
    width: 300,
    dataIndex: 'indicatorName',
  },
  {
    title: '全省平均分',
    align: 'center',
    width: 150,
    dataIndex: 'avgScore',
  },
  {
    title: '最佳实践',
    align: 'center',
    children: [
      {
        title: '城市',
        width: 200,
        align: 'center',
        dataIndex: 'bestCity',
      },
      {
        title: '得分',
        width: 70,
        align: 'center',
        dataIndex: 'bestScore',
      },
    ],
  },
  {
    title: '待进步',
    align: 'center',
    dataIndex: 'unit',
    children: [
      {
        title: '城市',
        width: 200,
        align: 'center',
        dataIndex: 'improvementCity',
      },
      {
        title: '得分',
        width: 70,
        align: 'center',
        dataIndex: 'improvementScore',
      },
    ],
  },
];
const data = ref([]);
const isLoading = ref(false);

const getDetail = () => {
  const params = {
    reportId: reportId.value,
  };

  isLoading.value = true;
  getAutoReportPreview(params).then((res) => {
    data.value = res.scoreMapList;
    isLoading.value = false;
  });
};

getDetail();

const handleBack = () => {
  router.back();
};
</script>

<style lang="less" scoped>
.indicator-performance {
  margin: 10px;

  .back {
    margin-top: 10px;
    text-align: center;
  }
}

[data-doc-theme='light'] .ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}

[data-doc-theme='dark'] .ant-table-striped :deep(.table-striped) td {
  background-color: rgb(29, 29, 29);
}</style>
