<template>
  <div class="statistics">
    <div class="statistics-head-top">
      <div class="title">
        <span>诉求类型分析</span>
        <nav>
          <a-select v-model:value="province" @change="proChange">
            <template v-for="item in provinceOptions" :key="`${item.value}`">
              <a-select-option :value="item.value">{{ item.label }}</a-select-option>
            </template>
          </a-select>
          <a-button class="white" :loading="downloadloading" @click="download">下载</a-button>
          <a-range-picker
            v-model:value="date"
            @change="pickerChange"
            format="YYYY-MM-DD"
            :disabled-date="disabledDate"
            :getCalendarContainer="(trigger) => trigger.parentNode"
          />
        </nav>
      </div>
      <div class="linechartdiv">
        <div v-if="flag" id="eline" class="eline"></div>
        <div v-else class="text-center leading-273px">暂无数据</div>
        <div class="loading" v-show="loading">
          <a-spin size="large" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import * as echarts from 'echarts';
  import { ref, onMounted, nextTick, onBeforeUnmount, reactive } from 'vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getsatisfactionScoreAnalysis, satisfactionScoreAnalysisExport } from '/@/api/channelAnalysis';
  import moment from 'moment';
  import dayjs from 'dayjs';
  const date = ref([dayjs().startOf('month'), dayjs()]);

  const { hasPermission } = usePermission();
  let loading = ref(true);
  let downloadloading = ref(false);
  let nDate = new Date();
  let st = nDate.getMonth() + 1;
  let et = nDate.getDate();
  let yt = nDate.getFullYear();
  let dateValue = ref([yt + '-' + st + '-' + 1, yt + '-' + st + '-' + et]);
  console.log('dateValue', dateValue);
  let flag = ref(true);
  let startDate = ref('');
  let endDate = ref('');
  let startDateTime = ref('');
  let endDateTime = ref('');
  const province = ref('0');
  //0.工商业联合会;1.惠企综合服务平台;2.12345热线;3.信好办
  const provinceOptions = reactive([
    {
      value: '0',
      label: '工商业联合会',
    },
    {
      value: '1',
      label: '政企通服务平台',
    },
    {
      value: '2',
      label: '12345热线',
    },
    {
      value: '3',
      label: '信好办',
    },
  ]);
  // const timeRange = ref([moment(moment(new Date()).format('YYYY-MM-DD 00:00:00')), moment(moment(new Date()).format('YYYY-MM-DD 23:59:59'))]);
  // const data = reactive({
  //   times: [moment(moment(new Date()).format('YYYY-MM-DD 00:00:00')), moment(moment(new Date()).format('YYYY-MM-DD 23:59:59'))],
  // });
  // 时间选择器操作事件
  const pickerChange = (date, dataList) => {
    startDateTime.value = dataList[0];
    endDateTime.value = dataList[1];
    dataList[0] = dataList[0] + ' 00:00:00';
    dataList[1] = dataList[1] + ' 23:59:59';
    startDate.value = dataList[0];
    endDate.value = dataList[1];
    getsatisfactionScoreAnalysisApi();
  };
  const proChange = (value) => {
    province.value = value;
    getsatisfactionScoreAnalysisApi();
  };
  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };
  const download = () => {
    const [startDate, endDate] = date.value;
    let param = {
      strTime: dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00',
      endTime: dayjs(endDate).format('YYYY-MM-DD') + ' 23:59:59',
      appealType: province.value, //0.工商业联合会;1.惠企综合服务平台;2.12345热线;3.信好办
    };
    downloadloading.value = true;
    let fileName = `诉求类型分析[${param.strTime}-${param.endTime}].xlsx`;
    console.log('fileName', fileName);
    satisfactionScoreAnalysisExport(param, fileName)
      .then((res) => {})
      .finally(() => {
        downloadloading.value = false;
      });
  };

  /** 初始化图表 */
  function initChart(res) {
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (data) => {
          return `<div class='my-echart-tooltip'>
                    <nav class='my-echart-tooltip-title'>${data[0].axisValue}</nav>
                     <nav class='mett-item'>
                        <div class='mett-item-radio'>
                                <nav style='background:${data[0].color}'></nav>
                        </div>
                        <div class='mett-item-content'>
                        <span class='mett-item-title'>
                              数量:
                            </span>
                            <span class='mett-item-count'>
                                ${data[0].data ? data[0].data : '--'} 件
                            </span>

                        </div>
                    </nav>
                </div>`;
        },
      },
      xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon1', 'Tue2', 'Wed3', 'Thu4', 'Fri5', 'Sat6', 'Sun7'],
        axisLabel: {
          rotate: 0, // 旋转30度
          show: true, //这行代码控制着坐标轴x轴的文字是否显示
          textStyle: {
            color: '#333', //x轴上的字体颜色
            fontSize: '12', // x轴字体大小
          },
          interval: 0,
          width: 72,
          // height:40,
          overflow: 'truncate',
          ellipsis: '...',
        },
        triggerEvent: true,
      },
      yAxis: {
        name: '数量/件',
        type: 'value',
        minInterval: 1,
      },
      grid: {
        containLabel: true,
        left: 15,
        top: 28,
        bottom: 0,
        right: 20,
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          barWidth: 25,
          itemStyle: {
            color: '#3B8CE9',
          },
        },
      ],
    };
    nextTick(() => {
      document.getElementById('eline').removeAttribute('_echarts_instance_');
      let dom = document.querySelector('#eline');
      let myChart = echarts.init(dom);
      let xname = [];
      let xdata = [];
      console.log('进来的是', res);
      res?.forEach((item) => {
        xname.push(item.name);
        xdata.push(item.value);
        axisValueMap[item.departName] = { ...item };
      });
      option.xAxis.data = xname;
      option.series[0].data = xdata;
      myChart.setOption(option);
      const resizeObserver = new window.ResizeObserver(() => {
        myChart.resize();
      });
      resizeObserver.observe(document.querySelector('.statistics-echart'));
    });
  }

  function getsatisfactionScoreAnalysisApi() {
    const [startDate, endDate] = date.value;
    let param = {
      strTime: dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00',
      endTime: dayjs(endDate).format('YYYY-MM-DD') + ' 23:59:59',
      appealType: province.value, //0.工商业联合会;1.惠企综合服务平台;2.12345热线;3.信好办
    };
    loading.value = true;
    getsatisfactionScoreAnalysis(param)
      .then((res) => {
        if (res) {
          flag.value = true;
          initChart(res);
        } else {
          flag.value = false;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }

  // x轴数据对应映射数据
  const axisValueMap = {};
  onMounted(() => {
    getsatisfactionScoreAnalysisApi();
  });

  onBeforeUnmount(() => {
    let dom = document.querySelector('#eline');
    let myChart = echarts.init(dom);
    myChart.dispose();
  });
</script>

<style lang="less" scoped>
  .statistics-head-top {
    padding: 30px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 2px;
  }
  .title {
    display: flex;
    justify-content: space-between;
  }
  .title span {
    color: #333;
    font-size: 16px;
    font-weight: 800;
  }
  .eline {
    width: 100%;
    height: 273px;
  }
  .linechartdiv {
    width: 100%;
    height: 273px;
    position: relative;

    .loading {
      position: absolute;
      left: 0px;
      top: 0px;
      right: 0px;
      bottom: 0px;
      background-color: rgba(255, 255, 255, 0.4);
      display: flex;

      div {
        margin: auto;
      }
    }
  }
  .white {
    width: 100px;
    height: 34px;
    border-radius: 7px;
    color: #fff;
    margin: 0 20px;
    background: #3b8ce9;
  }
</style>
