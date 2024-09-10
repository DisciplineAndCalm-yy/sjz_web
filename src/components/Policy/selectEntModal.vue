<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-08-10 15:07:29
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-09-12 14:09:27
 * @FilePath: \yst-city-qixian-PolicyRecommendationSystem-web\src\components\Policy\selectEntModal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :width="1000" :minHeight="300" :useWrapper="false"
    :canFullscreen="false" :title="title" @ok="handleSubmit">
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
import { ref, computed, unref, onBeforeMount } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { queryEntList } from '/@/api/policy/policy'
import { FormSchema, BasicTable, useTable, BasicColumn, TableRowSelection } from '/@/components/Table';
import { message } from 'ant-design-vue';



// 声明Emits
const emit = defineEmits(['success', 'register']);
const props = defineProps(['value'])

const title = ref('选择企业')
const disabled = ref(false)
const searchFormSchema: FormSchema[] = [
  {
    label: '企业名称',
    field: 'entName',
    component: 'Input',
    // colProps: { span: 8 },
  },
  {
    label: '统一社会信用代码',
    field: 'creditCode',
    component: 'Input',
    // colProps: { span: 8 },
  },
];
const columns: BasicColumn[] = [
  {
    title: '统一社会信用代码',
    dataIndex: 'creditCode',
    width: 120,
  },
  {
    title: '企业名称',
    dataIndex: 'entName',
    width: 100,
    fixed: 'left',
  },
];
const rowSelection: TableRowSelection<any> = {
  type: 'checkbox',
  preserveSelectedRowKeys: false,
  columnWidth: 20,
  onChange: () => {
    
  },
}

// 列表注册
const [registerTable, { reload, setLoading, getSelectRows, clearSelectedRowKeys, getSelectRowKeys}] = useTable({
  api: queryEntList,
  searchInfo: {listType: 2},
  columns: columns,
  useSearchForm: true,
  showIndexColumn: false,
  formConfig: {
    compact: true,
    schemas: searchFormSchema,
    showAdvancedButton: false,
    baseColProps: { span: 8 },
    // rowProps: { gutter: 8 },
    actionColOptions: { span: 8 },
    labelWidth: 140,
  },
  rowKey: 'id',
  // rowSelection: {
  //   preserveSelectedRowKeys: false,
  // },
})

//弹框初始
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  console.log('tankuang初始话')
  setModalProps({ confirmLoading: false });
  clearSelectedRowKeys()
  // reload()
});





//弹框确认
async function handleSubmit() {
  try {
    // setModalProps({ confirmLoading: true });
    const rowSelection = getSelectRows()
    const rowKey = getSelectRowKeys()
    const { value } = props
    console.log('rowselect', rowSelection)
    console.log('value', value)
    if (value) {
      let len1 = rowKey.length + value.length
      let len2 = new Set([...value, ...rowKey]).size
      console.log(len1, len2)
      if (len1 !== len2) {
        message.warning('存在已添加的企业')
        return
      }
    }
    closeModal();
    //刷新列表
    emit('success', rowSelection);
  } finally {
    // setModalProps({ confirmLoading: false });
  }
}


onBeforeMount(async () => {

})
</script>

<style lang="less" scoped></style>