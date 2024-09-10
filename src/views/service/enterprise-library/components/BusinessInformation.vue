<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-12 15:56:02
 * @LastEditors  : Eug yyh3531@163.com
 * @LastEditTime : 2023-07-16 20:24:09
 * @FilePath     : \yst-city-xixian-enterpriseServiceSystem-web\src\views\service\enterprise-library\components\BusinessInformation.vue
 * @Description  : 企业经营信息
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <a-card :bordered="false" size="small" :title="false" class="!mt-4">
        <BasicTitle>企业经营信息</BasicTitle>
        <div class="mt-4 mb-4" style="padding-left: 7px;" v-for="(item, idx) in renderData.datas"
            :key="item.id || item.key">
            <!-- <a-date-picker :disabled="isDetails" picker="year" v-model:value="item.year" :disabledDate="useDisabledAte"
                                                :format="dateFormat" :valueFormat="dateFormat" class="!mb-4" placeholder="请选择年份" />
                                            <a-button class="ml-4" type="danger" @click="useDelete(idx)" v-if="!isDetails">删除</a-button> -->
            <BasicForm :disabled="isDetails" labelWidth="100%" :ref="`refBusinessInformation_${idx}`" :schemas="schemas"
                layout="vertical" :showActionButtonGroup="false">
                <template #deleteSlot="{ model, field }">
                    <!-- <a-button preIcon="ant-design:delete-outlined" type="danger" @click="useDelete(idx)"
                        v-if="!isDetails" /> -->
                </template>
                <template #yearSlot="{ model, field }">
                    <div class="font-semibold">
                        {{ model.year }} 年度
                    </div>
                </template>

            </BasicForm>
        </div>

        <!-- <a-button preIcon="ant-design:plus-outlined" type="primary" class="mt-4" @click="useAdd"
            v-if="!isDetails">新增</a-button> -->
    </a-card>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { computed, getCurrentInstance, nextTick, reactive, Ref, ref, unref } from 'vue';
import { BasicTitle } from '/@/components/Basic/index';
import { FormSchema, BasicForm } from '/@/components/Form';
import { buildUUID } from '/@/utils/uuid';
import { TypeEnum, BusinessData } from '/@/views/service/enterprise-library/index.data'

const pageType: Ref<TypeEnum> = ref(TypeEnum.create)

const year = dayjs().format('YYYY')
const NearYear = [Number(year) - 1, Number(year) - 2, Number(year) - 3]

const isCreate = computed(() => {
    return unref(pageType) === TypeEnum.create
})

const isEdit = computed(() => {
    return unref(pageType) === TypeEnum.edit
})

const isDetails = computed(() => {
    return unref(pageType) === TypeEnum.details
})

const renderData = reactive<BusinessData>({
    datas: []
})

// const renderData = reactive({
//     datas: [],
// })
// const useAdd = () => {
//     renderData.datas.push({
//         // date: '',
//         key: buildUUID(),
//         data: {},
//         year: ''
//     })
// }
const instances = getCurrentInstance()

// 获取已填写年度列表
const getYearValues = () => {
    try {
        return renderData.datas.map((_, i) => {
            const formRefsItem: any = instances?.refs[`refBusinessInformation_${i}`]
            const { year } = formRefsItem[0].getFieldsValue()
            return year
        })
    } catch (error) {
        return []
    }
}

// const useDelete = (idx) => {
//     renderData.datas.splice(idx, 1)
// }

/**
 * 已选日期禁用
 */
// const useDisabledAte = (currentDate: any) => {
//     const dateMaps: string[] = renderData.datas.map(v => v.year)
//     return dateMaps.includes(currentDate.format('YYYY'))
// }
/**
 * 校验方法
 */
const validate = () => {
    return getFieldsValue()
}
const getFieldsValue = () => {
    const validateList = renderData.datas.map((_, k: number) => {
        const formRefsItem: any = instances?.refs[`refBusinessInformation_${k}`]
        return formRefsItem[0].validate
    })
    return Promise.all(validateList.map(cb => cb()))
}

const setFieldsValue = (arg: any) => {
    // return refBusinessInformation.value?.setFieldsValue(arg)
}

// 初始化
const init = (type: TypeEnum, params: any) => {
    pageType.value = type

    const initDatas = () => {
        renderData.datas = params?.infoManages?.map((current) => {
            return {
                id: current.id,
                key: buildUUID(),
                year: current.year,
                data: current
            }
        }) || []
        nextTick(() => {
            renderData.datas.forEach((current, idx) => {
                const formRefsItem: any = instances?.refs[`refBusinessInformation_${idx}`]
                formRefsItem[0].setFieldsValue(current.data)

            })
        })
    }

    switch (type) {
        case TypeEnum.create:
            renderData.datas = NearYear.map(item => {
                return {
                    key: buildUUID(),
                    year: item,
                    data: {
                        year: item
                    }
                }
            })

            nextTick(() => {
                renderData.datas.forEach((current, idx) => {
                    const formRefsItem: any = instances?.refs[`refBusinessInformation_${idx}`]
                    formRefsItem[0].setFieldsValue(current.data)

                })
            })
            break;
        case TypeEnum.edit:
            initDatas()
            break;
        case TypeEnum.details:
            initDatas()
            break;

        default:
            break;
    }

}

/**
 * 表单配置
 */
const schemas: FormSchema[] = [
    {
        field: 'year',
        component: 'DatePicker',
        label: '',
        colProps: {
            span: 8,
        },
        slot: 'yearSlot',
        required: true,
        componentProps: {
            format: 'YYYY',
            picker: 'year',
            valueFormat: 'YYYY',
            disabled: true,
            disabledDate(currentDate: any) {
                const disabledYear = getYearValues().map(v => v)
                return disabledYear.includes(currentDate.format('YYYY'))
            },
            placeholder: '请选择年份',
        },
    },
    {
        field: 'id',
        component: 'DatePicker',
        slot: 'deleteSlot',
        label: '',
        labelWidth: 0,
        colProps: {
            span: 16,
        },
        componentProps: {},
    },
    {
        field: 'businessIncome',
        component: 'InputNumber',
        label: '营业收入',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入营业收入',
            addonAfter: '万元',
            min: 0,
            max: 999999999999.999,
            precision: 3,
            style: {
                width: '100%',
            },
            // onchange: validate
        },
        dynamicRules: ({ model, field, schema, values }) => {
            return [{
                validator: (_, value: number): any => {
                    if (model.mainBusinessIncome > value) {
                        return Promise.reject('主营业务收入不得超过营业收入')
                    } else {
                        return Promise.resolve()
                    }
                },
                trigger: 'blur'
            }]
        },
    },
    {
        field: 'mainBusinessIncome',
        component: 'InputNumber',
        label: '主营业务收入',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入主营业务收入',
            addonAfter: '万元',
            min: 0,
            max: 999999999999.999,
            precision: 3,
            style: {
                width: '100%',
            },
            // onchange: validate
        },
        dynamicRules: ({ model, field, schema, values }) => {
            return [{
                validator: (_, value: number): any => {
                    if (model.businessIncome < value) {
                        return Promise.reject('主营业务收入不得超过营业收入')
                    } else {
                        return Promise.resolve()
                    }
                },
                trigger: 'blur'
            }]
        },
    },
    {
        field: 'ssqk',
        label: '上市情况',
        colProps: {
            span: 8,
        },
        defaultValue: void 0,
        component: 'Select',
        componentProps: {
            placeholder: '请选择上市情况',
            options: [
                {
                    label: '未上市',
                    value: '1',
                    key: '1',
                },
                {
                    label: '上市',
                    value: '2',
                    key: '2',
                },
            ],
        },
    },
    {
        field: 'financing',
        component: 'InputNumber',
        label: '企业融资金额',
        colProps: {
            span: 8,
        },
        required: true,
        componentProps: {
            placeholder: '请输入企业融资金额',
            addonAfter: '万元',
            min: 0,
            max: 999999999999.999,
            precision: 3,
            style: {
                width: '100%',
            }
        },
        ifShow(renderCallbackParams) {
            return renderCallbackParams.model.ssqk === '1'
        },
        // dynamicRules: ({ model }) => {
        //     // 未上市 填写融资金额
        //     if (model.ssqk === '1') {
        //         return [{ required: true, message: '请输入企业融资金额!' }];
        //     } else {
        //         return [];
        //     }
        // },
    },
    {
        field: 'developInvest',
        component: 'InputNumber',
        label: '企业研发投入',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入企业研发投入',
            addonAfter: '万元',
            min: 0,
            max: 999999999999.999,
            precision: 3,
            style: {
                width: '100%',
            }
        },
    },
    {
        field: 'profitRate',
        component: 'InputNumber',
        label: '利润率',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入利润率',
            addonAfter: '%',
            min: 0,
            max: 99999.999,
            precision: 3,
            style: {
                width: '100%',
            }
        },
    },
]

defineExpose({
    init,
    validate,
    getFieldsValue,
    setFieldsValue,
})

</script>

<style></style>