<template>
  <div class="statistics-table">
    <div class="title">
      <div>
        <a-radio-group v-model:value="type" button-style="solid" @change="handleRadioChange">
          <a-radio-button value="0">我要咨询数据分析</a-radio-button>
          <a-radio-button value="1">我要投诉数据分析</a-radio-button>
        </a-radio-group>
      </div>
      <nav>
        <a-button class="white" v-if="hasPermission('statistics-analysis-download')" @click="download" :loading="downloadloading">下载</a-button>
        <!-- <a-range-picker
          :disabled="loading && eleTable?.loading"
          v-model:value="value"
          @change="handleChange"
          :disabled-date="disabledDate"
          :getCalendarContainer="
            (triggerNode) => {
              return triggerNode.parentNode;
            }
          "
          :allowClear="false"
        /> -->
        <a-range-picker
          v-model:value="date"
          @change="pickerChange"
          format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          :getCalendarContainer="(trigger) => trigger.parentNode"
        />
      </nav>
    </div>
    <div class="statistics-table-template">
      <div class="statistics-table-template-card">
        <div class="loading" v-show="loading">
          <a-spin size="large" />
        </div>
        <card :card="resData.card" :type="type" />
      </div>
      <div class="statistics-table-template-table">
        <mytable ref="eleTable" :type="type" :time="value" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  import { getconsultingDataAnalysis, geteventTypeAnalysisPage, statisticsConsultingDataAnalysisExport } from '/@/api/dataAnalysis';
  import { ref, reactive, onMounted } from 'vue';
  import mytable from './components/mytable.vue';
  import card from './components/card.vue';
  import moment from 'moment';
  import dayjs from 'dayjs';
  const date = ref([dayjs().startOf('month'), dayjs()]);

  let nDate = new Date();
  let st = nDate.getMonth() + 1;
  let et = nDate.getDate();
  let yt = nDate.getFullYear();
  let type = ref('0');
  let loading = ref(true);
  let value = ref([yt + '-' + st + '-' + 1, yt + '-' + st + '-' + et]);
  let resData = reactive({
    card: {},
    table: {},
  });
  let startDate = ref('');
  let endDate = ref('');
  let startDateTime = ref('');
  let endDateTime = ref('');
  let eleTable = ref(null);
  let downloadloading = ref(false);
  // 时间选择器操作事件
  const pickerChange = () => {
    getData();
  };
  const download = () => {
    downloadloading.value = true;
    const [startDate, endDate] = date.value;
    let param = {
      strTime: dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00',
      endTime: dayjs(endDate).format('YYYY-MM-DD') + ' 23:59:59',
      type: type.value,
      pageNo: eleTable.value.pagination.current,
    };
    let start = startDateTime.value;
    let end = endDateTime.value;
    let fileName = `${type.value == 0 ? '我要咨询数据分析' : '我要投诉数据分析'}统计分析 ${start}-${end}.xls`;
    statisticsConsultingDataAnalysisExport(param, fileName)
      .then((res) => {})
      .finally(() => {
        downloadloading.value = false;
      });
  };
  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  const handleRadioChange = () => {
    getData();
  };
  const handleChange = () => {
    getData();
  };

  const getData = () => {
    loading.value = true;
    const [startDate, endDate] = date.value;
    let param = {
      strTime: dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00',
      endTime: dayjs(endDate).format('YYYY-MM-DD') + ' 23:59:59',
      type: type.value,
    };
    getconsultingDataAnalysis(param)
      .then((res) => {
        resData.card = res;
      })
      .finally(() => {
        loading.value = false;
      });

    eleTable.value.init(date.value, type.value);
  };
  onMounted(() => {
    getData();
  });
</script>

<style lang="less" scoped>
  .statistics-table-template-card {
    height: 230px;
    width: 30.5%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-content: flex-start;
    position: relative;
  }

  .statistics-table {
    margin-top: 20px;
    padding: 14px 20px;
    background: white;
    border-radius: 10px;

    .statistics-table-template {
      margin-top: 20px;
      width: 100%;
      display: flex;
      justify-content: space-between;

      .statistics-table-template-table {
        width: 67%;
        min-height: 320.5px;
        position: relative;
      }
    }

    /deep/.ant-radio-button-wrapper-checked {
      border: none !important;
      border-radius: 20px;
    }

    /deep/.ant-radio-button-wrapper {
      border: none;
      border-radius: 20px;

      &::before {
        display: none !important;
      }
    }
  }
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -15%;
    margin-top: -10px;
  }
</style>
