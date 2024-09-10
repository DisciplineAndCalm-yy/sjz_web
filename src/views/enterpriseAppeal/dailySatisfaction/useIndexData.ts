import { reactive, toRefs } from 'vue';
import { question_getStatusList } from '/@/api/enterpriseAppeal/index';

export const useIndexData = (): Record<string, any> => {
  const state = reactive<Record<string, any>>({
    columns: [
      {
        title: '问卷名称',
        dataIndex: 'name',
        width: 120,
      },
      {
        title: '填报份数/目标份数',
        width: 150,
        dataIndex: 'num',
      },
      {
        title: '创建人部门',
        width: 150,
        dataIndex: 'depart',
      },
      {
        title: '发布日期',
        width: 150,
        dataIndex: 'publishTime',
      },
      {
        title: '状态',
        width: 150,
        dataIndex: 'status',
      },
    ],
    searchFormSchema: [
      {
        field: 'name',
        component: 'Input',
        label: '问卷名称',
        componentProps: {
          placeholder: '请输入',
        },
      },
      {
        label: '状态',
        field: 'status',
        component: 'Select',
        componentProps: () => {
          return {
            placeholder: '请选择',
            options: state.statusList,
          };
        },
      },
    ],
    statusList: [],
    //echarts 日期
    chartDateOptions: [],
    satisfaction_chartOptions: {
      tooltip: {
        show: true,
      },
      legend: {
        orient: 'vertical',
        right: '0',
        top: '25%',
      },
      title: {
        show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
        text: '0分', //主标题文本，'\n'指定换行
        subtext: '平均得分', //副标题文本，'\n'指定换行
        x: 'center', //水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
        y: '40%', //垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
        textAlign: null, //水平对齐方式，默认根据x设置自动调整，可选为： left' | 'right' | 'center
        itemGap: 10, //主副标题纵向间隔，单位px，默认为10
        textStyle: {
          //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
          fontSize: 24,
          fontStyle: 'normal',
          fontWeight: 'bolder',
        },
        subtextStyle: {
          //副标题文本样式{"color": "#aaa"}
          fontSize: 14,
          fontStyle: 'normal',
          fontWeight: 'normal',
        },
        zlevel: 0, //一级层叠控制。默认0,每一个不同的zlevel将产生一个独立的canvas，相同zlevel的组件或图标将在同一个canvas上渲染。zlevel越高越靠顶层，canvas对象增多会消耗更多的内存和性能，并不建议设置过多的zlevel，大部分情况可以通过二级层叠控制z实现层叠控制。
        z: 6, //二级层叠控制，默认6,同一个canvas（相同zlevel）上z越高约靠顶层。
      },

      series: [
        {
          name: '满意度',
          type: 'pie',
          radius: ['40%', '70%'],
          left: 'center',
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            formatter: function (e) {
              const data = e.data;
              if (data.value == 0) {
                data.label.show = false;
              }
              return data.value;
            },
          },
        },
      ],
    },
    fillingRate_options: {
      legend: {
        show: false,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        minInterval: 1,
      },
      yAxis: {
        type: 'category',
        axisLine: { show: false },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          name: '填报率',
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: '#F5F5F5',
          },
          label: {
            show: true,
            fontSize: '10',
          },
          itemStyle: {
            color: '#4476FA',
          },
          barWidth: 12,
        },
      ],
    },
  });

  question_getStatusList().then((res) => {
    state.statusList = res.map((item) => ({ label: item.desc, value: item.value }));
  });

  // 生成满意度统计/填报率select list
  const getDateOptions = () => {
    const options: any[] = [];
    for (let y = 2016; y < 2050; y++) {
      options.push({
        label: `${y}年`,
        value: `${y}`,
        children: [],
      });
    }
    options.forEach((item) => {
      for (let q = 1; q <= 4; q++) {
        item.children.push({
          label: `${q}季度`,
          value: `${q}`,
          children: [],
        });
      }
      item.children.forEach((value) => {
        const startQMenum = { 1: '1', 2: '4', 3: '7', 4: '10' };
        const endQMenum = { 1: '3', 2: '6', 3: '9', 4: '12' };
        for (let m = startQMenum[value.value]; m <= endQMenum[value.value]; m++) {
          value.children.push({
            label: `${m}月`,
            value: `${m}`,
          });
        }
      });
    });
    return options;
  };
  state.chartDateOptions = getDateOptions();

  return {
    ...toRefs(state),
  };
};
