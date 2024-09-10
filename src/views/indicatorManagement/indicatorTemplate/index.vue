<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-20 17:22:21
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-10-23 14:19:29
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicTable @register="registerTable" :rowSelection="rowSelection">
    <template #tableTitle>
      <a-button type="primary" preIcon="ant-design:plus-outlined" 
        @click="router.push({ path: '/indicatorManagement/indicatorTemplate/build' })">新建指标体系</a-button>
      <a-button type="primary" ghost @click="toCopy" :disabled="selectedRows.length != 1" title="可勾选任意一个指标体系进行复制">复制</a-button>
      <!-- selectedRows: {{ selectedRows }} -->
    </template>
    <!--操作栏-->
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <!-- 复制弹框 -->
  <a-modal v-model:visible="visible" title="复制" @ok="onSubmit" @cancel="resetFields">
    <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
      <a-form-item label="原指标体系名称">
        <a-input v-model:value="modelRef.sourceTemplateName" readonly />
      </a-form-item>
      <a-form-item label="新指标体系名称" v-bind="validateInfos.templateName">
        <a-input v-model:value="modelRef.templateName" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
  
<script lang="ts" setup>
import { ref, reactive, toRaw, computed } from 'vue';
import { Form } from 'ant-design-vue';
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useModal } from '/@/components/Modal';
import { useListPage } from '/@/hooks/system/useListPage';
import { columns, searchFormSchema, currentAuditStatus } from './index.data';
import { useRoute, useRouter } from 'vue-router';
import { indicatorTemplateList, indicatorTemplateDel, copyTemplate } from '/@/api/indicatorManagement/index'

//   声明路由
const router = useRouter()
const useForm = Form.useForm;
const visible = ref<boolean>(false);


// 列表页面公共参数、方法
const { tableContext } = useListPage({
  tableProps: {
    title: '指标体系列表',
    api: indicatorTemplateList,
    columns: columns,
    striped:true,//斑马纹设置
    size: 'small',
    scroll: { x: 1300 },
    formConfig: {
      labelWidth: 150,
      schemas: searchFormSchema,
      showAdvancedButton: false,
      fieldMapToTime: [
        ['updateDate', ['startDate', 'endDate'], 'YYYY-MM-DD']
      ],
      resetFunc: async () => {
        // currentAuditStatus.value = 0
      },
    },
    actionColumn: {
      width: 120,
      fixed: 'right'
    },
    rowKey: 'id',
    rowSelection: {
      // preserveSelectedRowKeys: false,
    },
    // 请求之前对参数做处理
    beforeFetch(params) {
      console.log('params', params)
    },
  },
});


//注册table数据
const [registerTable, { reload, clearSelectedRowKeys, getSelectRowKeys, setColumns, getForm }, { rowSelection, selectedRows, selectedRowKeys }] = tableContext;


/**
 * 操作栏
 */
function getTableAction(record): ActionItem[] {
  return [
    {
      label: '编辑',
      color: 'warning',
      onClick: toNextPage.bind(null, record),
      
    },
    {
      label: '删除',
      color: 'error',
      popConfirm: {
        title: '是否确认删除？',
        confirm: handleDelete.bind(null, record),
      },
    },
  ];
}



// 方法
const toNextPage = (record) => {
  router.push({ path: '/indicatorManagement/indicatorTemplate/build', query: { id: record.id, name: record.name, description: record.description } })
};

/**
   * 删除事件
   */
async function handleDelete(record) {
  await indicatorTemplateDel({ id: record.id }).then(res => {
    reload()
    clearSelectedRowKeys()
  })
}

//复制
const toCopy = () => {
  console.log(selectedRows.value)
  visible.value = true;
  modelRef.id = selectedRows.value[0].id
  modelRef.sourceTemplateName = selectedRows.value[0].name
}

const modelRef = reactive({
  id: "",
  sourceTemplateName: '',
  templateName: '',
});
const rulesRef = reactive({
  templateName: [
    {
      required: true,
      message: '请输入',
    },
  ],
});
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef, {
  onValidate: (...args) => console.log(...args),
});

// 选中行
const selectedkeys = computed(() => {
  return getSelectRowKeys()
});

//提交
const onSubmit = () => {
  validate()
    .then(() => {
      // delete modelRef.sourceTemplateName
      copyTemplate(modelRef).then(res => {
        visible.value = false
        reload()
      })
    })
    .catch(err => {
      console.log('error', err);
    });
};

</script>
  
<style lang="less" scoped></style>