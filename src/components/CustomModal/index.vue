<template>
  <div class="CustomModal_mack" v-if="visible" @click="closemain">
    <div class="CustomModal_mack_main">
      <div class="CustomModal_con" @click.stop="onclosemain" :style="'width:' + width + 'px;height:' + (height ? height + 'px' : 'auto')">
        <div class="CustomModal_title" v-if="title">{{ title }}</div>
        <slot name="modalMains"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  // , computed, CSSProperties, unref, ref, watchEffect, watch, PropType
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'CustomModal',
    props: {
      width: {
        type: Number,
        default: 200,
      },
      height: {
        type: Number,
        default: 0,
      },
      visible: {
        type: Boolean,
        required: true,
      },
      title: {
        type: String,
        default: '',
      },
    },
    emits: ['closeDom'],
    setup(props, { emit }) {
      const closemain = () => {
        return;
        emit('closeDom');
      };
      const onclosemain = () => {};
      return {
        props,
        closemain,
        onclosemain,
      };
    },
  });
</script>

<style lang="less" scoped>
  .CustomModal_mack {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 520;
    overflow-y: auto;
    .CustomModal_mack_main {
      width: 100%;
      min-height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 80px 0;
      box-sizing: border-box;
    }
    .CustomModal_con {
      background: #fff;
      padding: 20px;
      box-sizing: border-box;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.06);
      border-radius: 10px;

      .CustomModal_title {
        height: 40px;
        padding-left: 15px;
        box-sizing: border-box;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        color: #333333;
        border-bottom: 1px solid #d9d9d9;
        margin-bottom: 10px;
      }
    }
  }
</style>
