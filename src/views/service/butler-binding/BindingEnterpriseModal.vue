
<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-14 10:27:39
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-20 13:52:53
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/butler-binding/BindingEnterpriseModal.vue
 * @Description  : 绑定企业弹窗
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <BasicModal v-bind="$attrs" :draggable="false" :canFullscreen="false" :showOkBtn="selectedRowKeys.length!==0" @register="registerModal" title="绑定企业"
        @ok="handleSubmit">
        <BasicTable @register="registerTable" :rowSelection="rowSelection">
            <template #form-formFooter>
                <a-tag color="processing" class="!mr-4 !mt-2" v-for="item in selectedRows" :key="item.id">{{ item.entName
                }}</a-tag>
            </template>
        </BasicTable>
    </BasicModal>
</template>

<script lang="ts" name="BindingEnterpriseModal" setup>
import { useModalInner, BasicModal } from "/@/components/Modal";
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { enterpriseEntMangerBindingEnt, enterpriseEntMangerUnboundList } from './index.api';
import { modalColumns, modalSearchFormSchema } from './index.data';
import { ref, unref } from "vue";

const emit = defineEmits(['success', 'register']);
const modalPropsUserId = ref('')
const modalPropsEntNum = ref(0)
// 列表页面公共参数、方法
const { tableContext } = useListPage({
    designScope: 'enterprise-library',
    tableProps: {
        // showIndexColumn: true,
        showTableSetting: false,
        api: enterpriseEntMangerUnboundList,
        columns: modalColumns,
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
        beforeFetch(params) {
            switch (params.column) {
                case 'createTime':
                    params.bindingTimeSort = params.order
                    break;
                case 'creditCode':
                    params.creditCodeSort = params.order
                    break;
            }
            delete params.column
            delete params.order

        }

    },
});

const [registerTable, { setProps, clearSelectedRowKeys }, { rowSelection, selectedRows, selectedRowKeys }] = tableContext;
const [registerModal, { closeModal, changeOkLoading }] = useModalInner(async ({ userId, entNum }) => {
    modalPropsUserId.value = userId
    modalPropsEntNum.value = entNum
    setProps({
        searchInfo: {
            userId
        }
    })
    clearSelectedRowKeys()
});


const handleSubmit = async () => {
    try {
        const ids: string[] = unref(selectedRowKeys)
        if (!ids.length) {
            return closeModal()
        }
        changeOkLoading(true)
        enterpriseEntMangerBindingEnt({
            entIds: ids.join(','),
            userId: modalPropsUserId.value
        }).then(() => {
            clearSelectedRowKeys()
            emit('success')
            closeModal()
        }).finally(() => {
            changeOkLoading(false)
        })
    } catch (e) {
        console.log(e);
    }
}




</script>

<style></style>