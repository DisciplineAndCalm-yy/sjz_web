<template>
    <BasicModal @register="register" v-bind="$attrs" title="指标" @ok="handleSubmit" width="60%">
        <a-space>
            <a-button type="primary" preIcon="ant-design:export-outlined" @click="toExport"> 导出全部</a-button>
            <a-button type="primary" preIcon="ant-design:export-outlined" @click="toExport" :disabled="selectedRowKeys.length == 0"> 导出</a-button>
        </a-space>
        <!-- selectedRowKeys: {{ selectedRowKeys }} -->
        <a-table :rowKey="record => record.id" :columns="columns" :data-source="props.dataSource"
            :row-selection="rowSelection" :footer="null" :pagination="false"/>
    </BasicModal>
</template>
<script lang="ts" setup>
import { ref, unref, watch } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
const selectedRowKeys = ref([])
// 声明props
const props = defineProps({
    dataSource: {
        type: Array,
        default: []
    }
})


const rowSelection = ref({
    checkStrictly: false,
    onChange: (keys: (string | number)[], selectedRows: DataItem[]) => {
        console.log('keys', keys)
        selectedRowKeys.value = keys
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    //   onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
    //     console.log(record, selected, selectedRows);
    //   },
    //   onSelectAll: (selected: boolean, selectedRows: DataItem[], changeRows: DataItem[]) => {
    //     console.log(selected, selectedRows, changeRows);
    //   },
});

// //定义表格列
const columns: BasicColumn[] = [
    {
        title: '河北省营商环境评价指标体系',
        dataIndex: 'indicatorName',
        // width: 170,
        align: 'left',
        resizable: true
    },
    // {
    //     title: 'indicatorType',
    //     dataIndex: 'indicatorType',
    //     // width: 170,
    //     align: 'left',
    //     resizable: true
    // }
]


// const onSelectChange = (selectedRowKeys) => {
//     console.log('selectedRowKeys changed: ', selectedRowKeys);
//     //   selectedRowKeys.value = selectedRowKeys;
//     state.selectedRowKeys = selectedRowKeys
// };

const toExport = () => {
    console.log('selectedRowKeys', selectedRowKeys.value)
}


</script>