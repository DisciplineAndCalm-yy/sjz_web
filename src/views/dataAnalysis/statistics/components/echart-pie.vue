<template>
    <div class="echart-pie">
        <div class="echarts-legend">
            <nav>
                <div class="echarts-legend-item" v-for='item, key in seriesData' @click="handleClick(item, key)">
                    <div class="echarts-legend-item-title">
                        <template v-if="item.status">
                            <span
                                :style="{
                                  'background': item.name == '评价类数量' ? color[2] : item.name == '我要投诉数量' ? color[0] : color[1] }">
                            </span>
                        </template>
                        <template v-else>
                            <span :style="{ 'background': '#ccc' }"></span>
                        </template>
                        <span>{{ item.name }}</span>
                        <span>占比</span>
                    </div>
                    <div class="echarts-legend-item-count" :style="{ 'color': color[key] }">
                        <span>{{ item.value ? item.value : '--' }}</span>
                        <span>{{ item.proportion ? item.proportion : '--' }}%</span>
                    </div>
                </div>
            </nav>
        </div>
        <div class="echarts" id="echart"></div>
    </div>
</template>

<script setup >
import * as echarts from 'echarts';
import { onMounted, ref, reactive, defineProps, watch, onBeforeUnmount } from 'vue';
// let { data } = defineProps(['data']);
let color = ['#3b8ce9', '#ea6672', '#5bc374'];
//展示的数据
let seriesData = ref([]);
const getEchart = (data) => {
    let option = {
        series: [{
            name: '数量',
            type: 'pie',
            radius: ['72%', '90%'],
            center: ['50%', '50%'],
            data: seriesData.value,
            label: {
                normal: {
                    show: false,
                    position: 'center',
                    formatter: '{text|{c}}\n{b}',
                    rich: {
                        text: {
                            align: 'center',
                            verticalAlign: 'middle',
                            padding: 8,
                            fontSize: 30
                        },
                        value: {
                            align: 'center',
                            verticalAlign: 'middle',
                            fontSize: 20
                        }
                    }
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '12'
                    }
                }
            },
            itemStyle: {
                color: function ({ name }) {
                    if (name == "评价类数量") {
                        return color[2]
                    }
                    if (name == '我要投诉数量') {
                        return color[0]
                    }
                    if (name == '我要咨询数量') {
                        return color[1]
                    }
                }
            },
            labelLine: {
                normal: {
                    show: true
                }
            }
        }]
    };
    document.getElementById("echart").removeAttribute('_echarts_instance_');
    let dom = document.querySelector("#echart")
    let myChart = echarts.init(dom);
    myChart.clear();
    let res = [
        {
            name: '我要咨询数量',
            value: data.consultingNum,
            proportion: data.consultingProportion
        },
        {
            name: '我要投诉数量',
            value: data.complaintsNum,
            proportion: data.complaintsProportion
        }
    ]
    res.forEach(v => {
        v['status'] = true;
        v.value = v.value ? v.value : 0
        v.proportion = v.proportion ? v.proportion : 0
    })
    seriesData.value = [];
    seriesData.value.push(...res);
    option.series[0].data = seriesData.value;
    myChart.clear();
    myChart.setOption(option);
    const resizeObserver = new window.ResizeObserver(() => {
        myChart.resize();
    });
    resizeObserver.observe(dom);
}
onBeforeUnmount(() => {
    let dom = document.querySelector("#echart");
    let myChart = echarts.init(dom);
    myChart.dispose();
})

/**
 * 自定义的legend事件
 * @param  {Object} item 循环的时候的data拿到用于展示的数据
 * @param  {Number} key  索引
 */
const handleClick = (item, key) => {
    let newData = [];
    seriesData.value.forEach((val) => {
        if (item.name == val.name) {
            val.status = !val.status;
        }
    })
    newData.push(...seriesData.value.filter((v) => v.status));
    let dom = document.querySelector("#echart");
    echarts.init(dom).setOption({ series: [{ data: newData }] });
}
defineExpose({
    getEchart
})
</script>

<style scoped lang="less">
.echart-pie {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
}

.echarts-legend {
    height: 100%;
    display: flex;
    width: 220px;
}

.echarts-legend>nav {
    margin: auto 0px;
    width: 100%;
}

.echarts-legend-item {
    user-select: none;
    width: 195px;
    cursor: pointer;

    &+.echarts-legend-item {
        margin-top: 30px;
    }

    .echarts-legend-item-title {
        height: 14px;
        line-height: 14px;
        display: flex;

        span:nth-child(1) {
            min-width: 14px;
            height: 14px;
            background-color: red;
            border-radius: 50%;
        }

        span:nth-child(2) {
            width: 100px;
            font-size: 14px;
            color: #999999;
            padding-left: 10px;
            text-align: left;
        }

        span:nth-child(3) {
            width: 80px;
            font-size: 14px;
            color: #999999;
            text-align: left;
            text-align: center;
        }
    }

    .echarts-legend-item-count {
        margin-top: 10px;
        height: 20px;
        line-height: 20px;
        padding-left: 14px;
        display: flex;

        span:nth-child(1) {
            padding-left: 10px;
            width: 100px;
            font-size: 20px;
        }

        span:nth-child(2) {
            width: 80px;
            text-align: center;
            font-size: 20px;
        }
    }
}

#echart {
    width: 210px;
    height: 100%;
}
</style>
