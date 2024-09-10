<template>
  <div class="scorll-list">
    <div class="scorll-table">
      <div class="header">
        <div class="th"  v-for="item in columns" :key="item.key" :style="`flex: ${item.flex || 1}`">
          <Icon class="icon" v-if="item.dataIndex == 'name'" icon="ant-design:caret-right-filled"></Icon>
          <span>{{ item.title }}</span>
        </div>
      </div>
      <!-- <vue3-seamless-scroll :list="dataSource" class="scroll" hover :step="0.3"> -->
        <div class="body">
          <div class="tr" v-for="row in dataSource" :key="row.key">
            <div class="td" v-for="(item,index) in columns" :key="`${row.key}-${item.key}`" :style="`flex: ${columns[index].flex || 1}`">
              <span v-if="item.dataIndex === 'name'" class="td-item">
                <span :class="{'icon': true, 'ing': row[item.dataIndex] == '执行中', 'done': row[item.dataIndex] == '已完成', 'over': row[item.dataIndex] == '已超期', 'total': row[item.dataIndex] == '年度任务总量',}"></span>
                <span>{{ row[item.dataIndex] }}</span>
              </span>
              <span v-else class="normal" :title="row[item.dataIndex]" >
                {{ row[item.dataIndex] }}
              </span>
            </div>
          </div>
        </div>
      <!-- </vue3-seamless-scroll> -->
    </div>
  </div>
</template>

<script lang='ts' setup>
import { getBusinessMonthTracking } from '/@/api/businessScreen/businessScreen'
import { ref, computed, unref, watch } from 'vue';


const dataSource = ref([])

const columns = ref([
  {
    title: '进度统计',
    dataIndex: 'name',
    key: 'name',
    flex: 1,
  },
])

async function init() {
  let res =  await getBusinessMonthTracking() || {}
  columns.value = [
    {
      title: '进度统计',
      dataIndex: 'name',
      key: 'name',
      flex: 1,
    },
  ]
  columns.value = [...columns.value, ...res.keyList].map(item => {
    return {
      title: item.title,
      dataIndex: item.dataIndex,
      key: item.dataIndex,
      flex: 1,
    }
  })
  dataSource.value = res.dataList || []
}

init()

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
        .td-item {
          display: flex;
          justify-content: center;
          align-items: center;
          .icon {
            display: block;
            width: 16px;
            height: 6px;
            border-radius: 3px;
          }
          .ing {
            background: #0084FF;
          }
          .done {
            background: #62FFC2;
          }
          .over {
            background: #FFE400;
          }
          .total {
            background: #9AF4FF;
          }
        }
      }
    }
    .th,
    .td {
      display: flex;
      align-items: center;
      justify-content: center;
      &:nth-child(1) {
        justify-content: flex-start;
        padding-left: 20px;
      }
      .icon {
        margin-right: 16px;
      }
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