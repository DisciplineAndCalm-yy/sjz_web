<template>
  <div class="analysis">
    <div class="analysis-box">
      <card-bar />
    </div>
    <div class="statistics-echart">
      <div class="statistics-echart-right-dom">
        <echart-line />
      </div>
    </div>
  </div>
</template>

<script setup>
  import cardBar from './part/card-bar.vue';
  import echartLine from './components/echart-line.vue';
</script>

<style lang="less" scoped>
  .analysis {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  .statistics-echart-right-dom {
    width: 100%;
    height: auto;

    /deep/.title {
      margin-bottom: 15px;
    }
  }
</style>
