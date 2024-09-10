<template>
  <div class="h-full">
    <div class="control">
      <a-button @click="initTemplate('keyTasks')">重点督办模板</a-button>
      <a-button @click="initTemplate('innovationDemonstration')">创新示范模板</a-button>
      <a-button @click="initTemplate('innovationPilot')">创新试点模板</a-button>
      <a-button @click="initTemplate('custom')">自定义模板</a-button>
      <a-button @click="getData">获取 form 值</a-button>
      <!-- <a-button @click="handleSave">保存</a-button>
        <a-button @click="handleRest">重置</a-button>
        <a-button @click="handleLog">log</a-button> -->
    </div>
    <div class="builder">
      <EBuilder ref="EBuilderref" :pageSchema="pageSchema" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { EBuilder, PageManager } from '@coderlt/form-designer';
  import { onMounted, ref } from 'vue';

  const pageSchema = ref<any>({});

  // keyTasks 重点督办
  // innovationDemonstration 创新示范
  // innovationPilot 创新试点
  // custom 自定义

  onMounted(() => {
    initTemplate('keyTasks');
  });

  const initTemplate = (key) => {
    const val = localStorage.getItem(key) as any;

    if (val) {
      pageSchema.value = JSON.parse(val);
    }
  };

  const EBuilderref = ref();
  const getData = async () => {
    if (EBuilderref.value) {
      console.log('EBuilderref', await EBuilderref.value.validate());
    }
  };
</script>
<style>
  .h-full {
    height: 100vh;
  }
</style>
