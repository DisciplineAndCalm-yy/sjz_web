<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-23 16:30:17
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-12-06 11:00:51
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\preview.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <!-- <a-table
      ref="table"
      :columns="columns"
      :dataSource="dataSource"
    >

    </a-table> -->
    <BasicTable @register="register">
      <template v-slot:bodyCell="{ column, record, text }">
        <template v-if="column.dataIndex == 'configTypeDesc'">
          <a @click="showConfig(record)">{{ text }}</a>
        </template>
      </template>
    </BasicTable>
    <div class="btn-box">
      <a-button type="primary" ghost size="large" @click="goBack">返回</a-button>
    </div>
    <configModal @register="registerModal" :disabled="true" modalType="indicator"></configModal>
  </div>
</template>

<script lang="ts" setup>
  import {ref, reactive } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { BasicTable, BasicColumn, useTable} from '/@/components/Table';
  import { templateWeightPreview } from '/@/api/indicatorManagement/index'
  import { useModal } from '/@/components/Modal';
  import configModal from './components/configModal.vue'
  const router = useRouter()
  const route = useRoute()

  const columns: BasicColumn[] = [
    {
      title: '指标名称',
      dataIndex: 'indicatorName',
      width: 120,
    },
    {
      title: '指标项说明',
      dataIndex: 'description',
      width: 120,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      width: 120,
    },
    {
      title: '指标类型',
      dataIndex: 'questionType',
      width: 120,
    },
    {
      title: '计分方法',
      dataIndex: 'configTypeDesc',
      width: 120,
    },
    {
      title: '权重',
      dataIndex: 'weightValue',
      width: 120,
    },
  ]
  // const dataSource = ref([])

  
  // 注册列表
  const [register,  { reload, setProps, getRawDataSource }] = useTable({
    api: templateWeightPreview,
    columns: columns,
striped:true,//斑马纹设置
    showIndexColumn: false,
    // dataSource: dataSource,
    actionColumn: null,
    useSearchForm: false,
    formConfig: undefined,
    showTableSetting: false,
    beforeFetch: (params) => {
      params.templateId = route.query.templateId
    }
  });

  const [registerModal, { openModal} ] = useModal()

  function showConfig(record) {
    if (record.configType) {
      openModal(true, record)
    }
  }

  function goBack() {
    // router.push({
    //   path: '/indicatorManagement/indicatorAlgorithmConfiguration'
    // })
    router.go(-1)
  }
</script>

<style lang="less" scoped>
.btn-box {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>