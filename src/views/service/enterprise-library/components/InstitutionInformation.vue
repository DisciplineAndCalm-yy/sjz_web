<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-23 17:15:40
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-17 13:56:30
 * @FilePath     : /yst-city-xixian-enterpriseServiceSystem-web/src/views/service/enterprise-library/components/InstitutionInformation.vue
 * @Description  : 机构设置
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <a-card :bordered="false" size="small" :title="false" class="!mt-4">
        <BasicTitle>机构设置</BasicTitle>
        <a-row :gutter="[16, 16]" class="my-4">
            <a-col class="gutter-row" :span="4" v-for="dict in dictList" :key="dict.value">
                <a-button class="w-full !whitespace-pre-line text-center !min-h-16"
                    :type="institution.has(dict.value) ? 'primary' : ''" @click.stop="useSetActive(dict.value)">{{
                        dict.label }}</a-button>
            </a-col>
            <a-col class="gutter-row" :span="24"
                v-if="
                    institution.has(InstitutionType.couveuse) ||
                    institution.has(InstitutionType.space) || 
                    institution.has(InstitutionType.public) ||
                    institution.has(InstitutionType.innovate)
                 ">
                <div>待补充内容:</div>
            </a-col>
            <!-- 科技企业孵化器 -->
            <template v-if="institution.has(InstitutionType.couveuse)">
                <a-col class="gutter-row" :span="4">
                    <a-button class="w-full">{{useGetTypeName(InstitutionType.couveuse)}}</a-button>
                </a-col>
                <a-col class="gutter-row" :span="24">
                    <BasicForm :disabled="isDetails" labelWidth="100%" ref="refCouveuse" :schemas="couveuseSchemas"
                        layout="vertical" :showActionButtonGroup="false" />
                </a-col>
            </template>
            <!-- 众创空间 -->
            <template v-if="institution.has(InstitutionType.space)">
                <a-col class="gutter-row" :span="4">
                    <a-button class="w-full">{{useGetTypeName(InstitutionType.space)}}</a-button>
                </a-col>
                <a-col class="gutter-row" :span="24">
                    <BasicForm :disabled="isDetails" labelWidth="100%" ref="refSpace" :schemas="spaceSchemas"
                        layout="vertical" :showActionButtonGroup="false" />
                </a-col>
            </template>
            <!-- 公共服务示范平台 -->
            <template v-if="institution.has(InstitutionType.public)">
                <a-col class="gutter-row" :span="4">
                    <a-button class="w-full">{{useGetTypeName(InstitutionType.public)}}</a-button>
                </a-col>
                <a-col class="gutter-row" :span="24">
                    <BasicForm :disabled="isDetails" labelWidth="100%" ref="refPublic" :schemas="publicSchemas"
                        layout="vertical" :showActionButtonGroup="false" />
                </a-col>
            </template>
             <!-- 创新创业示范平台 -->
             <template v-if="institution.has(InstitutionType.innovate)">
                <a-col class="gutter-row" :span="4">
                    <a-button class="w-full">{{useGetTypeName(InstitutionType.innovate)}}</a-button>
                </a-col>
                <a-col class="gutter-row" :span="24">
                    <BasicForm :disabled="isDetails" labelWidth="100%" ref="refInnovate" :schemas="innovateSchemas"
                        layout="vertical" :showActionButtonGroup="false" />
                </a-col>
            </template>
        </a-row>

    </a-card>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, nextTick, Ref, ref, unref } from "vue"
import { TypeEnum, InstitutionType } from "../index.data";
import { BasicTitle } from '/@/components/Basic/index';
import { FormSchema, BasicForm, FormActionType } from "/@/components/Form";

const refCouveuse = ref<Nullable<FormActionType>>(null);
const refSpace = ref<Nullable<FormActionType>>(null);
const refPublic = ref<Nullable<FormActionType>>(null);
const refInnovate = ref<Nullable<FormActionType>>(null);
    


const props = defineProps({
    dictList: {
        type: Array<any>,
        default: [],
    }
})

const institution = ref<Set<string>>(new Set())

const useGetTypeName = (type) => {
    try {
        const current = props.dictList.find(({value}) => value == type)
        return current?.label
    } catch (e) {
        return ''
    }
}

const pageType: Ref<TypeEnum> = ref(TypeEnum.create)
const isCreate = computed(() => {
    return unref(pageType) === TypeEnum.create
})

const isEdit = computed(() => {
    return unref(pageType) === TypeEnum.edit
})

const isDetails = computed(() => {
    return unref(pageType) === TypeEnum.details
})

const useSetActive = (key: string) => {
    if (isDetails.value) return false
    unref(institution).has(key) ? institution.value.delete(key) : institution.value.add(key)
}
// 初始化
const init = (type: TypeEnum, params: any) => {
    pageType.value = type

    const initVals = () => {
        const { orgSetting } = params?.entInfo
        if (!orgSetting) return

        /**
         * 数据回显处理
         * @param refs 表单ref
         * @param val 回显数据
         */
        const refreshValues = (refs, val) => {
            nextTick(() => {
                unref(refs)?.setFieldsValue(val)
            })
        }

        JSON.parse(orgSetting).forEach(current => {
            institution.value.add(current?.value)
            switch (current.value) {
                case InstitutionType.couveuse:
                    return refreshValues(refCouveuse, current)
                case InstitutionType.space:
                    return refreshValues(refSpace, current)
                case InstitutionType.public:
                    return refreshValues(refPublic, current)
                case InstitutionType.innovate:
                    return refreshValues(refInnovate, current)
                default:
            }
        })
    }

    switch (type) {
        case TypeEnum.create:
            break;
        case TypeEnum.edit:
            initVals()
            break;
        case TypeEnum.details:
            initVals()
            break;
        default:
            break;
    }
}

/**
 * 表单校验 & 合并返回信息
 */
const validate = async () => {
    try {
        let [couveuse = {}, space = {}, Public = {}, Innovate={}] = await Promise.all([
            unref(refCouveuse)?.validate(),
            unref(refSpace)?.validate(),
            unref(refPublic)?.validate(),
            unref(refInnovate)?.validate()
        ])
        // 处理返回数据格式
        const orgSetting = Array.from(unref(institution)).map(value => {
            switch (value) {
                case InstitutionType.couveuse:
                    return Object.assign(couveuse, { value })
                case InstitutionType.space:
                    return Object.assign(space, { value })
                case InstitutionType.public:
                    return Object.assign(Public, { value })
                case InstitutionType.innovate:
                    return Object.assign(Innovate, { value })
                default:
                    return { value }
            }
        })

        return Promise.resolve({
            orgSetting: JSON.stringify(orgSetting)
        })
    } catch (err) {
        return Promise.reject(err)
    }
}

const getFieldsValue = () => {
    // return refOtherInformation.value?.getFieldsValue()
}

const setFieldsValue = () => {
    // return refOtherInformation.value?.setFieldsValue(arg)
}

// 科技企业孵化器 表单配置项
const couveuseSchemas: FormSchema[] = [
    {
        field: 'area',
        component: 'InputNumber',
        label: '场地面积',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入场地面积',
            addonAfter: '平米',
            max: 999999999999,
            min: 0,
            precision: 0,
            style: {
                width: '100%',
            }
        },
    },
    {
        field: 'finance',
        component: 'InputNumber',
        label: '资金规模',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入资金规模',
            addonAfter: '万元',
            max: 999999999999.999,
            min: 0,
            precision: 3,
            style: {
                width: '100%',
            }
        },
    },
    {
        field: 'entNum',
        component: 'InputNumber',
        label: '在孵企业',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入在孵企业',
            addonAfter: '家',
            max: 999999999999,
            min: 0,
            precision: 0,
            style: {
                width: '100%',
            }
        },
    },
    {
        field: 'graduateEntNum',
        component: 'InputNumber',
        label: '累计毕业企业',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入累计毕业企业',
            addonAfter: '家',
            max: 999999999999,
            min: 0,
            precision: 0,
            style: {
                width: '100%',
            }
        },
    }
]
// 众创空间 表单配置项
const spaceSchemas: FormSchema[] = [
    {
        field: 'area',
        component: 'InputNumber',
        label: '场地面积',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入场地面积',
            addonAfter: '平米',
            max: 999999999999,
            min: 0,
            precision: 0,
            style: {
                width: '100%',
            }
        },
    },
    {
        field: 'finance',
        component: 'InputNumber',
        label: '资金规模',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入资金规模',
            addonAfter: '万元',
            max: 999999999999.999,
            min: 0,
            precision: 3,
            style: {
                width: '100%',
            }
        },
    },
    {
        field: 'servicerNum',
        component: 'InputNumber',
        label: '专业服务人员',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入专业服务人员',
            addonAfter: '家',
            max: 999999999999,
            min: 0,
            precision: 0,
            style: {
                width: '100%',
            }
        },
    },
]
// 公共服务示范平台 表单配置项
const publicSchemas: FormSchema[] = [
    {
        field: 'area',
        component: 'InputNumber',
        label: '场地面积',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入场地面积',
            addonAfter: '平米',
            max: 999999999999,
            min: 0,
            precision: 0,
            style: {
                width: '100%',
            }
        },
    },
    {
        field: 'finance',
        component: 'InputNumber',
        label: '资金规模',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入资金规模',
            addonAfter: '万元',
            max: 999999999999.999,
            min: 0,
            precision: 3,
            style: {
                width: '100%',
            }
        },
    },
    {
        field: 'entNum',
        component: 'InputNumber',
        label: '在孵企业',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入在孵企业',
            addonAfter: '家',
            max: 999999999999,
            min: 0,
            precision: 0,
            style: {
                width: '100%',
            }
        },
    },
    {
        field: 'graduateEntNum',
        component: 'InputNumber',
        label: '累计毕业企业',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入累计毕业企业',
            addonAfter: '家',
            max: 999999999999,
            min: 0,
            precision: 0,
            style: {
                width: '100%',
            }
        },
    }
]

// 创新创业示范平台 表单配置项

const innovateSchemas: FormSchema[] = [
    {
        field: 'area',
        component: 'InputNumber',
        label: '场地面积',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入场地面积',
            addonAfter: '平米',
            max: 999999999999,
            min: 0,
            precision: 0,
            style: {
                width: '100%',
            }
        },
    },
    {
        field: 'entNum',
        component: 'InputNumber',
        label: '在孵企业',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入在孵企业',
            addonAfter: '家',
            max: 999999999999,
            min: 0,
            precision: 0,
            style: {
                width: '100%',
            }
        },
    },
    {
        field: 'incubateRate',
        component: 'InputNumber',
        label: '孵化成功率',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入孵化成功率',
            addonAfter: '%',
            max: 100,
            min: 0,
            precision: 2,
            style: {
                width: '100%',
            }
        },
    }
]
defineExpose({
    init,
    validate,
    getFieldsValue,
    setFieldsValue,
})




</script>

<style></style>