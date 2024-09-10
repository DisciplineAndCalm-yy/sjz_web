<script setup lang="ts">
  import { watch, computed, inject } from 'vue';
  import { capitalizeFirstLetter, PageManager } from '@coderlt/form-designer'
  const props = defineProps({
    record: {
      type: Object,
      require: true,
      default: () => ({}),
    },
  });
  const emit = defineEmits(['update:value'])

  function handleUpdate (e = null): void {
    emit('update:value', e)
  }


  // 接收页面管理对象
  const pageManager = inject('pageManager', {}) as PageManager
  // 表单formData数据
  let formData = inject('formData', {})

  // 监听组件实例是否初始化
  watch(() => formData[props.record.field ?? ''], (val) => {
    console.log('val-val-val-val', val)
    if ('change' in props.record.on) {
      setTimeout(() => {
        console.log('setTimeout-val-val-val-val', val)
        pageManager.doActions(props.record.on.change)
      }, 500)
    }
  })

  const onEvent: { [type: string]: Function } = {}

  props.record.on && Object.keys(props.record.on).forEach((item) => {
    item !== 'change' && (onEvent[`on${capitalizeFirstLetter(item)}`] = (...args) => pageManager.doActions(props.record.on[item], ...args))
  })
  const getProps = computed(() => {
    return {
      ...props.record.componentProps,
      'onUpdate:value': handleUpdate,
      ...onEvent
    }
  })
</script>

<template>
  <a-select v-bind="getProps">
    <a-select-option v-for="item in record.componentProps.options" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
  </a-select>
</template>

<style scoped lang="less"></style>
