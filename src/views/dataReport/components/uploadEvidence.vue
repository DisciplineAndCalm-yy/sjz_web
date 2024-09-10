<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-26 16:18:08
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-19 14:32:37
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\components\combination.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicModal @register="registerModal" v-bind="$attrs" :title="title" width="40%" :useWrapper="false"
    :canFullscreen="false"  @ok="handleSubmit" :showOkBtn="!disabled">
    <BasicForm @register="registerForm">
      <template #evidenceType="{model,field}">
        <a-select :options="evidenceTypeList" v-model:value="model[field]" :disabled="disabled" placeholder="请选择类型"></a-select>
      </template>
      <template #evidence="{model, field}">
        <BasicTable v-show="model.evidenceType == '2'" @register="registerTable">
          <template #bodyCell="{ record, column, text, index }">
            <span v-if="!disabled" class="input-btn" @click="showModal(record, column.dataIndex)">{{ text && text.length ? '已上传' : '上传佐证' }}</span>
            <span v-else class="input-btn" @click="showModal(record, column.dataIndex)">查看佐证</span>
          </template>
        </BasicTable>
      </template>
    </BasicForm>
  </BasicModal>
  <!-- <a-modal v-model:visible="modalVisible" title="查看佐证">

  </a-modal> -->
  <JUploadModal @register="registerModel" v-model:value="fileValue.value" @success="uploadModalSuccess"></JUploadModal>
</template>

<script lang="ts" setup>
import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
import { reactive, computed, nextTick, ref  } from 'vue';
import { BasicForm, useForm, FormSchema, } from '/@/components/Form/index';
import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
import { JUploadModal } from '/@/components/Form/src/jeecg/components/JUpload';

// 声明Emits
const emit = defineEmits(['success', 'register']);

const evidenceTypeList = ref([
  { value: '1', label: '统一上传佐证' },
  { value: '2', label: '单独上传佐证' },
])
const formSchema: FormSchema[] = [
  {
    label: '类型',
    field: 'evidenceType',
    component: 'Select',
    required: true,
    // componentProps: {
    //   options: evidenceTypeList.value
    // },
    // dynamicDisabled: () => {
    //   return disabled.value
    // },
    slot: 'evidenceType',
  },
  {
    label: '上传佐证',
    field: 'evidence',
    component: 'JUpload',
    componentProps: {
      bizPath: 'storage',
      maxCount: 5,
      returnUrl: false,
      multiple: false,
      maxSize: 20,
    },
    required: true,
    ifShow: ({values}) => {
      return values.evidenceType == '1'
    },
    dynamicDisabled: () => {
      return disabled.value
    }
  },
  {
    label: '',
    component: 'Input',
    field: 'evidence',
    colSlot: 'evidence',
    // ifShow: ({values}) => {
    //   return values.evidenceType == '2'
    // }
  }
]

const fileValue = reactive({
  value: undefined,
  dataIndex: '',
})

// const formData = ref({})
const title = ref('上传佐证')
//表单配置
const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
  // layout: 'vertical',
  schemas: formSchema,
  showActionButtonGroup: false,
  // labelCol: {
  //   offset: 2,
  // },          
  // wrapperCol: {
  //   offset: 2,
  //   sm: 20,
  // }
});

const [registerModel, { openModal }] = useModal();

const dataSource = ref([{}])

const nowRecord = ref()

const disabled = ref(false)



// 声明表格调用
const [registerTable, { reload, setTableData, setColumns, updateTableData, getDataSource}] = useTable({
  // dataSource: dataSource,
  immediate: false,
  showActionColumn: false,
  showIndexColumn: false,
  useSearchForm: false,
  pagination: false,
  showTableSetting: false,
  autoCreateKey: false,
});

// 弹框配置
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data)=>{
  await resetFields();
  setModalProps({ confirmLoading: false });
  let {record, columns, readonly } = data
  let dataSource = [{}]
  console.log('record', record)
  console.log('columns', columns)
  nowRecord.value = record
  disabled.value = !!readonly
  if (disabled.value) {
    title.value = '查看佐证'
  } else {
    title.value = '上传佐证'
  }
  setColumns(columns)
  // 区分是同级报送和下级报送，下级报送只有单独上传
  if (record.departType == '2') {
    evidenceTypeList.value = [{ value: '2', label: '单独上传佐证' },]
  } else {
    evidenceTypeList.value = [
      { value: '1', label: '统一上传佐证' },
      { value: '2', label: '单独上传佐证' },
    ]
  }
  // 单独上传和统一上传
  if (record.evidenceType == '1') {
    dataSource = [{}]
  } else if (record.evidenceType == '2') {
    let evidenceObj = {}
    if (record.evidence && record.evidence.length) {
      record.evidence.forEach(item => {
        evidenceObj[item.departId] = item.attachments
      });
    }
    dataSource = [{...evidenceObj}]
    record.evidence = []
  }
  console.log('init datasource', dataSource)
  await setFieldsValue({ ...record });
  setTableData(dataSource)
});

// 展示上传弹框
function showModal(record, dataIndex) {
  console.log('dataIndex', dataIndex)
  fileValue.value = record[dataIndex]
  fileValue.dataIndex = dataIndex
  openModal(true, {
    bizPath: 'storage',
    maxCount: 5,
    returnUrl: false,
    multiple: false,
    maxSize: 20,
    disabled: disabled.value,
  })
}

function uploadModalSuccess() {
  console.log('file-change leeeee ma?', fileValue.value)
  updateTableData(0, fileValue.dataIndex, fileValue.value)
}

//弹框确认
function handleSubmit() {
  validate().then( async () => {
    try {
      const values = await getFieldsValue();
      console.log('values', values)
      if (values.evidenceType == '1') {
        nowRecord.value = {
          ...nowRecord.value,
          evidenceType: values.evidenceType,
          evidence: values.evidence,
        }
      } else if (values.evidenceType == '2') {
        let dataSource = getDataSource()
        let evidenceObj = dataSource[0] || {}
        // console.log('datsouce0', dataSource)
        let evidence: any[] = []
        console.log('evidenceobjg',evidenceObj)
        let keys = Object.keys(evidenceObj)
        console.log('keys',keys)
        for (let i of keys) {
          evidence.push({
            departId: i,
            attachments: evidenceObj[i]
          })
        }
        nowRecord.value = {
          ...nowRecord.value,
          evidenceType: values.evidenceType,
          evidence
        }
      }
      setModalProps({ confirmLoading: true });
      emit('success', nowRecord.value);
      nowRecord.value = {}
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  })
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
.input-box {
  // background: yellow;
  display: flex;
  justify-content: space-around;
  > * {
    max-width: 300px;
  }
}
</style>