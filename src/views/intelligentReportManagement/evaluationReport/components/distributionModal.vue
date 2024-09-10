<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-26 16:18:08
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-31 10:34:06
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\components\combination.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicModal @register="registerModal" v-bind="$attrs" :title="title" width="40%" :useWrapper="false"
    :canFullscreen="false" :showCancelBtn="false" :showOkBtn="false" @ok="handleSubmit">
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle>
        <a-button type="primary" @click="distributionFile">分发</a-button>
        <a-button @click="withdrawFile">撤回</a-button>
      </template>
      <template #bodyCell="{text, record, column}">
        <template v-if="column.dataIndex == 'statusDesc'">
          <span :class="record.status == '0'?'red':'green'">{{ text }}</span>
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script lang="ts" setup>
import { BasicModal, useModalInner } from '/@/components/Modal';
import { reactive, computed, nextTick, ref, unref  } from 'vue';
import { addDirStorage, updateDirStorage } from '/@/api/intelligentReport'
import { BasicTable, BasicColumn } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { sendDepartList, sendStorage, revokeStorage } from '/@/api/intelligentReport'
import { useMessage } from '/@/hooks/web/useMessage';

// 声明Emits
const emit = defineEmits(['success', 'register']);
const maxCount = ref(1)

const fileInfo = ref({})
const title = ref('分发报告')
const columns: BasicColumn[] = [
  {
    title: '部门',
    dataIndex: 'departName',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'statusDesc',
    width: 200,
  },
]

const { createConfirm, createMessage } = useMessage();

const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data)=>{
  setModalProps({ confirmLoading: false });
  fileInfo.value = data
  reload()
});

// 声明树表格调用
const { tableContext, onExportXls, onImportXls } = useListPage({
  tableProps: {
    maxHeight: 400,
    api: sendDepartList,
    immediate: false,
    columns: columns,
    showActionColumn: false,
    showIndexColumn: false,
    useSearchForm: false,
    pagination: false,
    showTableSetting: false,
    beforeFetch: (params) => {
      params.dirId = fileInfo.value.dirId
      params.storageId = fileInfo.value.storageId
    },
    rowSelection: {
      checkStrictly: false,
    },
    rowKey: 'id',
  }
  // dataSource: dataSource,

});
const [registerTable, { reload, setProps, clearSelectedRowKeys }, { rowSelection, selectedRowKeys }] = tableContext;

/**
 * 分发文件
 */
function distributionFile() {
  if (!unref(selectedRowKeys).length) {
    return createMessage.error('分发选项不能为空')
  }
  console.log('roekey', selectedRowKeys)
  createConfirm({
    title: '分发',
    content: `确定要分发吗？`,
    iconType: 'warning',
    onOk: async () => {
      let params = {
        departId: unref(selectedRowKeys).join(','),
        dirId: unref(fileInfo).dirId,
        storageId: unref(fileInfo).storageId
      }
      await sendStorage(params)
      await clearSelectedRowKeys()
      await reload()
      emit('success')
    }
  });
}
/**
 * 撤回文件
 */
function withdrawFile() {
  if (!unref(selectedRowKeys).length) {
    return createMessage.error('撤回选项不能为空')
  }
  createConfirm({
    title: '撤回',
    content: `确定要撤回吗？`,
    iconType: 'warning',
    onOk: async () => {
      let params = {
        departId: unref(selectedRowKeys).join(','),
        dirId: unref(fileInfo).dirId,
        storageId: unref(fileInfo).storageId
      }
      await revokeStorage(params)
      await clearSelectedRowKeys()
      await reload()
      emit('success')
    }
  });
}
//弹框确认
async function handleSubmit() {

}
</script>

<style lang="less" scoped>
// .input-number {
//   max-width: 200px;
// }
.input-box {
  // background: yellow;
  display: flex;
  justify-content: space-around;
  > * {
    max-width: 300px;
  }
}
.red {
  color: #FF820F;
}
.green {
  color: #4AC056;
}
</style>