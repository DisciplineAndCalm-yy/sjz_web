<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-07-26 11:20:15
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-26 15:38:39
 * @FilePath     : /yst-city-xixian-enterpriseServiceSystem-web/src/views/service/enterprise-library/components/ModalUseNum.vue
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <BasicModal v-bind="$attrs" @register="register" :title="modelOptions.title">
        <BasicTable @register="registerTable">
        </BasicTable>
    </BasicModal>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { enterpriseEntUserList } from '../index.api';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicTable } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';


const { tableContext, onExportXls, onImportXls } = useListPage({
    designScope: 'ModalUseNum',
    tableProps: {
        api: enterpriseEntUserList,
        immediate: false,
        columns: [
            {
                title: '姓名',
                dataIndex: 'realname',
            },
            {
                title: '手机号',
                dataIndex: 'phone',
            },
            {
                title: '绑定时间',
                dataIndex: 'createTime',
            }
        ],
        useSearchForm: false,
        formConfig: undefined,
        size: 'small',
        showTableSetting: false,
        actionColumn: null
    },
});
const [registerTable, { reload, setProps }] = tableContext;

const modelOptions = reactive({
    title: '使用人名单列表'
})

const [register] = useModalInner((data) => {
    // modelOptions.title = data.entName
    setProps({
        searchInfo: {
            entId: data.id
        }
    })
    reload()
});


</script>