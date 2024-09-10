<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-12-06 11:04:31
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-17 16:59:34
 * @FilePath: \yst-province-hebei-web\src\views\dataReport\reporterDetail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="reportDetail">
    <div class="back" @click="handleBack">
      <left-outlined />
      <span>返回</span>
    </div>
    <collectInfo :pid="pid" :collectInfoConfig="collectInfoConfig" source="collect" />
    <collectProgress :pid="pid" source="dataReport"/>
    <detailList :pid="pid" :readonly="1" type="audit"></detailList>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, nextTick, ref  } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LeftOutlined } from '@ant-design/icons-vue';
import collectInfo from '../indicatorManagement/newCollection/components/collectInfo.vue';
import collectProgress from '../indicatorManagement/newCollection/components/collectProgress.vue';
import detailList from './components/detailList.vue';
const route = useRoute();
const router = useRouter();

const pid = ref(route.query.id as string);

const collectInfoConfig = [
  {
    title: '任务名称',
    value: 'name',
  },
  {
    title: '采集范围',
    value: 'monitorTypeName',
  },
  {
    title: '采集状态',
    value: 'projectStatusText',
  },
  {
    title: '校核状态',
    value: 'checkStatusText',
  },
  {
    title: '发起部门',
    value: 'createDepart',
  },
  {
    title: '发起时间',
    value: 'activateTime',
  },
];

function handleBack() {
  router.go(-1)
}

</script>

<style lang="less" scoped>
.reportDetail {
  .back {
    width: 100%;
    padding: 10px;
    background: white;
    cursor: pointer;
  }
}
</style>