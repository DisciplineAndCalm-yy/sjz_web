<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-11-23 14:17:30
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-15 18:05:14
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\newCollection\algorithm.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div></div>
    <div class="content">
      <indicatorAlgorthmCofiguration v-if="nowStep === 1" @next-step="toSecond"></indicatorAlgorthmCofiguration>
      <secondConfig v-if="nowStep === 2" @next-step="toThird" :parentValue="secondValue"></secondConfig>
      <configureSubIndicator v-if="nowStep === 3" :parentValue="thirdValue" @prev-Step="goBack"></configureSubIndicator>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, nextTick, ref  } from 'vue';
import indicatorAlgorthmCofiguration from '../indicatorAlgorithmConfiguration/index.vue'
import configureSubIndicator from '../indicatorAlgorithmConfiguration/configureSubIndicator.vue'
import secondConfig from '../indicatorAlgorithmConfiguration/secondConfig.vue'
import { useRoute } from 'vue-router';

const nowStep = ref(1)
const route = useRoute()
const secondValue = ref({})
const thirdValue = ref({})

/**
 * 跳转到二级指标
 */
function toSecond(item) {
  console.log('chufale nextstep')
  nowStep.value ++
  secondValue.value = item
}
/**
 * 跳转到三级指标
 */
function toThird(item) {
  console.log('chufale nextstep')
  nowStep.value ++
  thirdValue.value = item
}

function goBack() {
  nowStep.value--
}
</script>

<style lang="less" scoped>

</style>