<template>
  <component :is="currentModal" :formData="formData" v-model:visible="modalVisible" />
</template>
<script setup lang="ts" name="dynamic-notice">
  import { ref, defineExpose, shallowRef, ComponentOptions, nextTick } from 'vue';
  const props = defineProps({
    path: { type: String, default: '' },
    formData: { type: Object, default: () => ({}) },
  });
  const modalVisible = ref<Boolean>(false);
  const currentModal = shallowRef<Nullable<ComponentOptions>>(null);
  const formData = ref<any>(props.formData);

  const componentType = {};

  /**
   * 跟换组件和传值事件
   */
  function detail() {
    setTimeout(() => {
      if (props.path) {
        nextTick(() => {
          currentModal.value = componentType[props.path];
          formData.value = props.formData;
          modalVisible.value = true;
        });
      }
    }, 200);
  }

  defineExpose({
    detail,
  });
</script>
