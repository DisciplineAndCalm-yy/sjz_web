
<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-14 10:27:39
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-20 13:52:17
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/butler-maintenance/MaintenanceModal.vue
 * @Description  : 维护弹窗
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <BasicModal v-bind="$attrs" useWrapper :wrapperFooterOffset="40" :draggable="false" :canFullscreen="false"
        @register="registerModal" title="企业服务管家维护" @ok="handleSubmit">
        <BasicForm :schemas="schemas" ref="refMaintenanceModal" v-bind="formAttrs">
            <template #username="{ model }">
                <div class="text-right">{{ model.username }}</div>
            </template>
            <template #realname="{ model }">
                <div class="text-right">{{ model.realname }}</div>
            </template>
            <template #gradeText="{ model }">
                <div class="text-right">{{ model.gradeText }}</div>
            </template>
        </BasicForm>
    </BasicModal>
</template>

<script lang="ts" name="MaintenanceModal" setup>
import { useModalInner, BasicModal } from "/@/components/Modal";
import { enterpriseEntMangerSaveOrUpdateManger } from './index.api';
import { getModalFormSchema } from './index.data';
import { ref, unref, reactive } from "vue";
import { FormSchema, BasicForm, FormActionType } from "/@/components/Form";

const emit = defineEmits(['success', 'register']);
const refMaintenanceModal = ref<Nullable<FormActionType>>(null)

// id
const modalPropsUserId = ref('')
// 是否绑定企业
const isShowGrade = ref(false)
const [registerModal, { closeModal, changeOkLoading }] = useModalInner(async (record) => {
    modalPropsUserId.value = record.userId
    isShowGrade.value = !!record.entNum

    unref(refMaintenanceModal)?.setFieldsValue({
        ...record,
        Date: [
            record.startDate || undefined,
            record.endDate || undefined,
        ]
    })
    unref(refMaintenanceModal)?.clearValidate()
});


const handleSubmit = async () => {
    unref(refMaintenanceModal)?.validate().then(async () => {
        changeOkLoading(true)
        const params = await unref(refMaintenanceModal)?.getFieldsValue()
        enterpriseEntMangerSaveOrUpdateManger({ ...params, userId: modalPropsUserId.value }).then(() => {
            closeModal()
            emit('success')
        }).finally(() => {
            changeOkLoading(false)
        })
    })
}

// 弹窗表单配置
const schemas: FormSchema[] = getModalFormSchema((val: boolean) => {
    return () => {
        return val ? unref(isShowGrade) : !unref(isShowGrade)
    }
})
// Form 配置
const formAttrs = reactive({
    showActionButtonGroup: false,
    baseColProps: {
        span: 24,
    },
    labelWidth: "30%",
    baseRowStyle: {
        width: '80%',
        margin: '0 auto'
    },
    labelAlign: "left",
    fieldMapToTime: [
        ['Date', ['startDate', 'endDate'], 'YYYY-MM-DD']
    ],
})



</script>

<style></style>