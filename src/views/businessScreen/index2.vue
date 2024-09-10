<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2024-02-27 14:32:51
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-03-25 18:09:11
 * @FilePath: \yst-city-shijiazhuang-web\src\views\businessScreen\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="businessScreen">
    <div class="businessScreen-header">
      <h1>营商环境监测督导系统</h1>
      <div class="toIndex" @click="toIndex">返回首页</div>
      <div class="toAnother" @click="toAnother">营商环境测评</div>
    </div>
    <div class="businessScreen-body">
      <div class="businessScreen-body-top">
        <div class="businessScreen-body-top-left">
          <div class="businessScreen-body-item">
            <div class="businessScreen-body-item-title">
              <h3>营商行动</h3>
            </div>
            <div class="businessScreen-body-item-content">
              <businessAction></businessAction>
            </div>
          </div>
        </div>
        <div class="businessScreen-body-top-center">
          <businessStatistics></businessStatistics>
        </div>
        <div class="businessScreen-body-top-right">
          <div class="businessScreen-body-item businessScreen-body-top-right-item">
            <div class="businessScreen-body-item-title">
              <h3>督办类型</h3>
            </div>
            <div class="businessScreen-body-item-content">
              <businessSupervise></businessSupervise>
            </div>
          </div>
          <div class="businessScreen-body-item businessScreen-body-top-right-item">
            <div class="businessScreen-body-item-title">
              <h3>任务概览</h3>
            </div>
            <div class="businessScreen-body-item-content">
              <businessTask></businessTask>
            </div>
          </div>
        </div>
      </div>
      <div class="businessScreen-body-bottom">
        <div class="businessScreen-body-item">
          <div class="businessScreen-body-item-title">
              <h3>营商月追踪</h3>
            </div>
            <div class="businessScreen-body-item-content">
              <businessMonth></businessMonth>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { unref, computed, ref, watchEffect } from 'vue';
  import '/@/utils/rem'
  import { useRouter } from 'vue-router'
  import businessAction from './components/businessAction.vue'
  import businessSupervise from './components/businessSupervise.vue';
  import businessMonth from './components/businessMonth.vue';
  import businessTask from './components/businessTask.vue';
  import businessStatistics from './components/businessStatistics.vue'

  const router = useRouter()

  const toAnother = () => {
    router.push({
      path: '/businessScreen'
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
  background: url(/@/assets/images/businessScreen/bg2.png) no-repeat;
  background-size: 100% 100%;
  &-header {
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
  }
  &-body {
    flex: 1;
    min-height: 0;
    box-sizing: border-box;
    padding-left: 45px;
    padding-right: 45px;
    &-item {
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      min-height: 0;
      height: 100%;
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
    }
    &-top {
      height: 68.1%;
      display: flex;
      &-left {
        width: 26.6%;
      }
      &-center {
        width: 44.5%;
      }
      &-right {
        width: 28.9%;
        &-item {
          height: 50%;
        }
        &-item {
          height: 50%;
        }
      }
    }
    &-bottom {
      height: 31.8%;
    }
  }
}
</style>
