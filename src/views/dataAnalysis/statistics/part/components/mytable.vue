<template>
  <!-- :scroll="scrollMax" 滚动条-->
  <a-table :columns="columns" :data-source="data" size="small" @change="handleChange" :pagination="pagination">
    <template #ranking="{ text, record, index }">
      <!-- <span v-if="index == 0" :style="{ 'background': '#3B8CE9' }" class="ranking-icon"></span>
      <span v-if="index == 1" :style="{ 'background': '#5BC374' }" class="ranking-icon"></span>
      <span v-if="index == 2" :style="{ 'background': '#EA6672' }" class="ranking-icon"></span>
      <span v-if="index > 2" :style="{ 'background': '#F5F5F5' }" class="ranking-icon"></span>
      {{ text }} -->

      <template v-if="pagination.current == 1">
        {{ index + 1 }}
      </template>
      <template v-else>
        {{ index + 1 + pagination.pageSize * (pagination.current - 1) }}
      </template>
    </template>

    <template #item="{ text, record, index }">
      <div class="option-text">
        <a-tooltip placement="top">
          <template #title>
            <span>{{ text }}</span>
          </template>
          <span class="option-text-span">{{ text }}</span>
        </a-tooltip>
      </div>
    </template>
    <template #percentage="{ text, record, index }">
      <span>{{ text }}%</span>
    </template>
  </a-table>
  <div class="loading" v-show="loading">
    <a-spin size="large" />
  </div>
</template>
<script>
  import { geteventTypeAnalysisPage } from '/@/api/dataAnalysis';
  import { ref, reactive, defineProps, watch, computed, nextTick, watchEffect, defineComponent } from 'vue';
  import moment from 'moment';
  import dayjs from 'dayjs';
  export default {
    setup() {
      let scrollMax = reactive({ y: '180' });
      let loading = ref(true);
      let pagination = reactive({
        pageSize: 5,
        // current: 1,
        total: 0,
      });
      let time = ref();
      let type = ref();
      let initParam = reactive({
        time: null,
        type: 0,
      });
      let init = (time, type) => {
        initParam.time = time;
        initParam.type = type;
        pagination.current = 1;
        pagination.total = 0;
        getTable();
      };
      let getTable = () => {
        const [startDate, endDate] = initParam.time;
        let param = {
          strTime: dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00',
          endTime: dayjs(endDate).format('YYYY-MM-DD') + ' 23:59:59',
          pageSize: pagination.pageSize,
          pageNo: pagination.current,
          type: initParam.type,
        };
        loading.value = true;
        geteventTypeAnalysisPage(param)
          .then((res) => {
            pagination.total = res.totalCount;
            data.length = 0;
            data.push(...res.pages);
          })
          .finally(() => {
            loading.value = false;
          });
      };
      const handleChange = (obj) => {
        pagination.current = obj.current;
        getTable();
      };
      const tableTitle = computed(() => {
        return Number(initParam.type) ? '我要投诉量' : '我要咨询量';
      });
      const columns = reactive([
        {
          title: '排名',
          width: 40,
          dataIndex: 'ranking',
          key: 'ranking',
          slots: { customRender: 'ranking' },
        },
        {
          title: '部门名称',
          dataIndex: 'departName',
          key: 'departName',
          ellipsis: true,
          width: '28%',
          slots: { customRender: 'departName' },
        },
        // {
        //   title: '接收量',
        //   ellipsis: true,
        //   width: 80,
        //   dataIndex: 'receivingVolume',
        //   key: 'receivingVolume',
        // },
        {
          title: tableTitle,
          // title: '我要投诉量',
          ellipsis: true,
          width: 80,
          dataIndex: 'receivingVolume',
          key: 'receivingVolume',
        },
        {
          title: '处理中',
          ellipsis: true,
          width: 80,
          dataIndex: 'processingVolume',
          key: 'processingVolume',
        },
        {
          title: '完成量',
          ellipsis: true,
          width: 80,
          dataIndex: 'completedQuantity',
          key: 'completedQuantity',
        },
        // {
        //   title: '转派量',
        //   ellipsis: true,
        //   width: 80,
        //   dataIndex: 'transferVolume',
        //   key: 'transferVolume',
        // },
        // {
        //   title: '工单完成占比',
        //   width: 120,
        //   dataIndex: 'workProportion',
        //   ellipsis: true,
        //   key: 'workProportion',
        //   slots: { customRender: 'percentage' },
        // },
        {
          title: '工单平均处理时间（天）',
          dataIndex: 'workOrderTime',
          ellipsis: true,
          key: 'workOrderTime',
          width: 130,
        },
        // {
        //   title: '工单处理及时率',
        //   dataIndex: 'workTimelinessRate',
        //   ellipsis: true,
        //   key: 'workTimelinessRate',
        //   width: 100,
        //   slots: { customRender: 'percentage' },
        // },
      ]);

      const data = reactive([]);
      return {
        scrollMax,
        pagination,
        columns,
        data,
        handleChange,
        getTable,
        time,
        type,
        init,
        initParam,
        loading,
        tableTitle,
      };
    },
  };
</script>
<style scoped>
  .ranking-icon {
    width: 12px;
    height: 8px;
    border-radius: 8px;
    display: inline-block;
  }

  .option-text {
    padding-left: 14px;
  }

  .option-text-span {
    height: 20px;
    line-height: 25px;
    max-width: 100%;
    margin: auto;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

<style>
  .statistics th {
    text-align: center !important;
  }

  .statistics td {
    text-align: center !important;
  }
  .loading {
    position: absolute;
    top: 30%;
    left: 50%;
  }
</style>
