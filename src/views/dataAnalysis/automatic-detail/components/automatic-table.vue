<template>
  <a-table class="auto-bg" :columns="columns" :data-source="data" size="small" :pagination="false">
    <template #answerCode="{ text, record, index }">
      <div class="option-text">
        <a-tooltip placement="top">
          <template #title>
            <span>{{ text }}.{{ record.answerContent }}</span>
          </template>
          <span class="option-text-span">{{ text }}.{{ record.answerContent }}</span>
        </a-tooltip>
      </div>
    </template>
    <template #proportion="{ text, record, index }">
      <div style="display: flex; justify-content: center"> <a-progress style="width: 90%" :percent="text" :show-info="false" />{{ text }}% </div>
    </template>
  </a-table>
</template>
<script setup>
  import { reactive, defineProps } from 'vue';
  let { data } = defineProps(['data']);
  let scrollMax = reactive({ y: '180' });
  const columns = reactive([
    {
      title: '选项',
      dataIndex: 'answerCode',
      key: 'answerCode',
      ellipsis: true,
      align: 'center',
      slots: { customRender: 'answerCode' },
    },
    {
      title: '小计',
      align: 'center',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: '比例',
      dataIndex: 'proportion',
      key: 'proportion',
      align: 'center',
      slots: { customRender: 'proportion' },
    },
  ]);
</script>
<style scoped>
  .ranking-icon {
    width: 12px;
    height: 8px;
    border-radius: 8px;
    display: inline-block;
  }

  .option-text {
    padding-left: 14px;
  }

  .option-text-span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 20px;
    line-height: 25px;
    margin: auto;
    display: inline-block;
  }
</style>

<style>
  .statistics th {
    text-align: center !important;
  }

  .statistics td {
    text-align: center !important;
  }

  .auto-bg .ant-progress-status-success .ant-progress-bg {
    background-color: #1890ff !important;
  }
</style>
