<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-12 15:56:38
 * @LastEditors  : Eug yyh3531@163.com
 * @LastEditTime : 2023-07-16 20:26:10
 * @FilePath     : \yst-city-xixian-enterpriseServiceSystem-web\src\views\service\enterprise-library\components\OtherInformation.vue
 * @Description  : 其他信息
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <a-card :bordered="false" size="small" :title="false" class="!mt-4">
        <BasicTitle>其他信息</BasicTitle>
        <div class="mt-4" style="padding-left: 7px;">
            <BasicForm :disabled="isDetails" ref="refOtherInformation" labelWidth="100%" :schemas="schemas" layout="vertical" :showActionButtonGroup="false" />
        </div>
    </a-card>
</template>

<script lang="ts" setup>
import { computed, Ref, ref, unref } from 'vue';
import { BasicTitle } from '/@/components/Basic/index';
import { FormSchema, BasicForm, FormActionType } from '/@/components/Form';
import { TypeEnum } from '/@/views/service/enterprise-library/index.data'

const pageType:Ref<TypeEnum> = ref(TypeEnum.create)

const isCreate = computed(() => {
    return unref(pageType) === TypeEnum.create
})

const isEdit = computed(() => {
    return unref(pageType) === TypeEnum.edit
})

const isDetails = computed(() => {
    return unref(pageType) === TypeEnum.details
})
const schemas: FormSchema[] = [
    {
        field: 'isManageRisk',
        component: 'Select',
        label: '是否有经营风险',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请选择是否有经营风险',
            options: [
                {
                    label: '否',
                    value: '1',
                    key: '1',
                },
                {
                    label: '是',
                    value: '2',
                    key: '2',
                },
            ],
        },
    },
    {
        field: 'isJudicialRisk',
        component: 'Select',
        label: '是否有司法风险',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请选择是否有司法风险',
            options: [
                {
                    label: '否',
                    value: '1',
                    key: '1',
                },
                {
                    label: '是',
                    value: '2',
                    key: '2',
                },
            ],
        },
    },
    {
        field: 'isProject',
        component: 'Select',
        label: '是否有项目',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请选择是否有项目',
            options: [
                {
                    label: '否',
                    value: '1',
                    key: '1',
                },
                {
                    label: '是',
                    value: '2',
                    key: '2',
                },
            ],
        },
    },
    {
        field: 'isCarrier',
        component: 'Select',
        label: '是否为载体',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请选择是否为载体',
            options: [
                {
                    label: '否',
                    value: '1',
                    key: '1',
                },
                {
                    label: '是',
                    value: '2',
                    key: '2',
                },
            ],
        },
    },
];

const refOtherInformation =  ref<Nullable<FormActionType>>(null)

/**
 * 校验方法
 */
 const validate = () => {
    return refOtherInformation.value?.validate()
}

const getFieldsValue = () => {
    return refOtherInformation.value?.getFieldsValue()
}

const setFieldsValue = (arg) => {
    return refOtherInformation.value?.setFieldsValue(arg)
}

// 初始化
const init = (type: TypeEnum, params: any) => {
    pageType.value = type

    let OtherInfo = Object.assign({}, params.infoDetail)

    switch (type) {
        case TypeEnum.create:
            break;
        case TypeEnum.edit:
            setFieldsValue(OtherInfo)
            break;
        case TypeEnum.details:
            setFieldsValue(OtherInfo)
            break;

        default:
            break;
    }

}

defineExpose({
    init,
    validate,
    getFieldsValue,
    setFieldsValue,
})
</script>

<style></style>