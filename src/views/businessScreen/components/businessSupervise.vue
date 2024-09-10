<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2024-02-28 18:07:00
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-03-20 14:27:04
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
import { getTypeProportion } from '/@/api/businessScreen/businessScreen'
import { ref, Ref, reactive, watchEffect, watch } from 'vue';
import pieBg from '/@/assets/images/businessScreen/pie-bg.png'
// const props = defineProps(['year'])

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions, echarts } = useECharts(chartRef as Ref<HTMLDivElement>);


const chartData = ref([
  {name: '图例1', value: 23},
  {name: '图例2', value: 33},
  {name: '图例3', value: 53},
  {name: '图例4', value: 43},
  {name: '图例5', value: 13},
])

const option = reactive({
  color: ['#0084FF', '#9AF4FF', '#DF6868', '#FFE400', '#62FFC2'],
  series: [
    {
      type: 'pie',
      radius: ['60%', '75%'],
      itemStyle: {
        borderWidth: 5,
        borderColor: '#01238C'
      },
      label: {
        show: true,
        // aliginTo: 'labelLine',
        formatter: '{b|{b}}\n{d|{c}%}',
        rich: {
          b: {
            color: '#fff',
            lineHeight: 18,
            fontSize: 14,
          },
          d: {
            color: '#FFE400',
            fontWeight: 'bold',
            fontSize: 14,
            // lineHeight: 18,
          }
        },
      },
      labelLayout: {
        hideOverlap: false
      },
      data: []
    }
  ],
  graphic: [
    {
      type: 'image',
      style: {
        image: pieBg,
        width: 233,
        height: 215,
      },
      left: 'center',
      top: 'center',
    },
  ]
})


async function init() {
  let res =  await getTypeProportion()
  chartData.value = res || []
  initCharts()
}


function initCharts() {
  // let xAxisData = chartData.value.map(item => item.indicatorName)
  // let s1Data =chartData.value.map(item => item.score)
  let data =chartData.value.map(item => {
    return {
      ...item,
      name: item.templateName,
      value: item.supPro,
    }
  })
  option.series[0].data = data
  // option.series[1].data = s2Data
  // option.xAxis.data = xAxisData
  setOptions(option);
}

init()

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