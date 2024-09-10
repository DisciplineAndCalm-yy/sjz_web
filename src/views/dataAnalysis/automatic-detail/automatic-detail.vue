<template>
  <div class="analysis">
    <div class="automatic-detail">
      <div class="automatic-detail-item" v-for="(item, index) in itemss" :key="item.questionTopic + index">
        <template v-if="item.questionType.includes('打分')">
          <!-- 打分 题目 -->
          <div class="automatic-detail-item-fen">
            <div class="adif-title">{{ item.questionSeriesNumber }}.{{ item.questionTopic }} [{{ item.questionType }}]</div>
            <div class="adif-content">{{ item.answerStatisticsList[0].score }}</div>
          </div>
        </template>
        <template v-else>
          <div class="automatic-detail-item-title">{{ item.questionSeriesNumber }}.{{ item.questionTopic }}[{{ item.questionType }}]</div>
          <div class="automatic-detail-item-table">
            <automatic-table :data="item.answerStatisticsList" />
          </div>
        </template>
      </div>
    </div>

    <div class="return" @click="handleReturn"> 返回 </div>
  </div>
</template>

<script setup>
  import automaticTable from './components/automatic-table.vue';
  import { getstatisticsautoSpecial } from '/@/api/dataAnalysis';
  import { useRouter, useRoute } from 'vue-router';
  import { reactive } from 'vue';
  const router = useRouter();
  const route = useRoute();
  let param = route.query;
  getstatisticsautoSpecial(param.id).then((res) => {
    itemss.length = 0;
    itemss.push(...res);
  });
  const handleReturn = () => {
    router.replace({
      name: 'automatic-analysis',
    });
  };

  const itemss = reactive([]);
</script>

<style scoped lang="less">
  .automatic-detail-item-null {
    width: 100%;
    height: 40vh;
    background-color: white;
    text-align: center;
    line-height: 40vh;
    font-size: 20px;
    border-radius: 10px;
  }

  .return {
    margin-left: 105px;
    text-align: center;
    width: 100px;
    font-size: 16px;
    height: 32px;
    border: none;
    line-height: 30px;
    border-radius: 7px;
    background: #3b8ce9;
    color: #fff;
    position: fixed;
    cursor: pointer;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }

  .analysis {
    width: 100%;
    min-height: 100.5vh;

    .automatic-detail {
      padding-bottom: 100px;
      width: 100%;

      .automatic-detail-item + .automatic-detail-item {
        margin-top: 20px;
      }

      .automatic-detail-item {
        border-radius: 10px;
        padding: 20px 30px;
        background-color: white;

        .automatic-detail-item-title {
          margin-bottom: 18px;
          height: 22px;
          line-height: 22px;
          font-size: 16px;
        }

        .automatic-detail-item-fen {
          width: 100%;
          height: auto;
          display: flex;
          border: 1px solid #e5e7eb;
          height: 39px;
          box-sizing: content-box;
          border-radius: 10px;

          .adif-title {
            width: 50%;
            padding: 8px;
          }

          .adif-content {
            width: 50%;
            padding: 8px;
            border-left: 1px solid #e5e7eb;
          }
        }
      }
    }
  }
</style>

<style lang="less">
  .automatic-detail .ant-table-header {
    background: transparent !important;
  }

  .automatic-detail {
    .ant-progress-bg {
      height: 5px !important;
    }

    .ant-progress-text {
      color: #3b8ce9;
    }
  }

  .automatic-detail .ant-table-thead tr {
    background: transparent;

    th:nth-child(1) {
      border-radius: 10px 0px 0px 10px;
    }

    th:last-child {
      border-radius: 0px 10px 10px 0px;
    }

    th {
      text-align: center;
      font-size: 14px !important;
    }
  }

  .automatic-detail {
    .ant-calendar-picker {
      outline: none !important;
    }

    .ant-calendar-picker {
      outline: none !important;
    }

    .ant-calendar-picker-input:hover {
      border: none !important;
    }

    .ant-calendar-picker-input {
      padding: 0px !important;
      box-shadow: 0px 0px 0px transparent !important;
      display: flex;
      justify-content: space-between;
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
