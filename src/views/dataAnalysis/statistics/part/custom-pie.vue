<template>
  <div class="statistics-head-right">
    <div class="title">
      <span>诉求类型分布</span>
      <!-- <a-range-picker
        v-model:value="value2"
        :disabled="!loading"
        :disabled-date="disabledDate"
        :getCalendarContainer='(triggerNode) => { return triggerNode.parentNode }'
        @change="handleChange"
        :allowClear='false' /> -->
      <a-range-picker
        v-model:value="date"
        @change="pickerChange"
        format="YYYY-MM-DD"
        :disabled-date="disabledDate"
        :getCalendarContainer="(trigger) => trigger.parentNode"
      />
    </div>
    <div class="statistics-head-right-echart">
      <div class="shre-echart" id="shre-echart">
        <echart-pie ref="echartPieRef" />
        <div class="loading" v-show="!loading">
          <a-spin size="large" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { getappealType } from '/@/api/dataAnalysis';
  import echartPie from '../components/echart-pie.vue';
  import { ref, onMounted, nextTick } from 'vue';
  import moment from 'moment';
  import dayjs from 'dayjs';
  const date = ref([dayjs().startOf('month'), dayjs()]);
  let resData = ref({});
  let loading = ref(false);
  const echartPieRef = ref(null);
  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };
  // 时间选择器操作事件
  const pickerChange = () => {
    getData();
  };
  const getData = () => {
    loading.value = false;
    const [startDate, endDate] = date.value;
    let param = {
      strTime: dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00',
      endTime: dayjs(endDate).format('YYYY-MM-DD') + ' 23:59:59',
    };

    getappealType(param)
      .then((res) => {
        resData.value = res;
        nextTick(() => {
          echartPieRef.value.getEchart(resData.value);
        });
      })
      .finally(() => {
        loading.value = true;
      });
  };

  onMounted(() => {
    getData();
  });
</script>

<style lang="less" scoped>
  .statistics-head-right-echart {
    margin-top: 15px;
    display: flex;

    .shre-echart {
      width: 100%;
      height: 210px;
      position: relative;
    }
    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: transform(-50%);
      margin-top: -60px;
    }
  }
</style>
