<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-31 15:21:24
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-24 16:53:11
 * @FilePath: \yst-province-hebei-web\src\views\intelligentReportManagement\evaluationReport\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="report">
    <div class="left" v-auth="'evaluationReport:upload'">
      <BasicTable @register="registerTreeTable" >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'dirName'">
            <div class="treeName">
              <span>{{ treeTitle.dirName }}</span>
              <form-outlined class="editIcon" @click="editTree()" />
              <plus-outlined class="plusIcon" @click="addTree()" />
            </div>
          </template>
        </template>
        <template #bodyCell="{ text, column, record }">
          <template v-if="column.key === 'dirName'">
            <div :class="['treeItem', record.id == dirId ? 'selected' : '']" @click="clickTree(record)">
              <span>{{ text }}</span>
              <DeleteOutlined v-if="record.dirLevel <= 3" class="deleteIcon" @click="delTree(record)" />
              <form-outlined v-if="record.dirLevel <= 3" class="editIcon" @click="editTree(record)" />
              <plus-outlined v-if="record.dirLevel < 3" class="plusIcon" @click="addTree(record)" />
            </div>
          </template>
        </template>
      </BasicTable>
      <treeSetModal @register="registerModal" @success="reloadTree"></treeSetModal>
    </div>
    <div class="right">
      <BasicTable @register="registerTable" :rowSelection="rowSelection">
        <template #tableTitle>
          <a-button type="primary" v-auth="'evaluationReport:upload'" @click="addFile">上传报告</a-button>
          <template v-if="selectedRowKeys.length > 0">
            <a-button v-auth="'evaluationReport:upload'" @click="exportSelect">导出</a-button>
          </template>
        </template>
        <!--操作栏-->
        <template #action="{ record }">
          <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
        </template>
      </BasicTable>
      <addReportModal @register="registerReportModal" @success="reloadTable"></addReportModal>
      <distributionModal @register="registerDistributionModal" @success="reloadTable"></distributionModal>
      <previewModal @register="registerPreviewModal"></previewModal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BasicTable, useTable, ActionItem, TableAction } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { DeleteOutlined, QuestionCircleFilled, FormOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { reactive, computed, nextTick, ref, watch, unref, } from 'vue';
import { getDirList, queryStorageList } from '/@/api/intelligentReport'
import { useModal } from '/@/components/Modal';
import { treeColumns, tableColumns, searchFormSchema } from './index.data';
import treeSetModal from './components/treeSetModal.vue';
import addReportModal from './components/addReportModal.vue'
import distributionModal from './components/distributionModal.vue';
import previewModal from './components/previewModal.vue'
import { deleteDir, deleteStorage, downloadBatch } from '/@/api/intelligentReport'
import { useMessage } from '/@/hooks/web/useMessage';
import { useMethods } from '/@/hooks/system/useMethods';
import { exportMethod } from '/@/utils/file/download'
import dayjs from 'dayjs';



// const treeData = ref([])
const treeTitle = ref({})
const dirId = ref()

const { createConfirm } = useMessage();
const { handleExportXls } = useMethods();

// 编辑目录树modal
const [registerModal, { openModal }] = useModal()
// 添加编辑文件modal
const [registerReportModal, { openModal: openReportModal }] = useModal()
// 分发modal
const [registerDistributionModal, { openModal: openDistributionModal }] = useModal()
const [registerPreviewModal, { openModal: openPreviewModal }] = useModal()

// 声明树表格调用
const [registerTreeTable, { reload: reloadTree, setProps: setTreeProps }] = useTable({
  // dataSource: dataSource,
  api: async (params) => {
    let data = await getDirList(params) || {}
    treeTitle.value = data.dirTtile || {}
    return data.dirVOList || []
  },
  immediate: true,
  columns: treeColumns,
  showActionColumn: false,
  showIndexColumn: false,
  useSearchForm: false,
  pagination: false,
  showTableSetting: false,
  afterFetch: (data) => {
    console.log('data-----', data)
    dirId.value = data[0] ? data[0].id : null
  }
});


const { tableContext, onExportXls, onImportXls } = useListPage({
  tableProps: {
    title: '政策列表',
    api: queryStorageList,
    immediate: false,
    clearSelectOnPageChange: true,
    columns: tableColumns,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      baseColProps: {
        xs: 24,
        sm: 12,
        md: 12,
        lg: 8,
        xl: 8,
        xxl: 8,
      },
      fieldMapToTime: [
        ['updateTime', ['startDate', 'endDate'], 'YYYY-MM-DD']
      ]
    },
    actionColumn: {
      width: 150,
      // fixed: 'right'
    },
    showIndexColumn: false,
    useSearchForm: true,
    showTableSetting: false,
    beforeFetch: (params) => {
      // console.log('parasm', params)
      params.dirId = dirId.value
      return params
    },
    rowKey: 'storageId',
    rowSelection: {
      preserveSelectedRowKeys: false,
    },
    afterFetch: () => {
      clearSelectedRowKeys()
    }
  },
});
const [registerTable, { reload: reloadTable, setProps: setTableProps, clearSelectedRowKeys, getForm }, { rowSelection, selectedRowKeys }] = tableContext;

// 声明树表格调用
// const [registerTable, { reload: reload Table, setProps: setTableProps }] = useTable({
//   dataSource: dataSource,
//   api: queryStorageList,
//   immediate: false,
//   columns: tableColumns,
//   formConfig: {
//     labelWidth: 120,
//     schemas: searchFormSchema,
//     autoSubmitOnEnter: true,
//     fieldMapToTime: [
//       ['update', ['startDate', 'endDate'], 'YYYY-MM-DD']
//     ]
//   },
//   showActionColumn: false,
//   showIndexColumn: false,
//   useSearchForm: true,
//   // pagination: false,
//   showTableSetting: false,
//   beforeFetch: (params) => {
//     // console.log('parasm', params)
//     params.dirId = dirId.value
//     return params
//   },
// });

/**
 * 添加树
 */
function addTree(treeItem?) {
  let params = {
    parentId: null,
  }
  if (treeItem) {
    params.parentId = treeItem.id
  }
  openModal(true, params)
}

/**
 * 编辑树
 */
function editTree(treeItem?) {
  let params = {
    id: null,
    parentId: null,
    dirName: null,
  }
  params.id = treeItem ? treeItem.id : treeTitle.value.id
  params.parentId = treeItem ? treeItem.parentId : treeTitle.value.parentId
  params.dirName = treeItem ? treeItem.dirName : treeTitle.value.dirName
  openModal(true, params)
}

/**
 * 删除树
 */
async function delTree(treeItem) {
  let params = {
    dirId: null,
  }
  params.dirId = treeItem ? treeItem.id : treeTitle.id
  createConfirm({
    title: '删除',
    content: `确定要删除这个目录吗？`,
    iconType: 'warning',
    onOk: async () => {
      await deleteDir(params)
      reloadTree()
    }
  });
}
/**
 * 点击树
 * @param treeItem
 */
function clickTree(treeItem) {
  dirId.value = treeItem.id
}

watch(
  () => dirId.value,
  () => {
    console.log('触发了dirid变化', dirId.value)
    getForm().resetFields()
    // reloadTable()
  }
)

/**
 * 添加报告文件
 */
function addFile() {
  openReportModal(true, {
    dirId: dirId.value,
  })
}

/**
 * 导出所选项
 */
function exportSelect() {
  let days = dayjs().format('YYYYMMDD')
  exportMethod(downloadBatch, `评价报告-${days}.zip` , {storageIds: unref(selectedRowKeys).join(',')})
}
/**
 * 操作栏
 */
function getTableAction(record): ActionItem[] {
  return [
    {
      label: '预览',
      onClick: () => {
        openPreviewModal(true, {...record})
      },
      // ifShow: () => {
      //   return record.auditStatus == '0' && record.transferStatus == '0'
      // },
    },
    {
      label: '编辑',
      color: 'warning',
      onClick: () => {
        openReportModal(true, {
          dirId: dirId.value,
          ...record
        })
      },
      auth: 'evaluationReport:upload',
      ifShow: () => {
        return record.isSend == '0'
      },
    },
  ];
}
/**
 * 下拉操作栏
 */
function getDropDownAction(record): ActionItem[] {
  return [
    {
      label: '分发',
      onClick: () => {
        openDistributionModal(true, {
          dirId: dirId.value,
          ...record
        })
      },
      auth: 'evaluationReport:upload',
    },
    {
      label: '删除',
      color: 'error',
      popConfirm: {
        title: '是否确认删除',
        confirm: async () => {
          await deleteStorage({
            dirStorageId: record.dirStorageId
          })
          await reloadTable()
        },
      },
      auth: 'evaluationReport:upload',
      ifShow: () => {
        return record.isSend == '0'
      },
    },
  ];
}
// function reloadList() {
//   reloadTree()
// }
</script>

<style lang="less" scoped>
.report {
  display: flex;

  .left {
    width: 30%;
    padding-top: 10px;
    background-color: white;
    border-right: 1px solid #ECECEC;
    box-sizing: border-box;
    /deep/ .jeecg-basic-table {
      .ant-table-wrapper {
        padding: 0;
      }
      tr {
        th,td {
          // padding: 0;
          padding: 0 19px;
          display:flex;
          align-items: center;
        }
        th {
          background: #4476F7;
        }
        td:has(.selected),
        td:has(.selected)~td {
          background-color: #ECF0FF;
        }
        &.ant-table-row-level-0 {
          .treeItem {
            font-weight: bold;
          }
        }
      }

    }
    .treeName {
      height: 40px;
      width: 100%;
      // padding: 0 19px;
      box-sizing: border-box;
      line-height: 40px;
      font-size: 14px;
      text-align: left;
      overflow: hidden;
      color: white;
      span {
        float: left;
        font-weight: bold;
      }

      .editIcon,
      .plusIcon {
        color: white;
        font-size: 14px;
        float: right;
        cursor: pointer;
        margin:  10px;
        display: none;
      }
    }

    .treeName:hover>* {
      display: block;
    }

    .treeItem {
      width: 100%;
      &.selected {
        color: #1890ff;
      }
      height: 40px;
      line-height: 40px;
      text-align: left;
      cursor: pointer;
      overflow: hidden;
      color: #666666;
      .editIcon,
      .deleteIcon,
      .plusIcon {
        color: #1790FF;
        font-size: 15px;
        float: right;
        cursor: pointer;
        margin: 10px;
        // margin-top: 2px;
        // margin-right: 10px;
        display: none;
      }

      &:hover {
        .editIcon,
        .deleteIcon,
        .plusIcon {
          display: block;
        }
      }
      .plusIcon {
        margin-right: 10px;
      }

      .editIcon {
        margin-right: 10px;
      }

      .deleteIcon {
        color: red;
        margin-right: 10px;
      }
    }
  }

  .right {
    width: 70%;
    background-color: white;
    // padding: 10px;
    box-sizing: border-box;
    &:nth-child(1) {
      width: 100%;
    }
  }
}
</style>