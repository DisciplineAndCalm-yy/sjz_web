<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2024-02-27 14:32:51
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-04-25 15:03:42
 * @FilePath: \yst-city-shijiazhuang-web\src\views\businessScreen\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="businessScreen">
    <div class="businessScreen-top">
      <h1>营商环境监测督导系统</h1>
      <div class="businessScreen-top-select">
        <a-select v-model:value="year" @change="changeYear">
          <template v-for="item in yearList" :key="`${item}`">
            <a-select-option :value="item">{{ item }}年度营商数据</a-select-option>
          </template>
        </a-select>
      </div>
      <div class="toIndex" @click="toIndex">返回首页</div>
      <div class="toAnother" @click="toAnother">营商任务督办</div>
    </div>
    <div class="businessScreen-content">
      <div class="businessScreen-content-left">
        <div class="businessScreen-item businessScreen-content-left-item">
          <div class="businessScreen-item-title">
            <h3>客观数据表现</h3>
          </div>
          <div class="businessScreen-item-content">
            <leftTop v-model:year="year"></leftTop>
          </div>
        </div>
        <div class="businessScreen-item businessScreen-content-left-item">
          <div class="businessScreen-item-title">
            <h3>指标前沿目标值</h3>
          </div>
          <div class="businessScreen-item-content">
            <leftCenter v-model:year="year"></leftCenter>
          </div>
        </div>
        <div class="businessScreen-item businessScreen-content-left-item">
          <div class="businessScreen-item-title">
            <h3>重点工作任务落实</h3>
          </div>
          <div class="businessScreen-item-content">
            <leftBottom v-model:year="year"></leftBottom>
          </div>
        </div>
      </div>
      <div class="businessScreen-content-center">
        <div class="businessScreen-content-center-map">
          <screenMap v-model:year="year"></screenMap>
        </div>
      </div>
      <div class="businessScreen-content-right">
        <!-- <div class="businessScreen-item businessScreen-content-right-item">
          <div class="businessScreen-item-title">
            <h3>企业满意度表现</h3>
          </div>
          <div class="businessScreen-item-content">
            <rightTop v-model:year="year"></rightTop>
          </div>
        </div> -->
        <div class="businessScreen-item businessScreen-content-right-item">
          <div class="businessScreen-item-title">
            <h3>下属区县营商表现</h3>
          </div>
          <div class="businessScreen-item-content">
            <rightCenter v-model:year="year"></rightCenter>
          </div>
        </div>
        <div class="businessScreen-item businessScreen-content-right-item">
          <div class="businessScreen-item-title">
            <h3>重大事件或创新举措</h3>
          </div>
          <div class="businessScreen-item-content">
            <rightBottom v-model:year="year"></rightBottom>
          </div>
        </div>
      </div>
    </div>
    <div class="businessScreen-bottom businessScreen-item">
      <div class="businessScreen-item-title businessScreen-bottom-title">
        <h3>指标表现</h3>
      </div>
      <div class="businessScreen-item-content">
        <screenBottom v-model:year="year"></screenBottom>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { unref, computed, ref, watchEffect } from 'vue';
  import '/@/utils/rem'
  import leftTop from './components/leftTop.vue';
  import leftCenter from './components/leftCenter.vue';
  import leftBottom from './components/leftBottom.vue';
  import screenMap from './components/screenMap.vue';
  import rightTop from './components/rightTop.vue';
  import rightCenter from './components/rightCenter.vue';
  import rightBottom from './components/rightBottom.vue';
  import screenBottom from './components/screenBottom.vue';
  import { getYearList } from '/@/api/businessScreen/businessScreen'
  import { useRouter } from 'vue-router'
  // import { Icon } from '/@/components/Icon';

  const router = useRouter()

  const yearList = ref([])
  const year = ref()
  
  async function init() {
    yearList.value = await getYearList()
    year.value = yearList.value[0]
  }

  init()

  const changeYear = (value) => {
    year.value = value
  }

  const toAnother = () => {
    router.push({
      path: '/businessScreen/index2'
    })
  }
  const toIndex = () => {
    location.href ='/entrance'
  }
</script>

<style lang="less" scoped>
.businessScreen {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 0;
  // background-color: #0023A7;
  background: url(/@/assets/images/businessScreen/bg.jpg) no-repeat;
  background-size: 100% 100%;
  &-item {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    min-height: 0;
    &-title {
      height: 47px;
      background: url(/@/assets/images/businessScreen/sub-title1.png) no-repeat;
      background-size: auto 100%;
      h3 {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        height: 100%;
        font-family: Microsoft YaHei;
        font-weight: bold;
        font-size: 18px;
        color: #FFFFFF;
        text-shadow: 0px 2px 0px #00227D;
        font-style: italic;
        padding-left: 46px;
      }
    }
    &-content {
      flex: 1;
      box-sizing: border-box;
      padding: 0 20px;
      min-height: 0;
    }
    // border: 1px solid gainsboro;
  }
  
  &-top{
    position: relative;
    height: 11.9%;
    background: url(/@/assets/images/businessScreen/title-bg.png) no-repeat;
    background-size: 100% auto;
    h1 {
      position: absolute;
      margin: 0;
      padding: 0;
      left: 50%;
      top: 26px; 
      transform: translate(-50%, 0);
      font-family: PangMenZhengDao;
      font-weight: 400;
      line-height: 1;
      font-size: 24px;
      color: #FFFFFF;
      text-shadow: 0px 4px 3px #001152;
      background: linear-gradient(182deg, #BDD9FF 0%, #FFFFFF 100%);
      -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;
    }
    .toIndex {
      width: 188px;
      height: 29px;
      position: absolute;
      top: 13px;
      left: 455px;
      cursor: pointer;
      text-align: center;
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 18px;
      color: #FFFFFF;
    }
    .toAnother {
      width: 188px;
      height: 29px;
      position: absolute;
      top: 13px;
      right: 455px;
      cursor: pointer;
      text-align: center;
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 18px;
      color: #FFFFFF;
    }
    &-select {
      position: absolute;
      top: 34px;
      left: 48px;
      width: 272px;
      height: 75px;
      background: url(/@/assets/images/businessScreen/title-select.png) no-repeat;
      background-size: 100% 100%;
      :deep(.ant-select) {
        height: 100%;
        width: 100%;
        .ant-select-selector {
          background: transparent;
          border: none;
          width: 100%;
          height: 100%;
          .ant-select-selection-item {
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Microsoft YaHei;
            font-weight: bold;
            font-size: 19px;
            color: #FFFFFF;
          }
        }
      }
      .icon {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(-35px, -50%);
        color: #00F0FF;
        font-size: 16px !important;
      }
    }
  }
  &-content {
    height: 64.75%;
    display: flex;
    min-height: 0;
    &-left {
      width: 26.82%;
      padding-left: 45px;
      box-sizing: border-box;
      &-item {
        &:nth-child(1) {
          height: 35.9%;
        }
        &:nth-child(2) {
          height: 32%;
        }
        &:nth-child(3) {
          height: 32%;
        }
      }
    }
    &-center {
      width: 47.08%;
      &-map {
        height: 100%;
        box-sizing: border-box;
        padding-right: 14px;
        padding-left: 5px;
      }
    }
    &-right {
      width: 26.1%;
      box-sizing: border-box;
      padding-right: 30px;
      &-item {
        &:nth-child(1) {
          // height: 30.3%;
          height: 64%;
        }
        &:nth-child(2) {
          // height: 33.7%;
          height: 36%;
        }
        &:nth-child(3) {
          // height: 36%;
        }
      }
    }
  }
  &-bottom {
    padding-left: 30px;
    box-sizing: border-box;
    height: 23%;
    // border: 1px solid lime;
    &-title {
      background: url(/@/assets/images/businessScreen/sub-title2.png) no-repeat;
      background-size: auto 100%;
    }
  }
  scrollbar-color: rgba(144, 147, 153, 0.3) rgba(0, 0, 0, 0.05);
  scrollbar-width: 7px;
}
</style>
