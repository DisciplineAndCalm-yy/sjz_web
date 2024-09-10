<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-12-06 15:51:10
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-03-15 14:14:37
 * @FilePath: \yst-province-hebei-web\src\views\dataReport\components\detailList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <a-card :title="props.title" size="small">
    <BasicTable @register="register">
      <template #form-indicatorId="{ model, field }">
        <a-tree-select v-model:value="model[field]" placeholder="请选择指标" :tree-data="treeList" :fieldNames="{children:'children', label:'indicatorName', value: 'id' }" @change="changeTree(val)">
          <template #title="treeItem">
            <span>{{ treeItem.indicatorName }}</span>
          </template>
        </a-tree-select>
      </template>
      <template  #bodyCell="{ record, column, text, index }">
        <template v-if="column.dataIndex in record">
          <template v-if="column.dataIndex != 'description' && column.dataIndex != 'unit' && column.dataIndex != 'questionTypeText'">
            <template v-if="record.questionType == 'number'">
              <input-number :disabled="!!props.readonly" placeholder="请输入" size="small" v-model:value="record[column.dataIndex]"></input-number>
            </template>
            <template v-if="record.questionType == 'text'">
              <span v-if="!props.readonly" type="link" class="input-btn" :title="text" @click="changeValue(record, column.dataIndex)">{{ text || '请输入' }}</span>
              <span v-else class="input-btn" :title="text">{{ text }}</span>
            </template>
          </template>
        </template>
        <template v-else>
          <span>无需配置</span>
        </template>
      </template>
      <!--操作栏-->
      <template #action="{ record, index }">
        <TableAction :actions="getTableAction(record, index)" />
      </template>
    </BasicTable>
    <div class="btn-box">
      <a-button v-if="!props.readonly" type="primary" size="large" @click="handleSave">提交</a-button>
      <a-button type="primary" ghost size="large" @click="goBack">返回</a-button>
    </div>
    <a-modal :title="modalObj.title" v-model:visible="modalObj.open" @ok="handleOk" @cancel="handleCancel">
      <a-form style="margin-top: 10px;">
        <a-form-item label="内容" :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }">
          <InputNumber v-if="nowRecord.record.questionType == 'number'" placeholder="请输入数值" v-model:value="modalObj.value"></InputNumber>
          <a-textarea v-if="nowRecord.record.questionType == 'text'" placeholder="请输入文本" v-model:value="modalObj.value"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
    <uploadEvidence @register="registerModal" @success="saveEvidence"></uploadEvidence>
  </a-card>
</template>

<script lang="ts" setup>
import { reactive, computed, nextTick, ref  } from 'vue';
import { queryOpenIndicatorTree, querySendQuestionList, submitSendAnswer, fillAnswerQuerySendQuestionList, fillAnswerQueryOpenIndicatorTree } from '/@/api/dataReport/index'
import { BasicTable, TableAction, ActionItem, BasicColumn, useTable, FormSchema } from '/@/components/Table';
import { useModal } from '/@/components/Modal';
import { InputNumber } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import uploadEvidence from './uploadEvidence.vue'
import { json } from 'stream/consumers';

const props = withDefaults(
  defineProps<{
    title?: string;
    pid: string;
    readonly?: number | string,
    type: string
  }>(), {
    title: '数据报送',
    type: 'reporter'
  }
)
const router = useRouter()

const treeList = ref([])
let basicColumns: BasicColumn[]  = [
  {
    title: '指标项说明',
    dataIndex: 'description',
    width: 240,
    fixed: 'left',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 150,
    fixed: 'left',
  },
  {
    title: '指标类型',
    dataIndex: 'questionTypeText',
    width: 150,
    fixed: 'left',
  },
]
const modalObj = reactive({
  title: '请输入',
  open: false,
  value: undefined,
})
const nowRecord = reactive({
  record: undefined,
  dataIndex: undefined,
})

const uploadIndex = ref()

const searchFormSchema: FormSchema[] = [
  {
    label: '选择指标',
    field: 'indicatorId',
    component: 'TreeSelect',
    slot: 'indicatorId',
    colProps: { span: 12 },
    // componentProps: {
    //   showCheckedStrategy: 'TreeSelect.SHOW_CHILD',
    //   treeData: treeList.value
    // }
  },
]

// 注册列表
const [register,  { reload, setProps, getDataSource, updateTableData, setColumns, getRawDataSource, getForm }] = useTable({
  api: props.type == 'reporter' ? fillAnswerQuerySendQuestionList : querySendQuestionList,
  immediate: false,
  // columns: columns,
  rowKey: 'id',
  showIndexColumn: false,
  showActionColumn: true,
  useSearchForm: true,
  fetchSetting: {
    listField: 'datasource'
  },
  scroll: { y: 300},
  formConfig: {
    labelWidth: 150,
    schemas: searchFormSchema,
    showAdvancedButton: false,
    showResetButton: false,
    showSubmitButton: false,
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
    title: '操作',
    width: 120,
    fixed: 'right',
    slots: { customRender: 'action' },
  },
  beforeFetch(params) {
    
  },
  afterFetch(data) {
    let rawData = getRawDataSource()
    let columns = [...basicColumns,...rawData.columns]
    setColumns(columns)
  }
});

const [registerModal, {openModal}] = useModal()

/**
 * 树更改
 * @param val 
 */
async function changeTree(val) {
  await reload()
}

/**
 * 操作栏
 */
 function getTableAction(record, index): ActionItem[] {
  let label = !props.readonly ? '上传佐证': '查看佐证'
  return [
    {
      label: label,
      onClick: () => {
        let rawData = getRawDataSource()
        console.log('rawdata', rawData)
        uploadIndex.value = index
        console.log('record', record)
        openModal(true, {
          record: JSON.parse(JSON.stringify(record)),
          columns: rawData.columns,
          readonly: props.readonly
        })
      },
      ifShow: () => {
        return record.evidenceFlag == '1' && ((props.readonly && record.evidenceType) || !props.readonly)
      },
    }
  ];
}

/**
 * 填报数值
 */
function changeValue(record, dataIndex) {
  modalObj.open = true
  modalObj.value = record[dataIndex]
  nowRecord.record = record
  nowRecord.dataIndex = dataIndex
}

function handleOk() {
  nowRecord.record[nowRecord.dataIndex] = modalObj.value
  modalObj.open = false
  modalObj.value = undefined
}

function handleCancel() {
  modalObj.open = false
  modalObj.value = undefined
}

function saveEvidence(data) {
  console.log('保存了evidence', data, uploadIndex.value)
  updateTableData(uploadIndex.value, 'evidenceType', data.evidenceType)
  updateTableData(uploadIndex.value, 'evidence', data.evidence)
}

async function initData() {
  treeList.value = props.type == 'reporter' ?  await fillAnswerQueryOpenIndicatorTree({id: props.pid}) :await queryOpenIndicatorTree({id : props.pid})
}

initData()


async function handleSave() {
  let dataSource = getDataSource()
  let formValue = getForm().getFieldsValue()
  console.log('datsource', dataSource)
  let param = {
    indicatorId: formValue.indicatorId,
    answerJson: JSON.stringify(dataSource)
  }
  await submitSendAnswer(param)
  treeList.value = props.type == 'reporter' ?  await fillAnswerQueryOpenIndicatorTree({id: props.pid}) :await queryOpenIndicatorTree({id : props.pid})
  await reload()
}

function goBack() {
  router.go(-1)
}

</script>

<style lang="less" scoped>
.input-btn {
  cursor: pointer;
  color: #1890ff;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btn-box {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  button {
    margin-right: 20px;
  }
}
/deep/ .ant-table-thead {
  .ant-table-cell {
    font-weight: bold;
  }
}
</style>