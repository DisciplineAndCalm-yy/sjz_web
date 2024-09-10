<template>
  <div class="smallTable">
    <div class="pie-wrapper">
      <div class="title">
        <span>总工单量以及进度情况</span>
        <nav>
          <a-button v-if="hasPermission('statistics-analysis-download')" class="white" :loading="workOrdersAndProgressExportXlsLoading" @click="handleWorkOrdersAndProgressExportXls">下载</a-button>
          <a-range-picker
            v-model:value="value"
            :disabled="loading"
            @change="handleChangeWorkOrdersAndProgressDate"
            :disabled-date="disabledDate"
            :getCalendarContainer="
              (triggerNode) => {
                return triggerNode.parentNode;
              }
            "
            :allowClear="false"
          />
        </nav>
      </div>
      <div class="chart">
        <div class="threeEchart-pie" id="threeEchart-pie"></div>
        <div class="cell-wrapper">
          <div class="cell-row">
            <dl class="cell-item">
              <dd> <img src="/@/assets/images/icon.png" alt="" /> </dd>
              <dt>
                <p class="title">办理中</p>
                <p class="count">
                  <span class="num">{{ workOrdersAndProgressData.processIng }}</span>
                  <span class="unit">件</span>
                </p>
              </dt>
            </dl>
            <dl class="cell-item">
              <dd> <img src="/@/assets/images/icon2.png" alt="" /> </dd>
              <dt>
                <p class="title">办结件</p>
                <p class="count">
                  <span class="num">{{ workOrdersAndProgressData.finish }}</span>
                  <span class="unit">件</span>
                </p>
              </dt>
            </dl>
          </div>
          <div class="cell-row">
            <dl class="cell-item">
              <dd> <img src="/@/assets/images/icon3.png" alt="" /> </dd>
              <dt>
                <p class="title">已退回</p>
                <p class="count">
                  <span class="num">{{ workOrdersAndProgressData.returned }}</span>
                  <span class="unit">件</span>
                </p>
              </dt>
            </dl>
            <dl class="cell-item">
              <dd> <img src="/@/assets/images/icon4.png" alt="" /> </dd>
              <dt>
                <p class="title">已重置</p>
                <p class="count">
                  <span class="num">{{ workOrdersAndProgressData.reset }}</span>
                  <span class="unit">件</span>
                </p>
              </dt>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <div class="table-wrapper">
      <div class="title">
        <span>处理部门工作进展</span>
        <nav>
          <a-button v-if="hasPermission('statistics-analysis-download')" class="white" :loading="downloadloading" @click="download">下载</a-button>

          <a-range-picker
            v-model:value="value1"
            :disabled="loading"
            @change="handleChange"
            :disabled-date="disabledDate"
            :getCalendarContainer="
              (triggerNode) => {
                return triggerNode.parentNode;
              }
            "
            :allowClear="false"
          />
        </nav>
      </div>
      <div style="position: relative">
        <div class="loading" v-show="loading">
          <a-spin size="large" />
        </div>
        <a-table :columns="columns" :data-source="data" @change="tableClick" size="small" :pagination="pagination" align="center" />
      </div>
    </div>
  </div>
</template>
<script setup>
  import { usePermission } from '/@/hooks/web/usePermission';
  import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
  import { workOrdersAndProgress, workOrdersAndProgressExportXls, departmentalProgress, departmentalProgressExportXls } from '/@/api/dataAnalysis';
  import * as echarts from 'echarts';
  import moment from 'moment';

  const { hasPermission } = usePermission();
  let loading = ref(false);
  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  let nDate = new Date();
  let st = nDate.getMonth() + 1;
  let et = nDate.getDate();
  let yt = nDate.getFullYear();
  let value = ref([yt + '-' + st + '-' + 1, yt + '-' + st + '-' + et]);
  let value1 = ref([yt + '-' + st + '-' + 1, yt + '-' + st + '-' + et]);
  let pagination = reactive({
    current: 1,
    total: 0,
    pageSize: 5,
    onChange(pageNo) {
      pagination.current = pageNo;
      getDepartmentalProgress();
    },
  });

  async function getDepartmentalProgress() {
    let param = {
      endTime: moment(value1.value[1]).format('YYYY-MM-DD') + ' 23:59:59',
      strTime: moment(value1.value[0]).format('YYYY-MM-DD') + ' 00:00',
      pageNo: pagination.current,
    };
    const res = await departmentalProgress(param);
    pagination.total = res.total;
    if (Array.isArray(res.records)) {
      res.records.forEach((item) => {
        item.completionRate = item.completionRate + '%';
        item.delayRate = item.delayRate + '%';
        item.satisfaction = item.satisfaction + '%';
      });
    }
    data.value = res.records;
  }
  getDepartmentalProgress();
  let downloadloading = ref(false);

  const download = () => {
    let param = {
      endTime: moment(value1.value[1]).format('YYYY-MM-DD') + ' 23:59:59',
      strTime: moment(value1.value[0]).format('YYYY-MM-DD') + ' 00:00',
    };
    downloadloading.value = true;
    let start = moment(value1.value[0]).format('YYYY年MM月DD日');
    let end = moment(value1.value[1]).format('YYYY年MM月DD日');
    let fileName = `处理部门工作进展[${start}-${end}].xls`;
    departmentalProgressExportXls(param, fileName)
      .then((res) => {})
      .finally(() => {
        downloadloading.value = false;
      });
  };
  const handleChange = (res, res2) => {
    pagination.current = 1;
    getDepartmentalProgress();
  };
  const tableClick = (r) => {
    pagination.current = r.current;
  };
  const columns = reactive([
    {
      title: '部门',
      dataIndex: 'deptName',
      key: 'deptName',
      ellipsis: true,
    },
    {
      title: '工单量',
      dataIndex: 'workOrderQuantity',
      key: 'workOrderQuantity',
      ellipsis: true,
    },
    {
      title: '办理满意度',
      dataIndex: 'satisfaction',
      ellipsis: true,
      key: 'satisfaction',
    },
    {
      title: '延期率',
      dataIndex: 'delayRate',
      ellipsis: true,
      key: 'delayRate',
    },
    {
      title: '完结率',
      dataIndex: 'completionRate',
      ellipsis: true,
      key: 'completionRate',
    },
  ]);

  /** 初始化饼图数据 */
  let initEchart = (value) => {
    let option = {
      title: [
        {
          text: '工单总量',
          x: 'center',
          bottom: '9%',
          textStyle: {
            color: '#999',
            fontSize: '14px',
            fontWeight: 100,
          },
        },
        {
          text: value + '件',
          x: 'center',
          top: '41%',
          textStyle: {
            color: '#3b8ce9',
            fontSize: '20px',
            fontWeight: 100,
          },
        },
      ],
      // tooltip: {},
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['55%', '70%'],
          center: ['50%', '45%'],
          data: [
            {
              value: 100,
            },
            {
              value: 0,
            },
          ],
          label: {
            normal: {
              show: false,
              position: 'center',
              formatter: '{text|{c}}\n{b}',
              rich: {
                text: {
                  align: 'center',
                  verticalAlign: 'middle',
                  padding: 8,
                  fontSize: 30,
                },
                value: {
                  align: 'center',
                  verticalAlign: 'middle',
                  fontSize: 20,
                },
              },
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '12',
              },
            },
          },
          itemStyle: {
            normal: {
              //默认展示的
              color: function (colors) {
                let colorList = ['#3b8ce9', '#f5f5f5'];
                return colorList[colors.dataIndex];
              },
            },
            emphasis: {
              //鼠标悬浮高亮的展示样式修改
              color: 'inherit', //取消高亮
            },
          },
          labelLine: {
            normal: {
              show: true,
            },
          },
        },
      ],
    };

    let dom = document.querySelector('#threeEchart-pie');
    let myChart = echarts.init(dom);
    myChart.clear();
    myChart.setOption(option);

    const resizeObserver = new window.ResizeObserver(() => {
      myChart.resize();
    });
    resizeObserver.observe(dom);
  };

  const workOrdersAndProgressData = ref({});
  /**
   * 获取总工单量及数据情况
   */
  async function getWorkOrdersAndProgress() {
    let param = {
      endTime: moment(value.value[1]).format('YYYY-MM-DD') + ' 23:59:59',
      strTime: moment(value.value[0]).format('YYYY-MM-DD') + ' 00:00',
    };
    const chartData = await workOrdersAndProgress(param);
    workOrdersAndProgressData.value = chartData;
    initEchart(chartData.processAll);
  }
  /** 修改时间 */
  function handleChangeWorkOrdersAndProgressDate() {
    getWorkOrdersAndProgress();
  }
  /** ▋总工单量以及进度情况-导出  */
  const workOrdersAndProgressExportXlsLoading = ref(false); // 导出按钮loading
  function handleWorkOrdersAndProgressExportXls() {
    let param = {
      endTime: moment(value.value[1]).format('YYYY-MM-DD') + ' 23:59:59',
      strTime: moment(value.value[0]).format('YYYY-MM-DD') + ' 00:00',
    };
    workOrdersAndProgressExportXlsLoading.value = true;
    let start = moment(value.value[0]).format('YYYY年MM月DD日');
    let end = moment(value.value[1]).format('YYYY年MM月DD日');
    let fileName = `总工单量以及进度情况[${start}-${end}].xls`;
    workOrdersAndProgressExportXls(param, fileName)
      .then((res) => {})
      .finally(() => {
        workOrdersAndProgressExportXlsLoading.value = false;
      });
  }

  onMounted(async () => {
    getWorkOrdersAndProgress();
  });

  onBeforeUnmount(() => {
    let dom = document.querySelector('#threeEchart-pie');
    let myChart = echarts.init(dom);
    myChart.dispose();
  });
  const data = ref();
</script>

<style lang="less" scoped>
  .option-text {
    padding-left: 14px;
  }

  .option-text-span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 20px;
    line-height: 25px;
    margin: auto;
    display: inline-block;
  }

  .smallTable {
    // min-height: 337.5px;
    // padding: 30px;
    height: auto;
  }
  .table-wrapper {
    margin-top: 20px;
    padding: 30px;
    background-color: #fff;
  }
  .pie-wrapper {
    padding: 30px;
    width: 100%;

    background-color: #fff;
    .chart {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      .threeEchart-pie {
        width: 50%;
        height: 300px;
      }
      .cell-wrapper {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .cell-row {
          display: flex;
          .cell-item {
            display: flex;
            align-items: center;
            width: 308px;
            height: 104px;
            padding: 24px 0px;
            box-sizing: border-box;
            background: #ffffff;
            box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
            border-radius: 10px;
            dd {
              width: 57px;
              height: 57px;
              margin-left: 26px;
              img {
                display: block;
                width: 100%;
                height: 100%;
              }
            }
            dt {
              margin-left: 21px;
              p {
                margin-bottom: 0px;
              }
              .title {
                font-style: normal;
                font-weight: 600;
                font-size: 14px;
                color: #999999;
              }
              .count {
                font-family: '微软雅黑win10';
                font-size: 30px;
                color: #3b8ce9;

                .num {
                }
                .unit {
                  margin-left: 10px;
                  font-size: 14px;
                }
              }
            }
          }
          .cell-item + .cell-item {
            margin-left: 20px;
          }
        }
        .cell-row + .cell-row {
          margin-top: 20px;
        }
      }
    }
  }

  .ranking-icon {
    width: 12px;
    height: 8px;
    border-radius: 8px;
    display: inline-block;
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
</style>
