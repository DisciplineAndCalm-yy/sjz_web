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
              <div v-if="item.dataIndex === 'provinceLevel'">
                <span :class="{ 'other': true,'A': row[item.dataIndex] == 'A', 'B': row[item.dataIndex] == 'B'}">{{ row[item.dataIndex] }}</span>
              </div>
              <div v-else>
                {{ row[item.dataIndex] }}
              </div>
            </div>
          </div>
        </div>
      </vue3-seamless-scroll>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { getBusinessManifestation } from '/@/api/businessScreen/businessScreen'
import { ref, computed, unref, watch } from 'vue';

const props = defineProps(['year'])

const dataSource = ref([])

const columns = [
  {
    title: '区县',
    dataIndex: 'countyName',
    key: 'countyName',
    flex: 1,
  },
  // {
  //   title: '得分',
  //   dataIndex: 'score',
  //   key: 'score',
  //   flex: 1,
  // },
  {
    title: '省评档次',
    dataIndex: 'provinceLevel',
    key: 'provinceLevel',
    flex: 1,
  },
]

async function init() {
  let res =  await getBusinessManifestation({year: props.year})
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
      // background: rgba(92, 96, 255,0.33);
      .th {
        height: 100%;
        background: rgba(76, 148, 255,0.29);
        padding-right: 3px;
        background-clip: content-box;
      }
    }
    .body {
      .tr {
        display: flex;
      }
      .tr:nth-child(even) {
  
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
        padding-right: 3px;
        padding-bottom: 3px;
        line-height: 1;
        > div {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          height: 100%;
          width: 100%;
          background: rgba(76, 148, 255,0.1);
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