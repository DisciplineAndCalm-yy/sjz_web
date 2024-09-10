<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2024-02-28 18:07:00
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-03-05 17:07:37
 * @FilePath: \yst-city-shijiazhuang-web\src\views\businessScreen\components\screenMap.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="center-list">
    <div class="list">
      <div class="list-item" v-for="item in list" :key="item.indicatorName">
        <div class="num" :title="item.optimalValue">{{ item.optimalValue }}</div>
        <div class="name" :title="item.indicatorName">{{item.indicatorName}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, watch } from 'vue';
  import { getIndicatorProvinceOptimum } from '/@/api/businessScreen/businessScreen'

  const props = defineProps(['year'])

  const list = ref([])

  async function init() {
    let res =  await getIndicatorProvinceOptimum({year: props.year})
    list.value = res || []
  }

  watch(
    () => props.year,
    () => {
      init()
    },
    // {
    //   immediate: true,
    // }
  )
</script>

<style lang="less" scoped>
.center-list {
  height: 100%;
  width: 100%;
  overflow: auto;
  .list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4,1fr);
    .list-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 10px;
      width: 100%;
      height: 70px;
      background: url(/@/assets/images/businessScreen/item-bg.png) no-repeat;
      background-size: 100% 100%;
      overflow: hidden;
      .num {
        font-family: Microsoft YaHei;
        width: 100%;
        font-weight: bold;
        font-size: 16px;
        color: #FFE400;
        line-height: 1;
        text-align: center;
        margin-bottom: 7px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .name {
        font-family: Microsoft YaHei;
        width: 100%;
        font-weight: 400;
        font-size: 14px;
        text-align: center;
        color: #FFFFFF;
        line-height: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>