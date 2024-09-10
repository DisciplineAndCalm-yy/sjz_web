<template>
    <BasicModal v-bind="$attrs" :draggable="false" :footer="null" :canFullscreen="false" @register="registerModal"
        title="查看绑定">
        <BasicTable @register="registerTable">
        </BasicTable>
    </BasicModal>
</template>

<script lang="ts" name="PreviewModal" setup>
import { useModalInner, BasicModal } from "/@/components/Modal";
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { enterpriseEntMangerApplyFinishBindingManger } from './index.api';
import { previewModalColumns, modalSearchFormSchema } from './index.data';

const emit = defineEmits(['success', 'register']);




// 列表页面公共参数、方法
const { tableContext } = useListPage({
    designScope: 'enterprise-library',
    tableProps: {
        showTableSetting: false,
        api: enterpriseEntMangerApplyFinishBindingManger,
        columns: previewModalColumns,
        size: 'small',
        formConfig: {
            showAdvancedButton: false,
            showResetButton: false,
            baseColProps: {
                span: 8,
                lg: 8,
                xxl: 8
            },
            actionColOptions: {
                span: 16,
                lg: 16,
                xxl: 16
            },
            labelWidth: 100,
            labelAlign: 'left',
            schemas: modalSearchFormSchema,
            submitButtonOptions: {
                text: '快速查询'
            }
        },
        actionColumn: {
            ifShow: false,
        },
    },
});

const [registerTable, { setProps }] = tableContext;
const [registerModal] = useModalInner(async ({ entId }) => {
    setProps({
        searchInfo: {
            entId
        }
    })
});
</script>

<style></style>