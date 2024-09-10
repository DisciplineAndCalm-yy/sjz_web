<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-11-23 14:06:13
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-12-19 16:48:37
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\newCollection\components\collectProgress.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <a-card class="collect-progress" size="small" title="采集进度">
    <template #extra>
      <a-button v-if="source !== 'dataReport'" type="primary" @click="sendAnnounce">催报</a-button>
    </template>
    <div class="content">
      <a-tabs v-model:activeKey="currentTab">
        <a-tab-pane :key="1" tab="指标维度">
          <collectProgressIndicator :pid="pid" />
        </a-tab-pane>
        <a-tab-pane v-if="source !== 'dataReport'" :key="2" tab="部门维度">
          <collectProgressDepartment :pid="pid" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { sendProjectAnnounce } from '/@/api/indicatorManagement';
  import collectProgressIndicator from './collectProgressIndicator.vue';
  import collectProgressDepartment from './collectProgressDepartment.vue';

  const props = withDefaults(defineProps<{ pid: string; source?: string }>(), {
    pid: '',
    source: '',
  });

  const sendAnnounce = () => {
    if (props.pid) {
      sendProjectAnnounce({ ids: props.pid });
    } else {
      message.error('项目id不能为空');
    }
  };

  const currentTab = ref(1);
</script>

<style lang="less" scoped>
  .collect-progress {
    margin: 10px 0;
  }
</style>
