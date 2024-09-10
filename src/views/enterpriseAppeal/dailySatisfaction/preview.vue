<template>
  <div class="main_box">
    <div class="tab">
      <mobile-outlined class="icon" />
      <span>移动端</span>
    </div>
    <div class="phone">
      <iframe :src="mobileUrl" frameborder="0" class="preview_html"></iframe>
    </div>
    <div class="qr_box">
      <p class="title">手机扫码预览</p>
      <p class="des">* 预览仅查看效果，无法提交数据</p>
      <div class="qr">
        <vue-qr :text="mobileUrl" :size="150" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { MobileOutlined } from '@ant-design/icons-vue';
  import vueQr from 'vue-qr/src/packages/vue-qr.vue';
  import { useRoute } from 'vue-router';
  import { question_getMobileUrl } from '/@/api/enterpriseAppeal/index';
  const route = useRoute();

  const formKey = route.query.key;

  const mobileUrl = ref('');
  const getMobileUrl = async () => {
    const url = await question_getMobileUrl();
    mobileUrl.value = `${url}?formKey=${formKey}`;
    // mobileUrl.value = `http://172.19.1.3:4500/?formKey=${formKey}`;
  };

  onMounted(() => {
    getMobileUrl();
  });
</script>

<style lang="less" scoped>
  .main_box {
    height: 100% !important;
    max-height: 100% !important;
    // overflow: hidden !important;
    overflow-y: auto;
    background-color: #f8f8f8;
    position: relative;
    .tab {
      width: 120px;
      margin: 20px auto;
      // margin-top: 10px;
      padding: 10px 20px;
      border-radius: 10px;
      background-color: white;
      font-size: 14px;
      color: #1890ff;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        margin-right: 5px;
      }
    }
    .phone {
      width: 372px;
      height: 744px;
      margin: 0 auto;
      background: url('./img/phone.png');
      background-size: 100% 100%;
      overflow: hidden;
      .preview_html {
        width: 345px !important;
        height: 568px !important;
        margin: 74px auto 0 auto;
        border-radius: 5px;
        outline: none;
        background-color: #fff;
        border-width: 2px;
        border-style: inset;
        border-color: initial;
        -o-border-image: initial;
        border-image: initial;
        border-top-width: 0;
        border-right-width: 0;
        border-bottom-width: 0;
        border-left-width: 0;
      }
    }
    .qr_box {
      position: absolute;
      top: 100px;
      right: 260px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        font-weight: bold;
        font-size: 16px;
      }
      .des {
        font-size: 12px;
      }
      .qr {
      }
    }
  }
</style>
