<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-12 09:55:41
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-07-10 18:24:10
 * @FilePath     : /yst-city-xixian-enterpriseServiceSystem-web/src/views/service/enterprise-library/index.vue
 * @Description  : 企业库
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <BasicTable @register="registerTable">
        <!--插槽:table标题-->
        <template #tableTitle>
            <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate"> 新建</a-button>
            <a-button type="primary" preIcon="ant-design:export-outlined" @click="useDownloadTemplate">下载模版</a-button>
            <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">批量导入</j-upload-button>
            <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 下载</a-button>
        </template>
        <!--操作栏-->
        <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
        </template>
        <template v-slot:bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'useNum'">
                <a-button type="link" @click="usePreview(record)">{{ record.useNum }}</a-button>
            </template>
        </template>
    </BasicTable>
    <ModalUseNum @register="registerModal" :showOkBtn="false" cancelText="关闭" width="50%" :canFullscreen="false" />
</template>

<script setup lang="ts" name="service-enterprise-library">
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import {
    enterpriseEntInfoList,
    getImportUrl,
    getExportUrl,
    getTemplateUrl,
    enterpriseEntInfoDelete,
    enterpriseEntInfoMoveCancel,
} from './index.api';
import { columns, searchFormSchema } from './index.data';
import { useGo } from '/@/hooks/web/usePage';
import { useMethods } from '/@/hooks/system/useMethods';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useModal } from '/@/components/Modal';
import ModalUseNum from './components/ModalUseNum.vue'

const go = useGo()
const { handleExportXlsx } = useMethods()
const [registerModal, { openModal }] = useModal();

const useDownloadTemplate = () => {
    handleExportXlsx('企业导入模板', getTemplateUrl)
}
// 列表页面公共参数、方法
const { tableContext, onExportXls, onImportXls } = useListPage({
    designScope: 'enterprise-library',
    tableProps: {
        api: enterpriseEntInfoList,
        columns: columns,
        size: 'small',
        showTableSetting: false,
        formConfig: {
            showAdvancedButton: false,
            labelWidth: 120,
            // baseColProps: {
            //     span: 8,
            //     lg: 8,
            //     xxl: 8
            // },
            labelAlign: 'left',
            schemas: searchFormSchema,
            fieldMapToTime: [
                ['toDate', ['startTime', 'endTime'], 'YYYY-MM-DD']
            ]
        },
        actionColumn: {
            fixed: 'right',
            width: 240,
        },
    },
    exportConfig: {
        name: '企业库',
        url: getExportUrl,
    },
    importConfig: {
        url: getImportUrl,
    },
});


const [registerTable, { reload }, { rowSelection, selectedRows, selectedRowKeys }] = tableContext;
/**
 * 新增事件
 */
function handleCreate() {
    go('/service/enterprise-library/create')
}

/**
* 操作栏
*/
function getTableAction(record): ActionItem[] {
    return [
        {
            label: '详情',
            onClick: () => {
                go(`/service/enterprise-library/details?id=${record.id}`)
            },
        },
        {
            label: '删除',
            disabled: record.status == '已激活',
            popConfirm: {
                title: '确认删除该条数据吗?',
                confirm: async () => {
                    // 删除成功 reload
                    await enterpriseEntInfoDelete({ id: record.id })
                    reload()
                }
            }
        },
        // {
        //     label: '重置企业状态',
        //     disabled: record.status !== '已激活',
        //     popConfirm: {
        //         title: '确认重置企业状态吗?',
        //         confirm: async () => {
        //             await enterpriseEntInfoUpdateStatus({ id: record.id })
        //             reload()
        //         }
        //     }
        // },
        {
            label: '移入注销企业库',
            onClick: () => {
                Modal.confirm({
                    content: createVNode('div', {}, [
                        createVNode('div', {
                            class: 'text-black text-base'
                        }, '确认移入注销企业库吗?'),
                        createVNode('div', {
                            class: 'text-sm text-red-500 text-right !pt-6 !pb-2'
                        }, '移入后该企业不可使用小程序'),
                    ]),
                    icon: createVNode(ExclamationCircleOutlined),
                    async onOk() {
                        await enterpriseEntInfoMoveCancel({ id: record.id })
                        reload()
                    },
                    onCancel() {
                        Modal.destroyAll();
                    },
                });
            },
            // popConfirm: {
            //     title: '确认移入注销企业库吗?',
            //     confirm: async () => {
            //         await enterpriseEntInfoMoveCancel({ id: record.id })
            //         reload()
            //     }
            // }
        },
    ];
}

const usePreview = (record: any) => {
    openModal(true, record)
}
</script>

<style></style>