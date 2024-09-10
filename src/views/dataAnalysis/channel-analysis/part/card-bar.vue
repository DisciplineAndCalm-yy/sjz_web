<template>
  <div class="statistics">
    <div class="statistics-head-top">
      <div class="title">
        <span>诉求量情况分析</span>
        <span>
          <a-button class="white" :loading="downloadloading" @click="download">下载</a-button>
          <a-range-picker
            v-model:value="date"
            @change="pickerChange"
            format="YYYY-MM-DD"
            :disabled-date="disabledDate"
            :getCalendarContainer="(trigger) => trigger.parentNode"
          />
        </span>
      </div>
      <div class="statistics-head-left-card">
        <div class="shlc-item">
          <div class="shlc-item-icon">
            <div class="shlc-item-icon-img"></div>
          </div>
          <div class="shlc-item-content">
            <div class="shlc-item-content-num">
              <span class="shlc-item-content-num-count">
                {{ resData.emphasesAppealCount || 0 }}
                <span class="shlc-item-content-num-text">件</span>
              </span>
            </div>
            <div class="shlc-item-content-title">重点渠道诉求总量</div>
          </div>
        </div>
        <div class="shlc-item">
          <div class="shlc-item-icon">
            <div class="shlc-item-icon-img"></div>
          </div>
          <div class="shlc-item-content">
            <div class="shlc-item-content-num">
              <span class="shlc-item-content-num-count">
                {{ resData.appealCount || 0 }}
                <span class="shlc-item-content-num-text">件</span>
              </span>
            </div>
            <div class="shlc-item-content-title">政企通服务平台企业诉求量</div>
          </div>
        </div>
        <div class="shlc-item">
          <div class="shlc-item-icon">
            <div class="shlc-item-icon-img"></div>
          </div>
          <div class="shlc-item-content">
            <div class="shlc-item-content-num">
              <span class="shlc-item-content-num-count">
                {{ resData.oneToFiveAppeal || 0 }}
                <span class="shlc-item-content-num-text">件</span>
              </span>
            </div>
            <div class="shlc-item-content-title">12345企业诉求量</div>
          </div>
        </div>
        <div class="shlc-item">
          <div class="shlc-item-icon">
            <div class="shlc-item-icon-img"></div>
          </div>
          <div class="shlc-item-content">
            <div class="shlc-item-content-num">
              <span class="shlc-item-content-num-count">
                {{ resData.xhbappeal || 0 }}
                <span class="shlc-item-content-num-text">件</span>
              </span>
            </div>
            <div class="shlc-item-content-title">信好办企业诉求量</div>
          </div>
        </div>
        <div class="shlc-item">
          <div class="shlc-item-icon">
            <div class="shlc-item-icon-img"></div>
          </div>
          <div class="shlc-item-content">
            <div class="shlc-item-content-num">
              <span class="shlc-item-content-num-count">
                {{ resData.gsyappeal || 0 }}
                <span class="shlc-item-content-num-text">件</span>
              </span>
            </div>
            <div class="shlc-item-content-title">工商业联合会企业诉求量</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { getAppealAnalist, emphasesStatisticsExport } from '/@/api/channelAnalysis';
  import { ref, reactive } from 'vue';
  import moment from 'moment';
  import dayjs from 'dayjs';
  const date = ref([dayjs().startOf('month'), dayjs()]);

  let nDate = new Date();
  let st = nDate.getMonth() + 1;
  let et = nDate.getDate();
  let yt = nDate.getFullYear();
  let dateValue = ref([yt + '-' + st + '-' + 1, yt + '-' + st + '-' + et]);
  console.log('dateValue', dateValue);
  let resData = ref({});
  const data = reactive({
    times: [],
  });
  // const timeRange = ref([moment(dateValue.value[0]), moment(dateValue.value[1])]);
  // const timeRange = ref([moment(dateValue.value[0].format('YYYY-MM-DD')), moment(dateValue.value[1].format('YYYY-MM-DD'))]);
  let startDate = ref('');
  let endDate = ref('');
  let startDateTime = ref('');
  let endDateTime = ref('');
  let downloadloading = ref(false);
  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };
  // 时间选择器操作事件
  const pickerChange = (date, dataList) => {
    startDateTime.value = dataList[0];
    endDateTime.value = dataList[1];
    dataList[0] = dataList[0] + ' 00:00:00';
    dataList[1] = dataList[1] + ' 23:59:59';
    startDate.value = dataList[0];
    endDate.value = dataList[1];
    getData();
  };
  const getData = () => {
    const [startDate, endDate] = date.value;
    let param = {
      strTime: dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00',
      endTime: dayjs(endDate).format('YYYY-MM-DD') + ' 23:59:59',
    };
    getAppealAnalist(param).then((res) => {
      resData.value = res;
    });
  };
  getData();
  const handleChange = () => {
    getData();
  };
  const download = () => {
    const [startDate, endDate] = date.value;
    let param = {
      strTime: dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00',
      endTime: dayjs(endDate).format('YYYY-MM-DD') + ' 23:59:59',
    };

    downloadloading.value = true;
    let start = startDateTime.value ? moment(startDateTime.value).format('YYYY年MM月DD日') : moment(dateValue.value[0]).format('YYYY年MM月DD日');
    let end = endDateTime.value ? moment(endDateTime.value).format('YYYY年MM月DD日') : moment(dateValue.value[1]).format('YYYY年MM月DD日');
    let fileName = `诉求量情况分析[${start}-${end}].xlsx`;
    emphasesStatisticsExport(param, fileName)
      .then((res) => {})
      .finally(() => {
        downloadloading.value = false;
      });
  };
</script>

<style lang="less" scoped>
  .statistics {
    margin-bottom: 20px;
  }
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
  .statistics-head-left-card {
    width: 100%;
    height: auto;
    display: flex;
    margin-top: 30px;
    justify-content: space-between;

    .shlc-item {
      width: calc(20% - 8px);
      // height: 97px;
      display: flex;
      border-radius: 10px;
      padding: 17px 20px;
      box-sizing: border-box;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);

      .shlc-item-icon {
        width: 40px;
        height: 40px;
        margin: 0 10px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        .shlc-item-icon-img {
          background-repeat: no-repeat;
          display: block;
          margin: auto;
          background-size: 100%;
        }
      }

      .shlc-item-content {
        color: #333;
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
      .shlc-item-icon {
        background: #d6f8f0;

        .shlc-item-icon-img {
          width: 21px;
          height: 24px;
          background-image: url('../../../../assets/images/vector/Vector.png');
        }
      }
      .shlc-item-content-num-count {
        color: #37bda2;
        font-family: DIN-Bold;
        font-size: 30px;
        margin-bottom: 8px;
      }
    }

    .shlc-item:nth-child(2) {
      .shlc-item-icon {
        background: #e1f2ff;

        .shlc-item-icon-img {
          width: 24px;
          height: 21.6px;
          background-image: url('../../../../assets/images/vector/Vector1.png');
        }
      }
      .shlc-item-content-num-count {
        color: #3b8ce9;
        font-family: DIN-Bold;
        font-size: 30px;
        margin-bottom: 8px;
      }
    }

    .shlc-item:nth-child(3) {
      .shlc-item-icon {
        background: #fff1dd;

        .shlc-item-icon-img {
          width: 22px;
          height: 23px;
          background-image: url('../../../../assets/images/vector/Vector3.png');
        }
      }
      .shlc-item-content-num-count {
        color: #fc8b20;
        font-family: DIN-Bold;
        font-size: 30px;
        margin-bottom: 8px;
      }
    }
    .shlc-item:nth-child(4) {
      .shlc-item-icon {
        background: #feedec;

        .shlc-item-icon-img {
          width: 24px;
          height: 20px;
          background-image: url('../../../../assets/images/vector/Vector4.png');
        }
      }
      .shlc-item-content-num-count {
        color: #e65a4b;
        font-family: DIN-Bold;
        font-size: 30px;
        margin-bottom: 8px;
      }
    }
    .shlc-item:nth-child(5) {
      .shlc-item-icon {
        background: #eee9ff;

        .shlc-item-icon-img {
          width: 23px;
          height: 23px;
          background-image: url('../../../../assets/images/vector/Vector5.png');
        }
      }
      .shlc-item-content-num-count {
        color: #8164ff;
        font-family: DIN-Bold;
        font-size: 30px;
        margin-bottom: 8px;
      }
    }
  }
  .shlc-item-content-num-text {
    color: #333;
    font-size: 14px;
  }
  .shlc-item-content-num {
    margin-bottom: 8px;
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
