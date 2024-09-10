<template>
  <div class="title">
    <span>处理评价满意度 </span>
    <!-- <a-range-picker
      v-model:value="value"
      @change="handleChange"
      :disabled="loading"
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
  </div>
  <div class="chartdiv">
    <div v-if="flag" id="rose" class="rose"></div>
    <div v-else class="text-center leading-273px">暂无数据</div>
    <div class="loading" v-show="loading">
      <a-spin size="large" />
    </div>
  </div>
</template>

<script setup>
  import * as echarts from 'echarts';
  import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
  import { getsatisfactionAnalysis } from '/@/api/dataAnalysis';
  import moment from 'moment';
  import dayjs from 'dayjs';
  const date = ref([dayjs().startOf('month'), dayjs()]);

  let nDate = new Date();
  let st = nDate.getMonth() + 1;
  let et = nDate.getDate();
  let yt = nDate.getFullYear();
  let type = ref('a');
  let value = ref([yt + '-' + st + '-' + 1, yt + '-' + st + '-' + et]);
  let loading = ref(true);
  let flag = ref(true);
  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };
  let startDate = ref('');
  let endDate = ref('');
  let startDateTime = ref('');
  let endDateTime = ref('');
  // 时间选择器操作事件
  const pickerChange = (date, dataList) => {
    // startDateTime.value = dataList[0];
    // endDateTime.value = dataList[1];
    // dataList[0] = dataList[0] + ' 00:00:00';
    // dataList[1] = dataList[1] + ' 23:59:59';
    // startDate.value = dataList[0];
    // endDate.value = dataList[1];
    getData();
  };
  onMounted(() => {
    getData();
  });

  let getData = () => {
    loading.value = true;
    let option = {
      legend: {
        top: 'bottom',
      },
      toolbox: {
        show: true,
        // feature: {           //操作导出什么的
        //     mark: { show: true },
        //     dataView: { show: true, readOnly: false },
        //     restore: { show: true },
        //     saveAsImage: { show: true }
        // }
      },
      tooltip: {},
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['0%', '62%'],
          center: ['50%', '42%'],
          // roseType: 'area',        //玫瑰图的设置
          itemStyle: {
            color: function (colors) {
              let colorList = ['rgba(59,140,233,1)', 'rgba(59,140,233,.8)', 'rgba(59,140,233,.6)', 'rgba(59,140,233,.4)', 'rgba(59,140,233,.2)'];
              return colorList[colors.dataIndex];
            },
            // borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          data: [
            { value: 40, name: 'rose 1' },
            { value: 38, name: 'rose 2' },
            { value: 32, name: 'rose 3' },
            { value: 30, name: 'rose 4' },
            { value: 39, name: 'rose 5' },
          ],
        },
      ],
    };
    const [startDate, endDate] = date.value;
    let param = {
      strTime: dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00',
      endTime: dayjs(endDate).format('YYYY-MM-DD') + ' 23:59:59',
    };
    getsatisfactionAnalysis(param)
      .then((res) => {
        if (res) {
          console.log('++++++++++++', res);
          flag.value = true;
          res.map((v) => {
            (v.name = v.optionScore), (v.value = v.optionOf);
          });
          option.series[0].data = res;
          nextTick(() => {
            document.getElementById('rose').removeAttribute('_echarts_instance_');
            let dom = document.querySelector('#rose');
            let myChart = echarts.init(dom);
            myChart.clear();
            myChart.setOption(option);
            const resizeObserver = new window.ResizeObserver(() => {
              myChart.resize();
            });
            resizeObserver.observe(document.querySelector('.jeecg-default-layout-main'));
            window.onresize = () => {
              if (window.innerWidth < 1440) {
                option.series[0].radius = ['0%', '65%'];
              } else {
                option.series[0].radius = ['0%', '75%'];
              }
              myChart.setOption(option);
            };
          });
        } else {
          flag.value = false;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  };
  const handleChange = () => {
    getData();
  };

  onBeforeUnmount(() => {
    let dom = document.querySelector('#rose');
    let myChart = echarts.init(dom);
    myChart.dispose();
  });
</script>

<style lang="less" scoped>
  .rose {
    width: 100%;
    height: 273px;
  }
  .chartdiv {
    width: 100%;
    height: 273px;
    position: relative;
  }
</style>
