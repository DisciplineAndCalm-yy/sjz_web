<template>
  <div class="title">
    <span>各部门评价满意排名</span>
    <nav>
      <a-button v-if="hasPermission('statistics-analysis-download')" class="white" :loading="downloadloading" @click="download">下载</a-button>
      <!-- <a-range-picker
        v-model:value="value"
        @change="handleChangeDate"
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
        @change="handleChangeDate"
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
    <div v-show="flagNoneData" class="text-center leading-273px none-data">暂无数据</div>
  </div>
</template>

<script setup>
  import * as echarts from 'echarts';
  import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getsatisfactionScoreAnalysis, satisfactionScoreAnalysisExport } from '/@/api/dataAnalysis';
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
  let value = ref([yt + '-' + st + '-' + 1, yt + '-' + st + '-' + et]);
  let flag = ref(true);
  let flagNoneData = ref(true);
  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };
  let startDate = ref('');
  let endDate = ref('');
  let startDateTime = ref('');
  let endDateTime = ref('');
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
  function handleChangeDate() {
    getsatisfactionScoreAnalysisApi();
  }

  const download = () => {
    downloadloading.value = true;
    const [startDate, endDate] = date.value;
    let param = {
      strTime: dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00',
      endTime: dayjs(endDate).format('YYYY-MM-DD') + ' 23:59:59',
    };
    let fileName = `各部门评价满意排名[${param.strTime}-${param.endTime}].xlsx`;
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
          console.log(data, '各部门评价满意排名各部门评价满意排名');
          return `<div class='my-echart-tooltip'>
                    <nav class='my-echart-tooltip-title'>${data[0].axisValue}</nav>
                     <nav class='mett-item'>
                        <div class='mett-item-radio'>
                                <nav style='background:${data[0].color}'></nav>
                        </div>
                        <div class='mett-item-content'>
                        <span class='mett-item-title'>
                                整体得分
                            </span>
                            <span class='mett-item-count'>
                                ${data[0].data ? data[0].data : '--'}
                            </span>

                        </div>
                    </nav>


                     <nav class='mett-item'>
                        <div class='mett-item-radio'>
                            <nav style='background:${data[0].color};opacity:0.4;'></nav>
                        </div>
                        <div class='mett-item-content'>
                            <span class='mett-item-title'>
                                样本量
                            </span>
                            <span class='mett-item-count'>
                               ${axisValueMap[data[0].axisValue].sample}
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
        name: '分',
        type: 'value',
      },
      grid: {
        containLabel: true,
        left: 0,
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
      res?.forEach((item) => {
        xname.push(item.departName);
        xdata.push(item.srcoe);
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
    };

    loading.value = true;
    getsatisfactionScoreAnalysis(param)
      .then((res) => {
        if (res.length == 0) {
          flagNoneData.value = true;
        } else {
          flagNoneData.value = false;
        }
        if (res) {
          initChart(res);
          flag.value = true;
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
  .eline {
    width: 100%;
    height: 273px;
  }
  .title {
    width: 100%;
    height: 32px;
    line-height: 32px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;

    span {
      font-size: 16px;
      font-weight: 600;
    }

    .ant-calendar-picker {
      width: 260px;
    }

    nav {
      button {
        margin-right: 20px;
      }
    }
  }
  .none-data {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #fff;
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
</style>
