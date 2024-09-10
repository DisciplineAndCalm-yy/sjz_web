<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2024-02-28 18:07:00
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-03-08 11:27:11
 * @FilePath: \yst-city-shijiazhuang-web\src\views\businessScreen\components\screenMap.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="echarts-box">
    <div class="chartRef" ref="chartRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { useECharts } from '/@/hooks/web/useECharts';
import { getIndicatorManifestation } from '/@/api/businessScreen/businessScreen'
import { ref, Ref, reactive, watchEffect, watch } from 'vue';

const props = defineProps(['year'])

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions, echarts } = useECharts(chartRef as Ref<HTMLDivElement>);


const chartData = ref([])

const option = reactive({
  color: {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [{
        offset: 0, color: '#0bc4f8' // 0% 处的颜色
    }, {
        offset: 1, color: '#02f5fb' // 100% 处的颜色
    }],
    global: false // 缺省为 false
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      // label: {
      //   backgroundColor: 'rgba(75, 239, 255,.2)',
      // },
    },
    textStyle: {
      color: '#fff'
    },
    borderWidth: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // formatter: '{a0}: {c0}<br />{a1}: {c1}'
  },
  legend: {
    show: false,
  },
  xAxis: {
    type: 'category',
    axisLine: {
      show: false,
      lineStyle: {
        color: '#fff',
      },
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      overflow: 'truncate',
      interval: 0,
      rotate: 0
    },
  },
  yAxis: [
    {
      type: 'value',
      name: '得分',
      nameLocation: 'end',
      nameTextStyle: {
        color: '#3F6FA5',
      },
      axisLine: {
        show: true,
        color: '#759fcd'
      },
      axisLabel: {
        show: true,
        color: '#3F6FA5'
      },
      splitLine: false,
    },
    {
      type: 'category',
      name: '档次',
      nameLocation: 'start',
      nameTextStyle: {
        color: '#3F6FA5',
      },
      data: ['A','B','C'],
      axisLine: {
        color: '#759fcd'
      },
      axisLabel: {
        show: true,
        color: '#3F6FA5'
      },
      splitLine: true,
      inverse: true,
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  grid: {
    top: '20%',
    left: '3%',
    height: '60%',
    width: '94%',
  },
  series: [
    {
      type: 'pictorialBar',
      name: '得分',
      yAxisIndex: 0,
      symbol: 'path://M0,10 L10,10 C9.5,10,5.5,5,5,0 C4.5,5,1.5,8,0,10 Z',
      data: [],
      // barMaxWidth: '30px',
    },
    {
      type: 'line',
      name: '档次',
      yAxisIndex: 1,
      smooth: true,
      data: [],
    }
  ],
  // dataset: {
  //   source: chartData.value,
  //   dimensions: ['name', 'value', {name: 'value2', type: 'ordinal'}]
  // }
})


async function init() {
  let res =  await getIndicatorManifestation({year: props.year})
  chartData.value = res || []
  initCharts()
}


function initCharts() {
  let xAxisData = chartData.value.map(item => item.indicatorName)
  let s1Data =chartData.value.map(item => item.score)
  let s2Data =chartData.value.map(item => item.indicatorLevel)
  option.series[0].data = s1Data
  option.series[1].data = s2Data
  option.xAxis.data = xAxisData
  setOptions(option);
}

watch(
  () => props.year,
  () => {
    init()
  },
  // {
  //   immediate: true,
  // }
)
</script>

<style lang="less" scoped>
.echarts-box {
  height: 100%;
  width: 100%;
  .chartRef {
    height: 100%;
    width: 100%;
  }
}
</style>