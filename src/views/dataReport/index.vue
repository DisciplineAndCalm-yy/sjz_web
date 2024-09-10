<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-12-04 11:28:15
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-18 15:56:01
 * @FilePath: \yst-province-hebei-web\src\views\dataReport\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-20 17:22:21
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-12-04 13:55:56
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicTable @register="registerTable">
    <template #tableTitle>
      <!-- <a-button type="primary" v-if="!query.id" >导出</a-button>
      <a-button type="primary"  v-if="!query.id" @click="toPreview">预览</a-button>
      <a-button type="primary" @click="handleAverage">一键平权</a-button> -->
    </template>
    <template #form-templateId="{ model, field }">
      <a-select v-model:value="model[field]" :allowClear="false">
        <a-select-option :value="item.id" v-for="item in templateList" :key="item.id">{{ item.name }}</a-select-option>
      </a-select>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'activateStatusText'">
        <a-tag :color="setColor('activateStatus', record.activateStatus)">{{ record.activateStatusText }}</a-tag>
        <!-- <a-button size="small" :style="{'background': setColor('activateStatus', record.activateStatus), 'color':'white'}">{{ record.projectStatusText }}</a-button> -->
      </template>
      <template v-if="column.key === 'checkStatusText'">
        <a-tag :color="setColor('checkStatus', record.checkStatus)" v-if="record.checkStatus == 0 || record.checkStatus == 1">{{ record.checkStatusText }}</a-tag>
        <span v-else>{{ record.checkStatusText || '--' }}</span>
      </template>
    </template>
    <!--操作栏-->
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
</template>

<script lang="ts" setup>
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useModal } from '/@/components/Modal';
import { useListPage } from '/@/hooks/system/useListPage';
import { columns, searchFormSchema, currentAuditStatus } from './index.data';
import { useRouter, useRoute } from 'vue-router';
import { sendList } from '/@/api/dataReport/index'
import { reactive, computed, nextTick, ref  } from 'vue';
import {setColor} from '/@/utils/perry'


const router = useRouter()
const route = useRoute()
const query = route.query
const templateList = ref([])  // 指标体系列表
const emit = defineEmits(['nextStep'])
// 列表页面公共参数、方法
const { tableContext } = useListPage({
  tableProps: {
    title: '数据报送',
    // dataSource: [{}],
    immediate: true,
    api: sendList,
    columns: columns,
    size: 'small',
    scroll: { x: 1300 },
    useSearchForm: !query.id,
    formConfig: {
      // labelAlign: 'left',
      // labelWidth: 150,
      schemas: searchFormSchema,
      showAdvancedButton: false,
      fieldMapToTime: [
        ['date', ['startDate', 'endDate'], 'YYYY-MM-DD']
      ]
      // resetFunc: async () => {
      //   return new Promise( () => {
      //     // if (!query.id) {
      //       let list = templateList.value
      //       getForm().setFieldsValue({templateId: list[0].id})
      //     // } else {

      //     // }
      //     return reload()
      //   })
      // },
    },
    actionColumn: {
      width: 120,
      fixed: 'right',
    },
    rowKey: 'auditId',
    rowSelection: {
      preserveSelectedRowKeys: false,
    },
    // 请求之前对参数做处理
    beforeFetch(params) {
      console.log('请求前参数处理')
      if (query.id) {
        params.projectId = query.id
      }
    },
  },
});


//注册table数据
const [registerTable, { reload, clearSelectedRowKeys, setColumns, getForm, getDataSource }, { rowSelection, selectedRows, selectedRowKeys }] = tableContext;
const [registerModal, {openModal}] = useModal()

/**
 * 初始化表格数据
 */
async function initData() {

}
initData()


/**
 * 操作栏
 */
 function getTableAction(record): ActionItem[] {
  return [
    {
      label: '查看',
      onClick: () => {
        router.push({
          path: '/dataReport/detail',
          query: {
            id: record.id,
          }
        })
      },
      // ifShow: () => {
      //   return record.activateStatus == '3'
      // },
    },
  ];
}

</script>

<style lang="less" scoped>
.tips {
  margin: 10px;
  color: red;
}
.weight {
  max-width: 200px;
}
</style>