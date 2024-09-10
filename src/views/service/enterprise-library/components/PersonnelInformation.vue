<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-12 15:55:32
 * @LastEditors  : Eug yyh3531@163.com
 * @LastEditTime : 2023-07-16 20:26:26
 * @FilePath     : \yst-city-xixian-enterpriseServiceSystem-web\src\views\service\enterprise-library\components\PersonnelInformation.vue
 * @Description  : 企业人事信息
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <a-card :bordered="false" size="small" :title="false" class="!mt-4">
        <BasicTitle>企业人事信息</BasicTitle>
        <div class="mt-4" style="padding-left: 7px;">
            <BasicForm :disabled="isDetails" ref="refPersonnelInformation" labelWidth="100%" :schemas="schemas"
                layout="vertical" :showActionButtonGroup="false" />
        </div>
    </a-card>
</template>

<script lang="ts" setup>
import { computed, Ref, ref, unref } from 'vue';
import { BasicTitle } from '/@/components/Basic/index';
import { FormSchema, BasicForm, FormActionType, Rule } from '/@/components/Form';
import { TypeEnum, PersonnelSummationFileds } from '/@/views/service/enterprise-library/index.data'

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
const refPersonnelInformation = ref<Nullable<FormActionType>>(null)

const validateCount = async (_rule: Rule, value: string, names: string, singe?: Boolean) => {
    const row: any = refPersonnelInformation.value?.getFieldsValue()

    // 没有填写总人数
    if (value && !row.employeeNum) {
        return Promise.reject(`${names}不可超过企业总人数`)
    }

    // 只与总人数校验
    if (singe) {
        if (value > row.employeeNum) {
            return Promise.reject(`${names}不可超过企业总人数`)
        }
        
        // 只与总人数相比较 此时即可退出
        return Promise.resolve();
    }

    // 校验合计字段
    
    let summation = PersonnelSummationFileds.reduce((s, k) => s += row[k] ? +row[k] : 0, 0)
    if (summation > row.employeeNum) {
        return Promise.reject(`您当前输入人数总和大于企业总人数`)
    }

    return Promise.resolve();
}
/**
 * 校验方法
 */
const validate = () => {
    return refPersonnelInformation.value?.validate()
}

const getFieldsValue = () => {
    return refPersonnelInformation.value?.getFieldsValue()
}

const setFieldsValue = (arg) => {
    return refPersonnelInformation.value?.setFieldsValue(arg)
}
// 初始化
const init = (type: TypeEnum, params: any) => {
    pageType.value = type

    let PersonnelInfo = Object.assign({}, params.infoDetail)


    switch (type) {
        case TypeEnum.create:
            break;
        case TypeEnum.edit:
            setFieldsValue(PersonnelInfo)
            break;
        case TypeEnum.details:
            setFieldsValue(PersonnelInfo)
            break;

        default:
            break;
    }

}

const schemas: FormSchema[] = [
    {
        field: 'employeeNum',
        component: 'InputNumber',
        label: '企业总人数',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入企业总人数',
            addonAfter: '人',
            min: 0,
            max: 99999,
            precision: 0,
            style: {
                width: '100%',
            },
            onchange: validate
        },

    },
    // {
    //     field: 'leaderNum',
    //     component: 'InputNumber',
    //     label: '高管人数',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: '',
    //     componentProps: {
    //         placeholder: '请输入高管人数',
    //         addonAfter: '人',
    //         min: 0,
    //         max: 99999,
    //         precision: 0,
    //         style: {
    //             width: '100%',
    //         }
    //     },
    //     rules: [
    //         { validator: (_rule: Rule, value: string) => validateCount(_rule, value, '高管人数'), trigger: 'change' }
    //     ]
    // },
    {
        field: 'associateNum',
        component: 'InputNumber',
        label: '大专及以上人数',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入大专及以上人数',
            addonAfter: '人',
            min: 0,
            max: 99999,
            precision: 0,
            style: {
                width: '100%',
            },
            onchange: validate
        },
        rules: [
            { validator: (_rule: Rule, value: string) => validateCount(_rule, value, '大专及以上人数'), trigger: 'change' }
        ]
    },
    {
        field: 'bachelorNum',
        component: 'InputNumber',
        label: '本科及以上人数',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入本科及以上人数',
            addonAfter: '人',
            min: 0,
            max: 99999,
            precision: 0,
            style: {
                width: '100%',
            },
            onchange: validate
        },
        rules: [
            { validator: (_rule: Rule, value: string) => validateCount(_rule, value, '本科及以上人数'), trigger: 'change' }
        ]
    },
    {
        field: 'masterNum',
        component: 'InputNumber',
        label: '硕士及以上人数',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入硕士及以上人数',
            addonAfter: '人',
            min: 0,
            max: 99999,
            precision: 0,
            style: {
                width: '100%',
            },
            onchange: validate
        },
        rules: [
            { validator: (_rule: Rule, value: string) => validateCount(_rule, value, '硕士及以上人数'), trigger: 'change' }
        ]
    },
    {
        field: 'doctorNum',
        component: 'InputNumber',
        label: '博士人数',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入博士人数',
            addonAfter: '人',
            min: 0,
            max: 99999,
            precision: 0,
            style: {
                width: '100%',
            },
            onchange: validate
        },
        rules: [
            { validator: (_rule: Rule, value: string) => validateCount(_rule, value, '博士人数'), trigger: 'change' }
        ]
    },

    // TODO
    {
        field: 'higherNum',
        component: 'InputNumber',
        label: '高级职称人数',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入高级职称人数',
            addonAfter: '人',
            min: 0,
            max: 99999,
            precision: 0,
            style: {
                width: '100%',
            },
            onchange: validate
        },
        rules: [
            { validator: (_rule: Rule, value: string) => validateCount(_rule, value, '高级职称人数',true), trigger: 'change' }
        ]
    },
    {
        field: 'secondaryNum',
        component: 'InputNumber',
        label: '中级职称人数',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入中级职称人数',
            addonAfter: '人',
            min: 0,
            max: 99999,
            precision: 0,
            style: {
                width: '100%',
            },
            onchange: validate
        },
        rules: [
            { validator: (_rule: Rule, value: string) => validateCount(_rule, value, '中级职称人数', true), trigger: 'change' }
        ]
    },
    {
        field: 'scientificNum',
        component: 'InputNumber',
        label: '科研人数数量',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入科研人数数量',
            addonAfter: '人',
            min: 0,
            max: 99999,
            precision: 0,
            style: {
                width: '100%',
            },
            onchange: validate
        },
        rules: [
            { validator: (_rule: Rule, value: string) => validateCount(_rule, value, '科研人数数量', true), trigger: 'change' }
        ]
    },
    {
        field: 'developNum',
        component: 'InputNumber',
        label: '研发人数数量',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入研发人数数量',
            addonAfter: '人',
            min: 0,
            max: 99999,
            precision: 0,
            style: {
                width: '100%',
            },
            onchange: validate
        },
        rules: [
            { validator: (_rule: Rule, value: string) => validateCount(_rule, value, '研发人数数量', true), trigger: 'change' }
        ]
    },
    {
        field: 'technicianNum',
        component: 'InputNumber',
        label: '技术人员',
        colProps: {
            span: 8,
        },
        componentProps: {
            placeholder: '请输入技术人员',
            addonAfter: '人',
            min: 0,
            max: 99999,
            precision: 0,
            style: {
                width: '100%',
            },
            onchange: validate
        },
        rules: [
            { validator: (_rule: Rule, value: string) => validateCount(_rule, value, '技术人员数量', true), trigger: 'change' }
        ]
    },
];

defineExpose({
    init,
    validate,
    getFieldsValue,
    setFieldsValue,
})
</script>

<style></style>