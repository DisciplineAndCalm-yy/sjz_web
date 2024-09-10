<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-12 15:57:12
 * @LastEditors  : Eug yyh3531@163.com
 * @LastEditTime : 2023-07-16 20:25:41
 * @FilePath     : \yst-city-xixian-enterpriseServiceSystem-web\src\views\service\enterprise-library\components\KnowledgeInformation.vue
 * @Description  : 科创情况
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <a-card :bordered="false" size="small" :title="false" class="!mt-4">
        <BasicTitle>科创情况</BasicTitle>
        <div class="mt-4" style="padding-left: 7px;">
            <BasicForm :disabled="isDetails" ref="refKnowledgeInformation" labelWidth="100%" :schemas="schemas"
                layout="vertical" :showActionButtonGroup="false" />
        </div>
    </a-card>
</template>

<script lang="ts" setup>
import { computed, Ref, ref, unref } from 'vue';
import { BasicTitle } from '/@/components/Basic/index';
import { FormSchema, BasicForm, FormActionType, Rule } from '/@/components/Form';
import { TypeEnum, KnowledgeSummationFileds } from '/@/views/service/enterprise-library/index.data'
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


/**
 * 与最大值校验 & 总和计算是否超出
 * @param _rule 规则
 * @param value 当前项
 * @param names 当前项label
 */
const validateCount = async (_rule: Rule, value: string, names: string) => {
    const row: any = refKnowledgeInformation.value?.getFieldsValue()

    if (value > row.propertyNum) {
        return Promise.reject(`${names}不可超过知识产权总数`)
    }

    let summation = KnowledgeSummationFileds.reduce((s, k) => s += row[k] ? +row[k] : 0, 0)

    if (summation > row.propertyNum) {
        return Promise.reject(`当前数量总和超出知识产权总数`)
    }
    return Promise.resolve();
}


const refKnowledgeInformation = ref<Nullable<FormActionType>>(null)

/**
 * 校验方法
 */
const validate = () => {
    return refKnowledgeInformation.value?.validate()
}

const getFieldsValue = () => {
    return refKnowledgeInformation.value?.getFieldsValue()
}

const setFieldsValue = (arg) => {
    return refKnowledgeInformation.value?.setFieldsValue(arg)
}

// 初始化
const init = (type: TypeEnum, params: any) => {
    pageType.value = type

    let KnowledgeInfo = Object.assign({}, params.infoDetail)

    switch (type) {
        case TypeEnum.create:
            break;
        case TypeEnum.edit:
            setFieldsValue(KnowledgeInfo)
            break;
        case TypeEnum.details:
            setFieldsValue(KnowledgeInfo)
            break;

        default:
            break;
    }

}

// 配置
const baseSchemas: FormSchema[] = [
    {
        field: 'propertyNum',
        component: 'InputNumber',
        label: '知识产权总数',
        componentProps: {
            addonAfter: '件',
        },
    },
    {
        field: 'propertyFirstNum',
        component: 'InputNumber',
        label: '一类知识产权总数',
        componentProps: {
            addonAfter: '件',
        },
    },
    {
        field: 'propertySecondNum',
        component: 'InputNumber',
        label: '二类知识产权总数',
        componentProps: {
            addonAfter: '件',
        },
    },
    {
        field: 'patentNum',
        component: 'InputNumber',
        label: '专利总数',
        componentProps: {
            addonAfter: '件',
        },
    },
    {
        field: 'softwareNum',
        component: 'InputNumber',
        label: '软件著作总数',
        componentProps: {
            addonAfter: '个',
        },
    },
    {
        field: 'trademarkNum',
        component: 'InputNumber',
        label: '注册商标总数',
        componentProps: {
            addonAfter: '个',
        },
    },
    {
        field: 'pctNum',
        component: 'InputNumber',
        label: '国际专利(PCT)数',
        componentProps: {
            addonAfter: '件',
        },
    },
]
const schemas: FormSchema[] = baseSchemas.map((current) => {
    current['colProps'] = { span: 8 }
    // 合计去除校验规则
    if (current.field !== 'propertyNum') {
        current['rules'] = [
            { validator: (_rule: Rule, value: string) => validateCount(_rule, value, current.label as string), trigger: 'change' }
        ]
    }
    current.componentProps = Object.assign(current.componentProps as Object, {
        placeholder: `请输入${current.label}`,
        min: 0,
        max: 999,
        precision: 0,
        style: { width: '100%' },
        onchange: validate
    })
    return current
});

defineExpose({
    init,
    validate,
    getFieldsValue,
    setFieldsValue,
})
</script>

<style></style>