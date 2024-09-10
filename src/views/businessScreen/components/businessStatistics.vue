<template>
  <div class="businessStatistics">
    <div class="businessStatistics-content">
      <div class="businessStatistics-content-item">
        <div class="item-icon"></div>
        <div class="item-text">
          <span>年度任务总量</span>
          <span>{{ dataSource.total }}</span>
        </div>
      </div>
      <div class="businessStatistics-content-item">
        <div class="item-text">
          <span>已完成</span>
          <span>{{ dataSource.finish }}</span>
        </div>
        <div class="item-icon"></div>
      </div>
      <div class="businessStatistics-content-item">
        <div class="item-icon"></div>
        <div class="item-text">
          <span>已超期</span>
          <span>{{ dataSource.alreadyOverdue.overdueCount }}</span>
        </div>
        <div class="red">红牌 {{ dataSource.alreadyOverdue.redCount }}</div>
        <div class="yellow">黄牌 {{ dataSource.alreadyOverdue.yellowCount }}</div>
      </div>
      <div class="businessStatistics-content-item">
        <div class="item-text">
          <span>即将超期</span>
          <span>{{ dataSource.shortlyOverdue.overdueCount }}</span>
        </div>
        <div class="item-icon"></div>
        <div class="red">红牌 {{ dataSource.shortlyOverdue.redCount }}</div>
        <div class="yellow">黄牌 {{ dataSource.shortlyOverdue.yellowCount }}</div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, computed, unref, watch } from 'vue';
import { getDataStatistics } from '/@/api/businessScreen/businessScreen'

const dataSource = ref({
  shortlyOverdue: {},
  alreadyOverdue: {},
})

async function init() {
  dataSource.value = await getDataStatistics()
}
init()
</script>

<style lang="less" scoped>
.businessStatistics {
  height: 100%;
  width: 722px;
  padding-top: 23px;
  padding-left: 45px;
  box-sizing: content-box;
  &-content {
    position: relative;
    height: 311px;
    width: 100%;
    background: url(/@/assets/images/businessScreen/statistics-bg.png) no-repeat;
    background-size: 100% 100%;
    // background-position: 100% 100%;
    &-item {
      width: 216px;
      height: 67px;
      position: absolute;
      display: flex;
      align-items: center;
      .item-icon {
        width: 80px;
        height: 80px;
      }
      .item-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        span {
          &:nth-child(1) {
            font-family: MicrosoftYaHei;
            font-size: 16px;
            color: #FFFFFF;
          }
          &:nth-child(2) {
            font-family: Microsoft-YaHei, Microsoft-YaHei;
            font-weight: bold;
            font-size: 18px;
            color: #FFCC00;
          }
        }
      }
      .red,
      .yellow {
        position: absolute;
        bottom: -35px;
        height: 22px;
        width: 131px;
        box-sizing: border-box;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #FFFFFF;
      }
      &:nth-child(1) {
        top: 0;
        left: 0;
        // background: url(/@/assets/images/businessScreen/statistics-item.png) no-repeat;
        // background-size: 100% 100%;
        .item-icon {
          background: url(/@/assets/images/businessScreen/statistics-icon1.png) no-repeat;
          background-size: 100% 100%;
          background-position: center;
        }
      }
      &:nth-child(2) {
        top: 0;
        right: 0;
        justify-content: flex-end;
        // background: url(/@/assets/images/businessScreen/statistics-item2.png) no-repeat;
        // background-size: 100% 100%;
        .item-icon {
          // background: url(/@/assets/images/businessScreen/statistics-icon2.png) no-repeat;
          // background-size: 100% 100%;
          // background-position: center;
        }
      }
      &:nth-child(3) {
        bottom: 34px;
        left: 0;
        // background: url(/@/assets/images/businessScreen/statistics-item.png) no-repeat;
        // background-size: 100% 100%;
        .item-icon {
          // background: url(/@/assets/images/businessScreen/statistics-icon3.png) no-repeat;
          // background-size: 100% 100%;
          // background-position: center;
        }
        .red {
          left: 30px;
          padding-left: 10px;
          // border-left: 2px solid #FF1F1F;
          // background: linear-gradient(to right, rgba(6, 62, 175, 1), rgba(6, 62, 175, 0) 70%);
        }
        .yellow {
          left: 137px;
          padding-left: 10px;
          // border-left: 2px solid #FF9600;
          // background: linear-gradient(to right, rgba(6, 62, 175, 1), rgba(6, 62, 175, 0) 70%);
        }
      }
      &:nth-child(4) {
        bottom: 34px;
        right: 0;
        justify-content: flex-end;
        // background: url(/@/assets/images/businessScreen/statistics-item2.png) no-repeat;
        // background-size: 100% 100%;
        .item-icon {
          // background: url(/@/assets/images/businessScreen/statistics-icon4.png) no-repeat;
          // background-size: 100% 100%;
          // background-position: center;
        }
        .red {
          right: 30px;
          text-align: right;
          padding-right: 10px;
          // border-right: 2px solid #FF1F1F;
          // background: linear-gradient(to left, rgba(6, 62, 175, 1), rgba(6, 62, 175, 0) 70%);
        }
        .yellow {
          right: 137px;
          text-align: right;
          padding-right: 10px;
          // border-right: 2px solid #FF9600;
          // background: linear-gradient(to left, rgba(6, 62, 175, 1), rgba(6, 62, 175, 0) 70%);
        }
      }
    }
  }
}
</style>