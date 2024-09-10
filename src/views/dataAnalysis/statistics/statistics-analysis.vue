<template>
  <div class="analysis">
    <div class="analysis-box statistics">
      <div class="statistics-head">
        <card-bar />
        <!-- 右边的 -->
        <custom-pie />
      </div>
      <card-table />
      <div class="statistics-echart">
        <div class="statistics-echart-left statistics-echart-item">
          <div class="statistics-echart-left-dom">
            <echart-rose />
          </div>
        </div>
        <div class="statistics-echart-right statistics-echart-item">
          <div class="statistics-echart-right-dom">
            <echart-line />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import cardBar from './part/card-bar.vue';
  import customPie from './part/custom-pie.vue';
  import cardTable from './part/cardTable.vue';
  import echartRose from './components/echart-rose.vue';
  import echartLine from './components/echart-line.vue';

  const type = ref(1);

  function handleChangeType(value) {
    type.value = value;
  }
</script>

<style lang="less" scoped>
  .analysis {
    width: 100%;
    height: auto;
    padding: 10px;
    .analysis-box {
      width: 100%;
      height: auto;
      .tab-wrapper {
        display: flex;
        .tab-item {
          width: 114px;
          height: 32px;
          margin-top: 20px;
          text-align: center;
          line-height: 32px;
          border-radius: 20px;
          transition: all 0.1s;
          cursor: pointer;
          &.active {
            background: #1890ff;
            span {
              color: #fff;
            }
          }
          span {
            transition: all 0.1s;
            font-size: 14px;
          }
        }
      }
    }
  }

  .statistics {
    .statistics-head {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: space-between;

      > div {
        padding: 15px 20px;
        background-color: white;
        border-radius: 10px;
        flex: 1;
      }

      > div:nth-child(1) {
        margin-right: 20px;
      }
    }

    .statistics-table {
      margin-top: 20px;
      padding: 14px 20px;
      background: white;
      border-radius: 10px;

      .statistics-table-template {
        margin-top: 20px;
        width: 100%;
        display: flex;
        justify-content: space-between;

        .statistics-table-template-card {
          height: 230px;
          width: 30.5%;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          align-content: flex-start;

          .sttc-item {
            width: 47%;
            height: 122px;
            background-color: white;
            box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
            border-radius: 10px;
            display: flex;

            .sttc-itemcenter {
              margin: auto;
              width: 80%;

              .sttc-item-title {
                font-size: 14px;
                height: 20px;
                line-height: 20px;
                color: #999999;
              }

              .sttc-item-count {
                font-size: 20px;
                height: 30px;
                line-height: 30px;
                color: #3b8ce9;
              }
            }
          }

          .sttc-item:nth-child(1),
          .sttc-item:nth-child(2) {
            margin-bottom: 20px;
          }
        }

        .statistics-table-template-table {
          min-height: 275px;
          width: 67%;
        }
      }

      /deep/.ant-radio-button-wrapper-checked {
        border: none !important;
        border-radius: 20px;
      }

      /deep/.ant-radio-button-wrapper {
        border: none;
        border-radius: 20px;

        &::before {
          display: none !important;
        }
      }
    }

    .statistics-echart {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 20px;

      .statistics-echart-item {
        padding: 14px 20px;
        background-color: white;
        border-radius: 10px;
        flex: 1;

        .statistics-echart-left-dom,
        .statistics-echart-right-dom {
          width: 100%;
          height: auto;

          /deep/.title {
            margin-bottom: 15px;
          }
        }
      }

      .statistics-echart-left {
        margin-right: 20px;
      }
    }

    .statistics-echartTable {
      width: 100%;
      height: auto;
      display: flex;
      margin-top: 20px;
      justify-content: space-between;

      .statistics-echartTable-echart,
      .statistics-echartTable-table {
        border-radius: 10px;
        padding: 14px 20px;
        min-height: 100px;
        background: white;
        flex: 1;
      }

      .statistics-echartTable-echart {
        margin-right: 20px;
      }
    }

    .statistics-bigEchart {
      width: 100%;
      height: auto;
      margin-top: 20px;
      margin-bottom: 20px;
      padding: 14px 20px;
      background: white;
      border-radius: 10px;
    }
  }

  /deep/.title {
    width: 100%;
    height: 32px;
    line-height: 32px;
    display: flex;
    justify-content: space-between;

    > span:nth-child(1) {
      font-size: 16px;
      font-weight: 600;
      padding-left: 10px;
      position: relative;
    }

    > span:nth-child(1):before {
      position: absolute;
      content: '';
      display: block;
      width: 4px;
      height: 66%;
      top: 50%;
      left: 0px;
      transform: translateY(-50%);
      background-color: rgb(59, 140, 233);
      border-radius: 3px;
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

<style lang="less">
  .statistics .ant-table-header {
    background: transparent !important;
  }

  .statistics .ant-table-thead tr {
    background: transparent;

    th:nth-child(1) {
      border-radius: 10px 0px 0px 10px;
    }

    th:last-child {
      border-radius: 0px 10px 10px 0px;
    }

    th {
      font-size: 14px !important;
    }
  }

  .statistics {
    .ant-calendar-picker {
      outline: none !important;
    }

    .ant-calendar-picker-input:hover {
      border: none !important;
    }

    .ant-calendar-picker-input {
      padding: 0px !important;
      box-shadow: 0px 0px 0px transparent !important;
      border: none !important;
      line-height: 32px;
      outline: none !important;

      .ant-calendar-range-picker-input {
        height: 32px;
        line-height: 30px;
        border: 1px solid #d9d9d9;
        border-radius: 7px;
        color: #3b8ce9;
        font-size: 14px;
      }

      .ant-calendar-range-picker-separator {
        margin: 0px 6px;
      }

      .ant-calendar-picker-icon {
        transform: translate(0px, -2px);
      }

      .anticon-close-circle {
        transform: translate(0px, -2px);
      }
    }
  }
</style>
