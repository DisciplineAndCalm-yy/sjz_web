<template>
  <div class="wardart_box">
    <div class="font_bg_box">
      <img class="font_bg font_bg_left" src="/@/assets/images/enterpriseSatisfactionAnalysis/appealTotalFontLeftBg.png" alt="" />
      <img class="font_bg font_bg_right" src="/@/assets/images/enterpriseSatisfactionAnalysis/appealTotalFontRightBg.png" alt="" />
    </div>
    <div class="dark"></div>
    <span class="wardart_title">{{ props.title }}</span>
  </div>
</template>

<script lang="ts" setup>
  import { defineProps } from 'vue';
  const props = withDefaults(
    defineProps<{
      title?: string;
    }>(),
    {
      title: '',
    }
  );
</script>

<style lang="less" scoped>
  .wardart_box {
    width: 68px;
    height: 68px;
    position: relative;
    background: #559cef80;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    margin: 0 11px 11px 0;
    &::after {
      content: ' ';
      width: 68px;
      height: 68px;
      background: #ffffff80 !important;
      border-radius: 10px;
      position: absolute;
      bottom: -11px;
      right: -11px;
      z-index: 5;
    }
    .font_bg_box {
      position: absolute;
      width: 53px;
      height: 53px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 20;
      .font_bg {
        position: absolute;
        height: 53px;
      }
      .font_bg_left {
        left: 0;
      }
      .font_bg_right {
        right: 0;
      }
    }
    .dark {
      width: 57px;
      height: 57px;
      border-radius: 10px 0;
      position: absolute;
      bottom: 0;
      right: 0;
      background: #61aaff;
      z-index: 10;
    }
    .wardart_title {
      font-size: 20px;
      font-weight: 500;
      color: white;
      z-index: 20;
    }
  }
</style>
