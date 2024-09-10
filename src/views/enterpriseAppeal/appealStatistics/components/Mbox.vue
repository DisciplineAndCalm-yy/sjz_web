<template>
  <div class="box">
    <div v-if="title" class="title">
      <span>{{ props.title }}</span>
      <div><slot name="titleRight"></slot></div>
    </div>
    <slot></slot>
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
  .box {
    background-color: white;
    border-radius: 4px;
    width: 100%;
    padding: 15px 30px;
    margin-bottom: 10px;
    .title {
      font-size: 16px;
      font-weight: 600;
      position: relative;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      &::before {
        content: ' ';
        position: absolute;
        top: 50%;
        left: -10px;
        transform: translateY(-50%);
        width: 4px;
        height: 15px;
        background: #4476fa;
        border-radius: 4px;
      }
    }
  }
</style>
