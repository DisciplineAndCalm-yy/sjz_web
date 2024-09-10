
<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-14 10:27:39
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-14 21:26:28
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/butler-binding/PreviewBindingEnterpriseModal.vue
 * @Description  : 查看绑定企业弹窗
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <BasicModal v-bind="$attrs" :draggable="false" :footer="null" :canFullscreen="false" @register="registerModal"
        title="查看绑定企业">
        <BasicTable @register="registerTable">
            <template #form-resetBefore>
                已绑定{{ computedDataNum }}家企业
            </template>
            <!--操作栏-->
            <template #action="{ record }">
                <TableAction :actions="getTableAction(record)" />
            </template>
        </BasicTable>
    </BasicModal>
</template>

<script lang="ts" name="PreviewBindingEnterpriseModal" setup>
import { useModalInner, BasicModal } from "/@/components/Modal";
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { enterpriseEntMangerBindingEntList, enterpriseEntMangerCancelBindingEnt } from './index.api';
import { previewModalColumns, modalSearchFormSchema } from './index.data';
import { computed, ref } from "vue";

const emit = defineEmits(['success', 'register']);

const modalPropsEntNum = ref(0)
const modalPropsUserId = ref('')



// 列表页面公共参数、方法
const { tableContext } = useListPage({
    designScope: 'enterprise-library',
    tableProps: {
        showTableSetting: false,
        api: enterpriseEntMangerBindingEntList,
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
            // ifShow: false,
            fixed: 'right',
            width: 100
            //   width: 0,
        },
    },
});

const [registerTable, { setProps, getRawDataSource, reload }] = tableContext;
const [registerModal] = useModalInner(async ({ userId, entNum }) => {
    modalPropsEntNum.value = entNum
    modalPropsUserId.value = userId
    setProps({
        searchInfo: {
            userId
        }
    })
});

const computedDataNum = computed(() => {
    return getRawDataSource()?.dataNum
})

/**
* 操作栏
*/
function getTableAction(record): ActionItem[] {
    return [
        {
            label: '解绑',
            popConfirm: {
                title: '确认取消绑定改企业吗?',
                confirm: async () => {
                    console.log(modalPropsUserId.value, record.id);
                    enterpriseEntMangerCancelBindingEnt({
                        userId: modalPropsUserId.value,
                        entId: record.id
                    }).then(() => {
                        emit('success')
                        reload()
                    })
                }
            }
        },
      
    ];
}
</script>

<style></style>