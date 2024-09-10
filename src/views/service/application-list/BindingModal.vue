<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-19 13:54:15
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-06-07 16:54:10
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/application-list/BindingModal.vue
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <BasicModal v-bind="$attrs" :draggable="false" :canFullscreen="false" @register="registerModal" title="绑定企业服务管家"
        @ok="handleSubmit">
        <BasicTable @register="registerTable" :rowSelection="rowSelection">
            <template #form-formFooter>
                <a-tag color="processing" class="!mr-4" v-for="item in selectedRows" :key="item.id">{{ item.realname
                }}</a-tag>
            </template>
        </BasicTable>
    </BasicModal>
</template>

<script lang="ts" name="BindingModal" setup>
import { useModalInner, BasicModal } from "/@/components/Modal";
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { enterpriseEntMangerApplyBindManger, enterpriseEntMangerApplyUnboundList, enterpriseEntMangerApplyFinishBindingManger } from './index.api';
import { modalColumns, modalSearchFormSchema } from './index.data';
import { ref, unref } from "vue";

const emit = defineEmits(['success', 'register']);
const modalPropsUserId = ref('')
// 列表页面公共参数、方法
const { tableContext } = useListPage({
    designScope: 'enterprise-library',
    tableProps: {
        // showIndexColumn: true,
        showTableSetting: false,
        api: enterpriseEntMangerApplyUnboundList,
        columns: modalColumns,
        size: 'small',
        rowKey: 'userId',
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
            //   width: 0,
        },
        rowSelection: {
            hideSelectAll: true,
            getCheckboxProps: (record) => {
                const gradeList = unref(selectedRows).map(({ grade }) => grade)
                return {
                    disabled: unref(selectedRowKeys).length == 2 && !unref(selectedRowKeys).includes(record.userId) || !unref(selectedRowKeys).includes(record.userId) && gradeList.includes(record.grade),
                }
            }
        }
    },
});

const [registerTable, { clearSelectedRowKeys, setSelectedRowKeys }, { rowSelection, selectedRows, selectedRowKeys }] = tableContext;
const [registerModal, {  closeModal }] = useModalInner(async ({ entId }) => {
    modalPropsUserId.value = entId
    clearSelectedRowKeys()
    getBindingManger()
});


// 查询绑定列表
const getBindingManger = () => {
    enterpriseEntMangerApplyFinishBindingManger({
        entId: modalPropsUserId.value
    }).then(res => {
        const ids = res.map(({ userId }) => userId)
        setTimeout(() => {
            setSelectedRowKeys(ids)
        }, 100);
    })
}

// 提交
const handleSubmit = async () => {
    try {
        const ids: string[] = unref(selectedRowKeys)
        enterpriseEntMangerApplyBindManger({
            entId: modalPropsUserId.value,
            userIds: ids.join(',')
        }).then(() => {
            clearSelectedRowKeys()
            closeModal()
            emit('success')
        })
    } catch (e) {
        console.log(e);
    }
}




</script>

<style></style>