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
              <span v-if="item.dataIndex === 'indicatorLevel'">
                <span :class="{ 'other': true,'A': row[item.dataIndex] == 'A', 'B': row[item.dataIndex] == 'B'}">{{ row[item.dataIndex] }}</span>
              </span>
              <span v-else-if="item.dataIndex === 'provinceCompare'">
                <span :class="{'high': row[item.dataIndex] == '高', 'low': row[item.dataIndex] == '低', 'equal': row[item.dataIndex] == '持平'}">{{ row[item.dataIndex] }}</span>
              </span>
              <span class="normal" :title="row[item.dataIndex]" v-else>
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
import { getObjectiveData } from '/@/api/businessScreen/businessScreen'
import { ref, computed, unref, watch } from 'vue';

const props = defineProps(['year'])

const dataSource = ref([])

const columns = [
  {
    title: '一级指标',
    dataIndex: 'indicatorName',
    key: 'indicatorName',
    flex: 2,
  },
  {
    title: '指标档次',
    dataIndex: 'indicatorLevel',
    key: 'indicatorLevel',
    flex: 1,
  },
  {
    title: '对比全省平均得分',
    dataIndex: 'provinceCompare',
    key: 'provinceCompare',
    flex: 2,
  },
]

async function init() {
  let res =  await getObjectiveData({year: props.year})
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
      }
      .tr:nth-child(even) {
        background: rgba(0, 162, 255, 0.1);
      }
      .tr:nth-child(odd) {
        // background: #021b8c;
      }
      .td {
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #FFFFFF;
        line-height: 1;
        .normal {
          padding: 8px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-family: Microsoft YaHei;
          box-sizing: border-box;
        }
        .other {
          font-family: Microsoft YaHei;
          font-weight: bold;
          font-size: 14px;
          color: #FFFFFF;
        }
        .A {
          color: #20E112;
        }
        .B {
          color: #FFE400;
        }
        .high,.low,.equal {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 22px;
          padding: 4px;
          border-radius: 4px;
        }
        .high {
          border: 1px solid #20E112;
          color: #20E112;
        }
        .low {
          border: 1px solid #FF4D4D;
          color: #FF4D4D;
        }
        .equal {
          border: 1px solid #FFE400;
          color: #FFE400;
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