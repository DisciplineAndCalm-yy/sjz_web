<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-07-28 16:15:55
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-31 10:28:50
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/application-list/NotBoundModal.vue
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <BasicModal v-bind="$attrs" st :draggable="false" @ok="handleSubmit" :canFullscreen="false" @register="registerModal"
        title="暂不绑定">
        <BasicForm @register="register" />
    </BasicModal>
</template>

<script lang="ts" name="PreviewModal" setup>
import { useModalInner, BasicModal } from "/@/components/Modal";
import { BasicTable, TableAction, ActionItem, FormSchema } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { enterpriseEntMangerApplyApplyApprove, enterpriseEntMangerApplyFinishBindingManger } from './index.api';
import { previewModalColumns, modalSearchFormSchema } from './index.data';
import { reactive, ref, } from "vue";
import { BasicForm, useForm } from '/@/components/Form/index';

const emit = defineEmits(['success', 'register']);
const schemas: FormSchema[] = [
    {
        field: 'reason',
        component: 'InputTextArea',
        label: '备注',
        required: true,
        componentProps: {
            placeholder: '请输入备注',
            rows: 8
        },
    },
];
const [register, { validateFields, resetFields }] = useForm({
    labelWidth: 120,
    schemas,
    labelCol: {
        xs: 24,
        sm: 8,
        md: 6,
        lg: 8,
        xl: 6,
        xxl: 6,
    },
    showActionButtonGroup: false,
});
const ids = ref('')
const [registerModal, { closeModal }] = useModalInner(async ({ id }) => {
    resetFields()
    ids.value = id
});

const handleSubmit = () => {
    validateFields().then(res => {
        if (res) {
            enterpriseEntMangerApplyApplyApprove({
                id: ids.value, ...res
            }).then(() => {
                closeModal()
                emit('success')
            })
        }

    })
}
</script>

<style></style>