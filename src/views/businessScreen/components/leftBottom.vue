<template>
  <div class="scorll-list">
    <div class="scorll-table">
      <div class="header">
        <div class="th"  v-for="item in columns" :key="item.key" :style="`flex: ${item.flex || 1}`">{{ item.title }}</div>
      </div>
      <vue3-seamless-scroll :list="dataSource" class="scroll" hover :step="0.3">
        <div class="body">
          <div class="tr" v-for="row in dataSource" :key="row.key">
            <div class="td" v-for="(item,index) in columns" :key="`${row.key}-${item.key}`" :style="`flex: ${columns[index].flex || 1}`">
              <span class="trend" v-if="item.dataIndex === 'score'">
                <span class="score">{{ row[item.dataIndex] }}</span>
              </span>
              <span v-else :title="row[item.dataIndex]">
                {{ row[item.dataIndex] }}
              </span>
            </div>
          </div>
        </div>
      </vue3-seamless-scroll>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { getImportantWork } from '/@/api/businessScreen/businessScreen'
import { ref, computed, unref, watch } from 'vue';

const props = defineProps(['year'])

const dataSource = ref([])

const columns = [
  {
    title: '一级指标',
    dataIndex: 'indicatorName',
    key: 'indicatorName',
    flex: 1,
  },
  {
    title: '重点工作任务',
    dataIndex: 'workTask',
    key: 'workTask',
    flex: 1,
  },
  {
    title: '得分',
    dataIndex: 'score',
    key: 'score',
    flex: 1,
  },
]

async function init() {
  let res =  await getImportantWork({year: props.year})
  console.log('datasour.value', dataSource.value)
  dataSource.value = res || []
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

<style lang='less' scoped>
.scorll-list {
  height: 100%;
  position: relative;
  .scorll-table {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .header {
      display: flex;
      align-items: center;
      font-family: Microsoft YaHei;
      font-weight: bold;
      height: 30px;
      font-size: 14px;
      color: #FFFFFF;
      background: linear-gradient(to right, rgba(0, 162, 255, 0), rgba(0, 162, 255, 0.5), rgba(0, 162, 255, 0));
      .th {
        height: 100%;
      }
    }
    .body {
      .tr {
        display: flex;
        box-sizing: border-box;
        background: linear-gradient(to right, rgba(0, 162, 255, 0), rgba(0, 162, 255, 0.2), rgba(0, 162, 255, 0));
        padding-bottom: 6px;
        background-clip: content-box;
      }
      .tr:nth-child(even) {
        // background: rgba(0, 162, 255, 0.1);
      }
      .tr:nth-child(odd) {
        // background: #021b8c;
      }
      .td {
        padding: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #FFFFFF;
        line-height: 1;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .score {
          font-family: Microsoft YaHei;
          font-weight: bold;
          font-size: 14px;
          color: #FFFFFF;
        }
      }
    }
    .th,
    .td {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.scroll {
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}
</style>