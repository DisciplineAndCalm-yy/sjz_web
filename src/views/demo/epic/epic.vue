<template>
  <div class="demo-epic">
    <div class="control">
      <a-button @click="handleAllCom">所有注册组件</a-button>
      <a-button @click="initTemplate('keyTasks')">重点督办模板</a-button>
      <a-button @click="initTemplate('innovationDemonstration')">创新示范模板</a-button>
      <a-button @click="initTemplate('innovationPilot')">创新试点模板</a-button>
      <a-button @click="initTemplate('custom')">自定义模板</a-button>
      <a-button @click="handleAll">所有组件</a-button>
      <a-button @click="handleSave">保存</a-button>
      <a-button @click="handleRest">重置</a-button>
      <a-button @click="handleLog">log</a-button>
    </div>
    <div class="designer">
      <EDesigner ref="signer" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { EDesigner, pluginManager } from '@coderlt/form-designer';
  import { onMounted, ref } from 'vue';
  import { defaultSchema } from './epicConfig';

  const signer = ref(null);
  const type = ref('innovationDemonstration');
  // keyTasks 重点督办
  // innovationDemonstration 创新示范
  // innovationPilot 创新试点
  // custom 自定义

  // pluginManager.setCurrentSchemaType(['督办组件']);

  const handleAll = () => {
    pluginManager.setCurrentSchemaType([]);
  };

  onMounted(() => {
    initTemplate('innovationDemonstration');
  });

  const initTemplate = (key) => {
    type.value = key;
    const val = localStorage.getItem(type.value) as any;
    pluginManager.setCurrentSchemaType([key === 'custom' ? '督办自定义组件' : '督办组件']);

    if (val) {
      signer.value.setData(JSON.parse(val), true);
    } else {
      signer.value.setData(defaultSchema, true);
    }
  };

  const handleRest = () => {
    signer.value.setData(defaultSchema, true);
  };

  const handleLog = () => {
    const val = localStorage.getItem(type.value) as any;
    console.log('loc', val && JSON.parse(val));
    console.log('epic', signer.value.getData());
  };

  const handleSave = () => {
    localStorage.setItem(type.value, JSON.stringify(signer.value.getData()));
  };

  const handleAllCom = () => {
    console.log('epic', pluginManager.getComponents());
  };
</script>
<style lang="less" scoped>
  .demo-epic {
    display: flex;
    flex-direction: column;
    height: 100%;

    /deep/ .designer {
      flex: 1;
      height: 90%;

      // .epic-header-container,
      .epic-header-toolbar,
      .epic-action-bar,
      .edit-toolbar,
      .actions-container .action-item:nth-child(3) {
        display: none;
      }
    }
  }
</style>
