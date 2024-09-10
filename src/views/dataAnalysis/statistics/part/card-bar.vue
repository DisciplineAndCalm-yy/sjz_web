<template>
  <div class="statistics-head-left">
    <div class="title">
      <span>诉求量情况分析</span>
      <!-- <a-range-picker
        v-model:value="value"
        @change="handleChange"
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
    <div class="statistics-head-left-card">
      <div class="shlc-item">
        <div class="shlc-item-icon">
          <div class="shlc-item-icon-img"></div>
        </div>
        <div class="shlc-item-content">
          <div class="shlc-item-content-num">
            <span class="shlc-item-content-num-count">{{ resNumber(resData.appealSum || 0) }}</span>
          </div>
          <div class="shlc-item-content-title">诉求总量</div>
        </div>
      </div>
      <div class="shlc-item">
        <div class="shlc-item-icon">
          <div class="shlc-item-icon-img"></div>
        </div>
        <div class="shlc-item-content">
          <div class="shlc-item-content-num">
            <span class="shlc-item-content-num-count">{{ resNumber(resData.transferVolume || 0) }}</span>
          </div>
          <div class="shlc-item-content-title">转派量</div>
        </div>
      </div>
      <div class="shlc-item">
        <div class="shlc-item-icon">
          <div class="shlc-item-icon-img"></div>
        </div>
        <div class="shlc-item-content">
          <div class="shlc-item-content-num">
            <span class="shlc-item-content-num-count">{{ resNumber(resData.completedQuantity || 0) }}</span>
          </div>
          <div class="shlc-item-content-title">完成量</div>
        </div>
      </div>
    </div>
    <div class="statistics-head-left-bar"></div>
  </div>
</template>

<script setup>
  import { getappealVolume } from '/@/api/dataAnalysis';
  import resNumber from '/@/utils/number';
  import moment from 'moment';
  import { ref } from 'vue';
  import dayjs from 'dayjs';
  const date = ref([dayjs().startOf('month'), dayjs()]);

  let resData = ref({});
  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };
  const pickerChange = () => {
    getData();
  };

  const getData = () => {
    const [startDate, endDate] = date.value;
    let param = {
      strTime: dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00',
      endTime: dayjs(endDate).format('YYYY-MM-DD') + ' 23:59:59',
    };
    getappealVolume(param).then((res) => {
      resData.value = res;
    });
  };
  getData();
</script>

<style scoped lang="less">
  .statistics-head-left-card {
    width: 100%;
    height: auto;
    display: flex;
    margin-top: 15px;
    justify-content: space-between;

    .shlc-item {
      width: 32.5%;
      display: flex;
      border-radius: 10px;

      .shlc-item-icon {
        width: 40px;
        height: 40px;
        margin: 10px;
        border-radius: 10px;
        display: flex;

        .shlc-item-icon-img {
          background-repeat: no-repeat;
          display: block;
          margin: auto;
          background-size: 100%;
        }
      }

      .shlc-item-content {
        color: white;
        height: 40px;
        margin: auto 0px;

        .shlc-item-content-num {
          font-size: 20px;
          line-height: 20px;
          height: 20px;
        }

        .shlc-item-content-title {
          font-size: 14px;
          height: 20px;
          line-height: 20px;
          margin-left: 2px;
        }
      }
    }

    .shlc-item:nth-child(1) {
      background: #3b8ce9;

      .shlc-item-icon {
        background: #5aa7ff;

        .shlc-item-icon-img {
          width: 20px;
          height: 20px;
          // background-image: url('../../../../assets/images/Vector.png');
          background-image: url('../../../../assets/images/Vector.png');
        }
      }
    }

    .shlc-item:nth-child(2) {
      background: #5bc374;

      .shlc-item-icon {
        background: #83e0a5;

        .shlc-item-icon-img {
          width: 19px;
          height: 21.6px;
          background-image: url('../../../../assets/images/Vector1.png');
        }
      }
    }

    .shlc-item:nth-child(3) {
      background: #ea6672;

      .shlc-item-icon {
        background: #ff858f;

        .shlc-item-icon-img {
          width: 21px;
          height: 20.6px;
          background-image: url('../../../../assets/images/Vector2.png');
        }
      }
    }
  }

  .statistics-head-left-bar {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 10px;
    padding: 0px 4px;

    .shlb-item {
      width: 48%;
      height: auto;
      box-sizing: border-box;
      margin-top: 15px;

      .shlb-item-title {
        font-size: 14px;
        height: 20px;
        line-height: 20px;
        display: flex;
        justify-content: space-between;

        span:nth-child(1) {
          color: #999;
        }

        .shlb-item-title-count {
          height: 20px;
          line-height: 20px;
          font-size: 20px;
          color: #3b8ce9;
        }
      }

      .shlb-item-bar {
        height: 5px;
        margin-top: 6px;

        /deep/.ant-progress-bg {
          height: 5px !important;
        }

        /deep/.ant-progress-inner {
          top: -10px;
        }

        /deep/.ant-progress-outer {
          height: 5px !important;
        }

        /deep/ .ant-progress {
          height: 5px !important;

          > div {
            height: 5px !important;
          }
        }
      }
    }
  }
</style>
