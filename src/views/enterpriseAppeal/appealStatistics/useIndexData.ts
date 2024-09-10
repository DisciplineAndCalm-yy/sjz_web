import { reactive, toRefs } from 'vue';

export const useIndexData = (): Record<string, any> => {
  const state = reactive<Record<string, any>>({
    appealType1: {
      grid: {
        top: 10,
        right: 30,
        left: 30,
        bottom: 20,
      },
      tooltip: {
        show: true,
        // formatter:(params)=>{
        //   console.log(params);
        //   return `2023年:${params.value}`
        // }
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#0000001A',
          },
        },
        axisLabel: {
          color: '#666666',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#999999',
        },
      },
      series: [
        {
          data: [120, 200, 150, 80],
          type: 'bar',
          barWidth: 12,
          itemStyle: {
            color: '#3750D1',
          },
        },
      ],
    },
    appealType2: {
      grid: {
        top: 10,
        right: 30,
        left: 30,
        bottom: 20,
      },
      tooltip: {
        show: true,
        // formatter:(params)=>{
        //   console.log(params);
        //   return `2023年:${params.value}`
        // }
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#0000001A',
          },
        },
        axisLabel: {
          color: '#666666',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#999999',
        },
      },
      series: [
        {
          type: 'bar',
          barWidth: 12,
          itemStyle: {
            color: '#4476FA',
          },
        },
      ],
    },
    appealType3: {
      grid: {
        top: 10,
        right: 30,
        left: 30,
        bottom: 20,
      },
      tooltip: {
        show: true,
        // formatter:(params)=>{
        //   console.log(params);
        //   return `2023年:${params.value}`
        // }
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#0000001A',
          },
        },
        axisLabel: {
          color: '#666666',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#999999',
        },
      },
      series: [
        {
          type: 'bar',
          barWidth: 12,
          itemStyle: {
            color: '#45BCFF',
          },
        },
      ],
    },
    appealTypeRank: {
      grid: {
        top: 10,
        // right: 30,
        left: 70,
        bottom: 20,
      },
      tooltip: {
        show: true,
        // formatter:(params)=>{
        //   console.log(params);
        //   return `2023年:${params.value}`
        // }
      },
      xAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        data: ['政务环境', '政务环境1', '政务环境2', '政务环境3', '停车费', '税费'],
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#666666',
        },
      },
      series: [
        {
          data: [20, 30, 40, 60, 80, 166],
          type: 'bar',
          barWidth: 8,
          label: {
            show: true,
            position: 'right',
            color: '#4476FA',
          },
          itemStyle: {
            color: '#4476FA',
          },
        },
      ],
    },
    appealChannel: {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        show: true,
        top: 'center',
        right: '2%',
        orient: 'vertical',
      },
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: '100',
            fill: '#333333',
            fontSize: 24,
          },
        },
      ],
      series: [
        {
          type: 'pie',
          radius: ['60%', '90%'],
          label: {
            show: true,
            formatter: (params) => params.value,
          },
          itemStyle: {
            color: (params) => {
              return params.data.color;
            },
          },
        },
      ],
    },
    appealArea: {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        show: false,
      },
      grid: {
        top: 10,
        right: 30,
        left: 30,
        bottom: 20,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#0000001A',
          },
        },
        axisLabel: {
          color: '#666666',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#999999',
        },
        splitLine: {
          lineStyle: {
            color: '#0000000D',
          },
        },
      },
      series: [
        {
          type: 'line',
          stack: 'Total',
          itemStyle: {
            color: '#FE9923',
          },
        },
      ],
    },
    appealDepart: {
      grid: {
        top: 10,
        right: 30,
        left: 30,
        bottom: 20,
      },
      tooltip: {
        show: true,
        // formatter:(params)=>{
        //   console.log(params);
        //   return `2023年:${params.value}`
        // }
      },
      xAxis: {
        type: 'category',
        data: ['部门1', '部门2', '部门3', '部门4', '部门5', '部门6', '部门7', '部门8'],
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#0000001A',
          },
        },
        axisLabel: {
          color: '#666666',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#999999',
        },
        splitLine: {
          lineStyle: {
            color: '#0000000D',
          },
        },
      },
      series: [
        {
          data: [120, 200, 150, 80, 22, 45, 199, 40, 70],
          type: 'bar',
          barWidth: 12,
          itemStyle: {
            color: '#4476FA',
          },
        },
      ],
    },
  });

  return {
    ...toRefs(state),
  };
};
