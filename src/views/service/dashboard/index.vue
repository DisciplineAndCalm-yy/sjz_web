<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-21 10:20:33
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-14 20:20:20
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/dashboard/index.vue
 * @Description  : 仪表盘
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <div class="service-dashboard-container p-4">
        <a-row align="middle" :gutter="[16, 16]">
            <a-col :span="24">
                <a-card :bordered="false" size="small" :title="false">
                    <BasicTitle class="service-dashboard-container_prefix">企业服务统计 (截止当日)</BasicTitle>

                    <a-row align="middle" :gutter="[16, 16]" class="!my-6">
                        <a-col :span="4" v-for="(service, idx) in serviceData" :key="service.name">
                            <div
                                class="service-dashboard-container_statistics rounded-1xl  w-3/4 h-14rem mx-auto text-center !p-3 text-light-50">
                                <img class="mx-auto my-4" :src="`/@/assets/images/service/${ImgList[idx]}.png`" alt="">
                                <div class="!pb-5 text-4xl font-extrabold text-shadow-xl">{{ service.value }}</div>
                                <div class="mx-auto w-3/5 text-shadow-md">{{ service.name }}</div>
                            </div>
                        </a-col>
                    </a-row>
                </a-card>
            </a-col>

            <a-col :span="12">
                <a-card :bordered="false" size="small" :title="false">
                    <BasicTitle class="service-dashboard-container_prefix">企业类型统计</BasicTitle>
                    <Bar :chartData="chartData.PropertiesData" :option="chartData.PropertiesOptions" style="height:40vh;" />
                </a-card>
            </a-col>
            <a-col :span="12">
                <a-card :bordered="false" size="small" :title="false" class="">
                    <BasicTitle class="service-dashboard-container_prefix">企业行业分布</BasicTitle>
                    <Pie :chartData="chartData.TradeData" :option="chartData.TradeOptions" style="height:40vh;" />
                </a-card>
            </a-col>
            <a-col :span="12">
                <a-card :bordered="false" size="small" :title="false">
                    <div class="flex items-center ">
                        <BasicTitle class="service-dashboard-container_prefix">企业服务管家走访次数统计</BasicTitle>
                        <div class="text-right flex-1 pr-2">
                            <ApiSelect placeholder="全部" allowClear @change="useLineChange"
                                class="min-w-10rem text-left" :api="enterpriseEntMangerMangerList"
                                @optionsChange="useOptionsChange" showSearch v-model:value="chartData.MangerRecordSearch"
                                optionFilterProp="label" resultField="records" labelField="realname" valueField="userId" />
                        </div>
                    </div>
                    <Line :chartData="chartData.MangerRecordData" :option="chartData.MangerRecordOptions" height="40vh" />
                </a-card>
            </a-col>
            <a-col :span="12">
                <a-card :bordered="false" size="small" :title="false" class="">
                    <div class="flex items-center ">
                        <BasicTitle class="service-dashboard-container_prefix">企业服务管家诉求处理分析</BasicTitle>
                        <div class="text-right flex-1 pr-2">
                            <ApiSelect placeholder="全部" allowClear @optionsChange="useOptionsChange"
                                @change="useLineChange" class="min-w-10rem text-left" :api="enterpriseEntMangerMangerList"
                                showSearch v-model:value="chartData.AppealAnalysisSearch" optionFilterProp="label"
                                resultField="records" labelField="realname" valueField="userId" />
                        </div>
                    </div>
                    <Line :chartData="chartData.AppealAnalysisData" :option="chartData.AppealAnalysisOptions"
                        height="40vh" />
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts" name="service-dashboard">
import { reactive, watch, ref } from 'vue';
import { BasicTitle } from '/@/components/Basic/index';
import Bar from '/@/components/chart/Bar.vue';
import Pie from '/@/components/chart/Pie.vue';
import Line from '/@/components/chart/Line.vue';

import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue'
import { enterpriseEntMangerMangerList } from '../butler-maintenance/index.api';

import {
    enterpriseDashboardEntMangerRecord,
    enterpriseDashboardEntProperties,
    enterpriseDashboardEntService,
    enterpriseDashboardEntTrade,
    qixianMangerAppealAnalysis
} from "./index.api";
import { graphic } from 'echarts';
import dayjs from 'dayjs';
const ImgList: string[] = [
    'dashboard_service_sum',
    'dashboard_service_county',
    'dashboard_service_village',
    'dashboard_service_sum',
    'dashboard_service_live',
    'dashboard_service_door'
]

const searchOptions = reactive({
    search: '',
})
type ServiceItem = {
    name: string,
    value: string
}
// 企业服务统计
const serviceData = ref<ServiceItem[]>([])

// 图表数据
const chartData = reactive({
    // 性质统计
    PropertiesData: [],
    PropertiesOptions: {
        color: ['#438ef7'],
        xAxis: {
            axisLabel: {
                interval: 0,
                overflow: 'truncate',
                // rotate: -45,
                rotate: 0,
                fontSize: 8,
                width: 60
                // ellipsis: ''
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '单位: 个',
                minInterval: 1
            },
        ],
        series: [
            {
                name: '数据',
                type: 'bar',
                data: [],
                itemStyle: {
                    color: '#438ef7'
                },
            },
        ],
    },
    // 行业分布
    TradeData: [],
    TradeOptions: {
        color: ['#438ef7'],
        tooltip: {
            formatter: (val) => {
                return `
                    ${val.name}
                    </br>
                        数值: 
                        <span style="color:${val.color}">${val.value} 个</span>
                    </br>
                        占比: 
                        <span style="color:${val.color}">${val.percent}%</span>
                `
            },
            borderWidth: 0,
            backgroundColor: 'rgba(255,255,255,0.6)'
        },
        legend: {
            type: 'scroll',
            right: '1%',
            orient: 'vertical',
            width: '50',
            top: 'center',
            textStyle: {
                fontSize: 8
            },
            pageIconSize: 8
        },
        series: [
            {
                type: 'pie',
                radius: ['50%', '72%'],
                center: ['34%', '50%'],
                data: [],
                labelLine: { show: true },
                label: {
                    // show: true,
                    formatter: function (val) {
                        return `${val.value} 个 \n ${val.name}`
                    },
                    fontSize: 8
                    // color: '#B1B9D3',
                },
                itemStyle: {
                    // borderRadius: 10,
                    // borderColor: '#fff',
                    // borderWidth: 2
                },
            },
        ],
    },
    // 走访次数
    MangerRecordSearch: undefined,
    MangerRecordData: [],
    MangerRecordOptions: {
        color: ['#438ef7'],
        tooltip: {
            trigger: 'axis',
            // axisPointer: {
            //     type: 'shadow',
            //     label: {
            //         show: true,
            //         // backgroundColor: '#333',
            //     },
            // },
            formatter: '<div class="text-center font-light">{b}</div> <div class="font-light px-3" style="color:#438ef7;">{c}</div>',
            borderWidth: 0,
            backgroundColor: 'rgba(255,255,255,0.6)'
        },
        xAxis: {
            boundaryGap: false,
            type: 'category',
            data: [],
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            }
        },
        yAxis: {
            type: 'value',
            name: '单位: 次',
            minInterval: 1
        },
        series: [
            {
                type: 'line',
                showSymbol: true,
                smooth: true,
                areaStyle: {
                    color: new graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: '#438ef7'
                        }, {
                            offset: 1,
                            color: 'rgba(67, 142, 247,.05)'
                        }
                    ])
                },
                data: [],
            },
        ],
    },

    // 企业服务管家诉求处理分析
    AppealAnalysisSearch: undefined,
    AppealAnalysisData: [],
    AppealAnalysisOptions: {
        color: ['#000'],
        tooltip: {
            trigger: 'axis',
            // axisPointer: {
            //     type: 'shadow',
            //     label: {
            //         show: true,
            //         backgroundColor: '#333',
            //     },
            // },
            formatter: '<div class="text-center font-light">{b}</div> <div class="font-light px-3" style="color:#f4ba4b;">{c}</div>',
            borderWidth: 0,
            backgroundColor: 'rgba(255,255,255,0.6)'
        },
        xAxis: {
            boundaryGap: false,
            type: 'category',
            data: [],
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            }
        },
        yAxis: {
            type: 'value',
            name: '单位: 个',
            minInterval: 1
        },
        series: [
            {
                type: 'line',
                showSymbol: true,
                smooth: true,
                areaStyle: {
                    color: new graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: '#f4ba4b'
                        }, {
                            offset: 1,
                            color: 'rgba(244, 186, 75,.05)'
                        }
                    ])
                },
                itemStyle: {
                    color: '#f4ba4b'
                },
                data: [],
            },
        ],
    },
})

// select事件调取接口
const useLineChange = () => {
}

/**
 * api select 接口回调
 * @param options 
 */
const useOptionsChange = (options: any[]) => {
    if (options.length) {
        // chartData.MangerRecordSearch = options[0].value
    }
}

// 走访次数
const getMangerRecord = () => {
    enterpriseDashboardEntMangerRecord({
        userId: chartData.MangerRecordSearch
    }).then(data => {
        chartData.MangerRecordData = data
    }).catch(_ => {
        chartData.MangerRecordData = []
    })
}

// 行业分布
const getTrade = () => {
    enterpriseDashboardEntTrade().then(data => {
        chartData.TradeData = data
    }).catch(_ => {
        chartData.TradeData = []
    })
}

// 性质统计
const getProperties = () => {
    enterpriseDashboardEntProperties().then(data => {
        // chartData.PropertiesData = data
        chartData.PropertiesData = data.filter(v => v.value !== '0')
        // 超过6条 斜着
        if (chartData.PropertiesData.length <= 6) {
            chartData.PropertiesOptions.xAxis.axisLabel.rotate = 0
        } else {
            chartData.PropertiesOptions.xAxis.axisLabel.rotate = -45

        }
        // chartData.PropertiesData = data
    }).catch(_ => {
        chartData.PropertiesData = []
    })
}

// 服务统计
const getService = () => {
    enterpriseDashboardEntService().then(data => {
        serviceData.value = data
    }).catch(_ => {
        serviceData.value = []
    })
}
// 服务统计
const getAppealAnalysis = () => {
    qixianMangerAppealAnalysis({
        year: dayjs().format('YYYY'),
        mangerId: chartData.AppealAnalysisSearch
    }).then(data => {
        chartData.AppealAnalysisData = data
        // chartData.AppealAnalysisData = data.map(({ date, count }) => {
        //     return { name: date, value: count }
        // })
    }).catch(_ => {
        chartData.AppealAnalysisData = []
    })
}

watch(() => chartData.MangerRecordSearch, getMangerRecord)
watch(() => chartData.AppealAnalysisSearch, getAppealAnalysis)

getTrade()
getProperties()
getService()
getMangerRecord()
getAppealAnalysis()

</script>

<style lang="less">
.service-dashboard-container {
    &_prefix {
        margin-left: 1rem;

        &::before {
            content: '';
            width: 1rem;
            height: 1rem;
            position: absolute;
            top: 60%;
            transform: translate(-150%, -50%);
            background-image: url(/@/assets/images/service/dashboard_service_prefix.png);
        }
    }

    &_statistics {
        background-image: url(/@/assets/images/service/dashboard_service_bg.png);
        background-size: cover
    }
}
</style>