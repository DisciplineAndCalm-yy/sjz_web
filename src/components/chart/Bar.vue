<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, Ref, reactive, watchEffect, watch } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';

  export default defineComponent({
    name: 'Bar',
    props: {
      chartData: {
        type: Array,
        default: () => [],
      },
      option: {
        type: Object,
        default: () => ({}),
      },
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: 'calc(100vh - 78px)',
      },
    },
    setup(props) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions, echarts } = useECharts(chartRef as Ref<HTMLDivElement>);
      const option = reactive({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true,
              backgroundColor: '#333',
            },
          },
        },
        xAxis: {
          type: 'category',
          data: [],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'bar',
            type: 'bar',
            data: [],
          },
        ],
      });

      // watchEffect(() => {
      //   props.chartData && initCharts();
      // });
      watch(
        () => props.chartData,
        () => {
          initCharts();
        },
        {
          deep: true,
          immediate: true,
        }
      );

      function initCharts() {
        if (props.option) {
          Object.assign(option, props.option);
        }
        let seriesData = props.chartData.map((item) => {
          return item.value;
        });
        let xAxisData = props.chartData.map((item) => {
          return item.name;
        });
        option.series[0].data = seriesData;
        option.xAxis.data = xAxisData;
        option.yAxis.data = xAxisData;
        setOptions(option);
      }
      return { chartRef };
    },
  });
</script>
