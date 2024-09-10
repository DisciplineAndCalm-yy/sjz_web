<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-12 15:54:55
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-20 13:56:51
 * @FilePath     : /yst-city-xixian-enterpriseServiceSystem-web/src/views/service/enterprise-library/components/EssentialInformation.vue
 * @Description  : 企业基本信息
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <a-card :bordered="false" size="small">
        <template #title>
            <Icon icon="ant-design:left-outlined" class="cursor-pointer" @click="useBack"></Icon>
        </template>

        <template #extra>
            <template v-if="route.path !== '/service/application-list/details' && status !== '2'">
                <a-button type="primary" @click="useSubmit" v-if="isCreate || isEdit" :loading="submitLoading">保存</a-button>
                <a-button type="primary" @click="useToEdit" v-if="isDetails">点击编辑</a-button>
            </template>
        </template>
        <BasicTitle>企业基本信息</BasicTitle>

        <div class="my-4" style="padding-left: 7px;">
            <BasicForm :disabled="isDetails" ref="refEssentialInformationForm" labelWidth="100%" :schemas="schemas"
                layout="vertical" :showActionButtonGroup="false" />
        </div>
    </a-card>
</template>

<script lang="ts" setup>
import { Icon } from '/@/components/Icon';
import { useGo } from '/@/hooks/web/usePage';
import { BasicTitle } from '/@/components/Basic/index';
import { FormSchema, BasicForm, FormActionType } from '/@/components/Form';
import { computed, ref, unref, Ref } from 'vue';
import { TypeEnum } from '/@/views/service/enterprise-library/index.data'
import { useRoute } from 'vue-router';
import { enterpriseEntInfoValidDuplicate } from '/@/views/service/enterprise-library/index.api';
import dayjs, { Dayjs } from 'dayjs';
// import { initDictOptions } from '/@/utils/dict';


const go = useGo()
const route = useRoute()
const submitLoading = ref(false)
const useLoading = (status) => {
    submitLoading.value = status
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

const useBack = () => {
    // 清单过来
    if (route.path == '/service/application-list/details') {
        go('/service/application-list')
    } else {
        if (isCreate.value || isDetails.value) {
            go('/service/enterprise-library')
        } else {
            go(`/service/enterprise-library/details?id=${route.query.id}`)
        }
    }
}
const useToEdit = () => {
    go(`/service/enterprise-library/edit?id=${route.query.id}`)
}

// const cacheCreditCode = ref('')


const refEssentialInformationForm = ref<Nullable<FormActionType>>(null)
const emit = defineEmits(['submit'])
const useSubmit = () => {
    emit('submit')
}
/**
 * 校验方法
 */
const validate = () => {
    return refEssentialInformationForm.value?.validate()
}
const getFieldsValue = () => {
    return refEssentialInformationForm.value?.getFieldsValue()
}

const setFieldsValue = (arg) => {
    return refEssentialInformationForm.value?.setFieldsValue(arg)
}
const schemas: FormSchema[] = [
    {
        field: 'entName',
        component: 'Input',
        label: '企业名称',
        colProps: {
            span: 8,
        },
        required: true,
        componentProps: {
            maxlength: 40,
            placeholder: '请输入企业名称',
        },
    },
    {
        field: 'creditCode',
        component: 'Input',
        label: '统一社会信用代码',
        colProps: {
            span: 8,
        },
        required: true,
        componentProps: {
            placeholder: '请输入统一社会信用代码',
        },
        dynamicRules: () => {
            return [
                {
                    required: true,
                    trigger: 'blur',
                    validator: (_, value) => {
                        return new Promise((resolve, reject) => {
                            // 详情 或 编辑信用代码没变
                            if (pageType.value === TypeEnum.details) {
                                return resolve()
                            }
                            if (!value) {
                                return reject('统一社会信用代码为必填项');
                            }
                            if (value.length !== 18) {
                                return reject('统一社会信用代码格式错误');
                            }
                            let params = {
                                id: isEdit.value ? route.query.id : undefined,
                                creditCode: value,
                            };
                            enterpriseEntInfoValidDuplicate(params)
                                .then((res) => {
                                    res ? reject('统一社会信用代码已存在!') : resolve();
                                })
                                .catch((err) => {
                                    reject(err.message || '校验失败');
                                });
                        });
                    },
                },
            ];
        }
    },
    {
        field: 'reg',
        component: 'JAreaSelect',
        label: '注册地址',
        colProps: {
            span: 8,
        },
        // required: true,
        componentProps: {
            placeholder: '请选择',
        },
    },
    {
        field: 'estDate',
        component: 'DatePicker',
        label: '注册时间',
        colProps: {
            span: 8,
        },
        // required: true,
        componentProps: {
            placeholder: '请选择注册时间',
            valueFormat: 'YYYY-MM-DD',
            disabledDate(current: Dayjs) {
                return current && current > dayjs().endOf('day');
            },
            format: 'YYYY-MM-DD',
            style: {
                width: '100%',
            }
        },
    },
    // {
    //     field: 'address',
    //     component: 'Input',
    //     label: '详细地址',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: '',
    //     componentProps: {
    //         placeholder: '请输入详细地址',
    //     },
    // },
    // {
    //     field: 'ssqk',
    //     label: '上市情况',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: void 0,
    //     component: 'Select',
    //     componentProps: {
    //         placeholder: '请选择上市情况',
    //         options: [
    //             {
    //                 label: '未上市',
    //                 value: '1',
    //                 key: '1',
    //             },
    //             {
    //                 label: '上市',
    //                 value: '2',
    //                 key: '2',
    //             },
    //         ],
    //     },
    // },
    // {
    //     field: 'regCapital',
    //     component: 'InputNumber',
    //     label: '注册资金',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: '',
    //     componentProps: {
    //         placeholder: '请输入注册资金',
    //         addonAfter: '万元',
    //         min: 0,
    //         style: {
    //             width: '100%',
    //         }
    //     },
    // },
    // {
    //     field: 'legalName',
    //     component: 'Input',
    //     label: '法人姓名',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: '',
    //     componentProps: {
    //         maxlength: 4,
    //         placeholder: '请输入法人姓名',
    //     },
    // },
    // {
    //     field: 'legalPhone',
    //     component: 'Input',
    //     label: '法定代表人电话',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: '',
    //     componentProps: {
    //         placeholder: '请输入法定代表人电话',
    //     },
    //     dynamicRules: () => {
    //         return [
    //             { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式有误' },
    //         ];
    //     },
    // },
    // {
    //     field: 'liaisonName',
    //     component: 'Input',
    //     label: '企业联络员姓名',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: '',
    //     componentProps: {
    //         maxlength: 4,
    //         placeholder: '请输入企业联络员姓名',
    //     },
    // },
    // {
    //     field: 'liaisonPhone',
    //     component: 'Input',
    //     label: '企业联络员电话',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: '',
    //     componentProps: {
    //         placeholder: '请输入企业联络员电话',
    //     },
    //     dynamicRules: () => {
    //         return [
    //             { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式有误' },
    //         ];
    //     },
    // },
    // {
    //     field: 'category',
    //     component: 'JDictSelectTag',
    //     label: '所属领域',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: '',
    //     componentProps: {
    //         showSearch: true,
    //         placeholder: '请选择所属领域',
    //         dictCode: 'ent_info_ssly',
    //     },
    // },
    {
        field: 'entType',
        component: 'JDictSelectTag',
        label: '企业类型',
        colProps: {
            span: 8,
        },
        // required: true,
        componentProps: {
            showSearch: true,
            showChooseOption: false,
            placeholder: '请选择企业类型',
            dictCode: 'ent_info_qylx',
        },
    },
    // {
    //     field: 'entProperties',
    //     component: 'JDictSelectTag',
    //     label: '企业性质',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: [],
    //     componentProps: {
    //         mode: 'multiple',
    //         placeholder: '请输入企业性质',
    //         dictCode: 'ent_info_qyxz',

    //     },
    // },
    // {
    //     field: 'entCredential',
    //     component: 'JDictSelectTag',
    //     label: '企业资质',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: [],
    //     componentProps: {
    //         mode: 'multiple',
    //         dictCode: 'ent_info_qyzz',
    //         placeholder: '请输入企业资质',
    //     },
    // },
    // {
    //     field: 'technicalCapabilities',
    //     component: 'JDictSelectTag',
    //     label: '技术能力',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: [],
    //     componentProps: {
    //         mode: 'multiple',
    //         dictCode: 'ent_info_jsnl',
    //         placeholder: '请输入技术能力',
    //     },
    // },
    {
        field: 'trade',
        component: 'JDictSelectTag',
        label: '所属行业',
        colProps: {
            span: 8,
        },
        // required: true,
        componentProps: {
            showSearch: true,
            showChooseOption: false,
            dictCode: 'ent_info_sshy',
            placeholder: '请输入所属行业',
        },
    },
    // {
    //     field: 'openingType',
    //     component: 'JDictSelectTag',
    //     label: '开放类型',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: '',
    //     componentProps: {
    //         dictCode: 'ent_info_kflx',
    //         placeholder: '请输入开放类型',
    //     },
    // },
    {
        field: 'entScale',
        component: 'JDictSelectTag',
        label: '企业规模',
        colProps: {
            span: 8,
        },
        // required: true,
        componentProps: {
            showSearch: true,
            showChooseOption: false,
            dictCode: 'ent_info_qygm',
            placeholder: '请输入企业规模',
        },
    },
    // {
    //     field: 'standard',
    //     component: 'JDictSelectTag',
    //     label: '质量标准认证',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: '',
    //     componentProps: {
    //         dictCode: 'ent_info_zlbzrz',
    //         placeholder: '请输入质量标准认证',
    //     },
    // },
    // {
    //     field: 'affiliates',
    //     component: 'JDictSelectTag',
    //     label: '企业下属机构',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: '',
    //     componentProps: {
    //         dictCode: 'ent_info_qyxsjg',
    //         placeholder: '请输入企业下属机构',
    //     },
    // },
    // {
    //     field: 'longitude',
    //     component: 'Input',
    //     label: '企业经度',
    //     colProps: {
    //         span: 8,
    //     },
    //     dynamicDisabled: () => true,
    //     componentProps: {
    //         placeholder: '请输入企业经度',
    //     },
    // },
    // {
    //     field: 'latitude',
    //     component: 'Input',
    //     label: '企业纬度',
    //     colProps: {
    //         span: 8,
    //     },
    //     dynamicDisabled: () => true,
    //     componentProps: {
    //         placeholder: '请输入企业纬度',
    //     },
    // },
    // {
    //     field: 'registerDepartment',
    //     component: 'Input',
    //     label: '登记机关',
    //     colProps: {
    //         span: 8,
    //     },
    //     defaultValue: '',
    //     componentProps: {
    //         maxLength: 20,
    //         placeholder: '请输入登记机关',
    //     },
    // },
];
const status = ref('2')
// 初始化
const init = (type: TypeEnum, params: any) => {
    pageType.value = type
    status.value = params?.entInfo?.status

    // cacheCreditCode.value = params?.entInfo?.creditCode || ''
    let EssentialInfo = Object.assign({}, params?.entInfo || {})
    // EssentialInfo.entProperties = EssentialInfo?.entProperties?.split(',').filter(v => v) || []
    // EssentialInfo.entCredential = EssentialInfo?.entCredential?.split(',').filter(v => v) || []
    // EssentialInfo.technicalCapabilities = EssentialInfo?.technicalCapabilities?.split(',').filter(v => v) || []
    // let entLocation = EssentialInfo.entLocation?.split(',') || ['','']
    // EssentialInfo.longitude = entLocation[0] || ''
    // EssentialInfo.latitude = entLocation[1] || ''
    switch (type) {
        case TypeEnum.create:
            setFieldsValue({
                estDate: dayjs().format('YYYY-MM-DD'),
                // registerDepartment: '鹤壁市淇县市场监督管理局'
            })
            break;
        case TypeEnum.edit:
            setFieldsValue(EssentialInfo)
            break;
        case TypeEnum.details:
            setFieldsValue(EssentialInfo)
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
    useLoading
})



</script>

<style></style>