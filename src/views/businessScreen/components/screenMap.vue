<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2024-02-28 18:07:00
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-03-20 11:29:47
 * @FilePath: \yst-city-shijiazhuang-web\src\views\businessScreen\components\screenMap.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="map-box">
    <div class="map-header">
      <div class="score">
        <div class="name">{{ props.year }}年度营商环境得分</div>
        <div class="values">
          <span class="nums">
            <span class="num">{{ rankObj.score }}</span>
            <span class="unit">分</span>
          </span>
          <span :class="['change', rankObj.scoreChange < 0 ? 'down' : 'up']">
            <span>{{ rankObj.scoreChange }}</span>
            <img :src="rankObj.scoreChange < 0 ? downImg : upImg" alt="" />
          </span>
        </div>
      </div>
      <div class="rank">
        <div class="name">{{ props.year }}年度营商环境总体排名</div>
        <div class="values">
          <span class="nums">
            <span class="unit">第</span>
            <span class="num">{{ rankObj.overallRank }}</span>
            <span class="unit">名</span>
          </span>
          <span :class="['change', rankObj.overallRankChange < 0 ? 'down' : 'up']">
            <span>{{ rankObj.overallRankChange }}</span>
            <img :src="rankObj.overallRankChange < 0 ? downImg : upImg" alt="" />
          </span>
        </div>
      </div>
      <div class="good">
        <div class="name">{{ props.year }}年度企业满意度排名</div>
        <div class="values">
          <span class="nums">
            <span class="unit">第</span>
            <span class="num">{{ rankObj.satisfactionRank }}</span>
            <span class="unit">名</span>
          </span>
          <span :class="['change', rankObj.satisfactionRankChange < 0 ? 'down' : 'up']">
            <span>{{ rankObj.satisfactionRankChange }}</span>
            <img :src="rankObj.satisfactionRankChange < 0 ? downImg : upImg" alt="" />
          </span>
        </div>
      </div>
    </div>
    <div class="map-body">
      <div class="left"></div>
      <div class="right"></div>
      <div class="chartRef" ref="chartRef"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useECharts } from '/@/hooks/web/useECharts';
import { ref, Ref, reactive, watchEffect, watch, onMounted } from 'vue';
import { getMapRegionDetails, getOverallStatistics } from '/@/api/businessScreen/businessScreen'
import sjz from '/@/assets/json/sjz.json'
import sjzB from '/@/assets/json/sjz_border.json'
import echarts from '/@/utils/lib/echarts';
import MapImg from '/@/assets/images/businessScreen/map-bg.png';
import mapItemBg from '/@/assets/images/businessScreen/map-item-bg.png'
import upImg from '/@/assets/images/businessScreen/up.png'
import downImg from '/@/assets/images/businessScreen/down.png'
import pinImg from '/@/assets/images/businessScreen/pin.png'

const props = defineProps(['year'])

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions, getInstance } = useECharts(chartRef as Ref<HTMLDivElement>);

const chartData = ref([])
const rankObj = ref({})

let img = document.createElement('img');
img.src = MapImg;

const option = reactive({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'transparent',
    borderWidth: 0,
    formatter: function (params, ticket, callback) {
      // console.log('mapParams:::', params)
      // let str = `
      // <div style='width: 260px;height: 146px;background: url(${mapItemBg}) no-repeat;background-size:100% 100%;'>
      //   <div style="font-size: 16px;font-weight: bold;color: #FFFFFF; padding:10px 23px 16px;">${params.name}</div>
      //   <div style="height: 17px; display:flex; justify-content: space-between; align-items: center; padding:10px 0; margin-left: 30px; margin-right: 20px;">
      //     <div style="display:flex; align-items: center">
      //       <div style="width:6px; height:6px; background: #FFC100; margin-right:17px;"></div>
      //       <span style="font-size: 14px; color: #FFFFFF;">得分</span>
      //     </div>
      //     <div style="font-weight: bold;font-size: 17px; color: #FFC100;">${params.data ? params.data.score ?? '-' : '-'}</div>
      //   </div>
      //   <div style=" height: 17px; display:flex; justify-content: space-between; align-items: center; padding:10px 0; margin-left: 30px; margin-right: 20px;">
      //     <div style="display:flex; align-items: center">
      //       <div style="width:6px; height:6px; background: #00EAFF; margin-right:17px;"></div>
      //       <span style="font-size: 14px; color: #FFFFFF;">企业满意度省评档次</span>
      //     </div>
      //     <div style="font-weight: bold;font-size: 17px; color: #00EAFF;">${params.data ? params.data.satisfactionProvinceRank ?? '-' : '-'}</div>
      //   </div>
      //   <div style="height: 17px; display:flex; justify-content: space-between; align-items: center; padding:10px 0; margin-left: 30px; margin-right: 20px;">
      //     <div style="display:flex; align-items: center">
      //       <div style="width:6px; height:6px; background: #00FF30; margin-right:17px;"></div>
      //       <span style="font-size: 14px; color: #FFFFFF;">省评得分档次</span>
      //     </div>
      //     <div style="font-weight: bold;font-size: 17px; color: #00FF30;">${params.data ? params.data.provinceRank ?? '-' : '-'}</div>
      //   </div>
      // </div>`

      let str = `
      <div style='width: 260px;height: 146px;background: url(${mapItemBg}) no-repeat;background-size:100% 100%;'>
        <div style="font-size: 16px;font-weight: bold;color: #FFFFFF; padding:10px 23px 16px;">${params.name}</div>
        
        <div style="height: 17px; display:flex; justify-content: space-between; align-items: center; padding:10px 0; margin-left: 30px; margin-right: 20px;">
          <div style="display:flex; align-items: center">
            <div style="width:6px; height:6px; background: #00FF30; margin-right:17px;"></div>
            <span style="font-size: 14px; color: #FFFFFF;">省评得分档次</span>
          </div>
          <div style="font-weight: bold;font-size: 17px; color: #00FF30;">${params.data ? params.data.provinceRank ?? '-' : '-'}</div>
        </div>
      </div>`
      return str
    },
    padding: 0,
  },
  grid: {
    left: '30px',
    top: '10px',
    bottom: '30px',
    containLabel: true,
    height: '100%',
  },
  geo: [
    // city 线条样式
    {
      map: 'sjz',
      geoIndex: 1,
      zoom: 1,
      // layoutCenter,
      z: 3,
      layoutSize: '80%',
      show: true,
      label: {
        normal: {
          show: false,
        },
      },
      roam: false, // 是否允许缩放
      itemStyle: {
        normal: {
          areaColor: 'rgb(5, 8, 64, 0.4)',
          borderWidth: 1,
          borderColor: '#21eae6',
          shadowColor: '#21eae6',
          shadowBlur: 20,
        },
      },
      emphasis: {
        areaColor: 'rgb(5, 8, 64, 0.4)',
      },
      selectedMode: 'single',
      select: {
        disabled: true, //可以被选中
        label: {
          show: true,
          color: '#fff',
        },
      },
      silent: true,
    },
    // 边框高亮
    {
      map: 'sjzB',
      geoIndex: 2,
      zoom: 1,
      // layoutCenter,
      layoutSize: '80%',
      z: 2,
      show: true,
      label: {
        show: false,
      },
      roam: false, // 是否允许缩放
      itemStyle: {
        normal: {
          borderWidth: 3,
          borderColor: '#c0fffe',
          areaColor: 'rgb(0,0,0,0)',
          shadowColor: '#031c44',
          shadowBlur: 20,
        },
      },
      emphasis: null,
      silent: true,
    },
    // 地图 img 绘制
    {
      map: 'sjz',
      geoIndex: 3,
      zoom: 1,
      // layoutCenter,
      layoutSize: '80%',
      z: 1,
      label: {
        emphasis: {
          show: false,
        },
      },
      roam: false,
      itemStyle: {
        areaColor: {
          image: img, // 支持为 HTMLImageElement, HTMLCanvasElement，不支持路径字符串
          repeat: 'repeat', // 是否平铺, 可以是 'repeat-x', 'repeat-y', 'no-repeat'
        },
      },
      regions: [],
      silent: true,
    },
    // 高度阴影
    {
      map: 'sjzB',
      geoIndex: 4,
      zoom: 1,
      layoutCenter: ['53%', '54%'],
      layoutSize: '80%',
      z: -1,
      show: true,
      label: {
        show: false,
      },
      roam: false, // 是否允许缩放
      itemStyle: {
        normal: {
          borderWidth: 0,
          // borderColor: '#c0fffe',
          areaColor: '#031c44',
          shadowColor: '#031c44',
          shadowBlur: 20,
        },
      },
      silent: true,
      emphasis: null,
    },
  ],
  series: [
    {
      type: 'map', // 指定类型为地图
      map: 'sjz',
      roam: false, // 是否开启鼠标缩放和鼠标拖拽
      scaleLimit: {
        min: '1',
      },
      itemStyle: {
        normal: {
          borderColor: 'rgba(147, 235, 248, 1)', // 地图的描边颜色
          borderWidth: 0.5, // 地图描边线宽
          areaColor: "rgba(0,0,0,0)", //区域颜色
          // color: 'rgba(0,0,0,0)'
          // opacity: 1,
        },
        emphasis: {
          areaColor: 'rgba(0, 252, 243,0.35)',
        },
      },
      select: {
        disabled: true
      },
      label: {
        // 地图标签配置项
        normal: {
          show: true, // 是否显示标签  例如区县名称
          color: '#fff', // 标签名称颜色
          fontWeight: '300',
          fontSize: '12',
          formatter: (text) => {

          },
        },
        emphasis: {
          show: true,
          color: '#fff',
        },
      },
      // markPoint: {
      //   data:[
      //     {name: '高新区', coord: [100, 200], value: '高新区'},
      //     {name: '经开区', yAxis: 20, x: '90%', value: '经开区'},
      //     {name: '综保区',x: 100, y: 100, value: '综保区'},
      //   ],
      //   itemStyle: {
      //     color: 'green',
      //   },
      // },
      data: chartData.value,
    },
    {
      type: 'scatter',
      coordinateSystem: 'geo',
      z: 4,
      geoIndex: 1,
      symbolSize: 30,
      symbol: `image://${pinImg}`,
      symbolOffset: [0, '-50%'],
      label: {
        show: false,
        color: '#fff',
        formatter: '{b}',
        position: 'bottom',
      },
      itemStyle: {
        // color: 'yellow'
      },
      select: {
        disabled: true
      },
      emphasis: {
        disabled: true
      },
      tooltip: {
        show: false,
      },
      data: [
        {name: '高新区', value: [114.616721,38.045298]},
        {name: '经开区', value: [114.684979,38.038292]},
        {name: '综保区', value: [114.731465,38.274416]},
      ]
    }
  ]
})

onMounted(() =>{
  echarts.registerMap('sjz', sjz)
  echarts.registerMap('sjzB', sjzB)
})

/**
 * 初始化echarts
 */
function initCharts() {
  let mapData = chartData.value || []
  mapData = mapData.map(item => { return {...item, name: item.regionName}})
  chartData.value = mapData
  option.series[0].data = chartData.value
  let regions = []
  mapData.forEach(item => {
    if (/\S+市$/.test(item.name)) {
      regions.push({
        name: item.name,
        itemStyle: {
          areaColor: 'rgba(5, 8, 64, 0)'
        },
        emphasis: {
          areaColor: 'rgba(5, 8, 64, 0)'
        }
      })
    }
    if (/\S+区$/.test(item.name)) {
      regions.push({
        name: item.name,
        itemStyle: {
          areaColor: 'rgba(5, 8, 64, 0)'
        },
        emphasis: {
          areaColor: 'rgba(5, 8, 64, 0)'
        }
      })
    }
  })
  option.geo[0].regions = regions
  setOptions(option);
}
initCharts()

async function init() {
  rankObj.value = await getOverallStatistics({ year: props.year }) || {}
  chartData.value = await getMapRegionDetails({ year: props.year })
  initCharts()
}

watch(
  () => props.year,
  () => {
    // console.log('year', props.year)
    init()
  },
  // {
  //   immediate: true,
  // }
)
</script>

<style lang="less" scoped>
.map-box {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  width: 100%;

  .map-header {
    margin-top: 24px;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .score,
    .rank,
    .good {
      flex: 1;
      // width: 252px;
      min-width: 0;
      height: 50px;
      position: relative;

      .name {
        position: absolute;
        left: 56px;
        top: 0;
        height: 18px;
        box-sizing: border-box;
        line-height: 1;
        font-family: Microsoft YaHei;
        font-weight: bold;
        font-size: 16px;
        color: #FFFFFF;
      }

      .values {
        position: absolute;
        left: 107px;
        bottom: 3px;
        height: 20px;
        line-height: 1;
        display: flex;
        
        .nums {
          .num {
            font-family: Microsoft YaHei;
            font-weight: bold;
            font-size: 20px;
            color: #FFE400;
          }

          .unit {
            font-family: Microsoft YaHei;
            font-weight: 400;
            font-size: 18px;
            color: #FFFFFF;
          }
        }

        .change {
          font-family: Microsoft YaHei;
          font-weight: bold;
          font-size: 14px;
          display: flex;
          align-items: center;
          &.up {
            color: #20E112;
          }

          &.down {
            color: #FF2828;
          }

          span {
            &:nth-child(1) {
              margin-left: 14px;
              margin-right: 10px;
            }
            
          }
        }
      }
    }

    .score {
      background: url(/@/assets/images/businessScreen/score-bg.png) no-repeat;
      background-size: auto 100%;

      .num {
        margin-right: 10px;
      }
    }

    .rank {
      background: url(/@/assets/images/businessScreen/rank-bg.png) no-repeat;
      background-size: auto 100%;

      .num {
        margin: 0 10px;
      }
    }

    .good {
      background: url(/@/assets/images/businessScreen/good-bg.png) no-repeat;
      background-size: auto 100%;

      .num {
        margin: 0 10px;
      }
    }
  }

  .map-body {
    flex: 1;
    width: 100%;
    position: relative;
    .left {
      position:absolute;
      left: 50px;
      top: 50%;
      transform: translateY(-50%);
      width: 120px;
      height: 386px;
      background: url(/@/assets/images/businessScreen/left-halo.png) no-repeat;
      background-size: 100% 100%;
    }
    .right {
      position:absolute;
      right: 50px;
      top: 50%;
      transform: translateY(-50%);
      width: 120px;
      height: 386px;
      background: url(/@/assets/images/businessScreen/right-halo.png) no-repeat;
      background-size: 100% 100%;
    }
    .chartRef {
      height: 100%;
      width: 100%;
    }
  }
}
</style>