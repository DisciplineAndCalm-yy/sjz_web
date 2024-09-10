<template>
  <div>
    <div class="statistic">
      <a-card style="padding: 0; margin: 0" title="诉求统计周期">
        <template #extra>
          <a-date-picker
            v-model:value="statisticYear"
            style="width: 250px"
            picker="year"
            placeholder="请选择统计年份"
            :allow-clear="false"
            @change="statisticYearChange"
          />
        </template>
        <a-spin :spinning="statisticLoading">
          <a-row>
            <a-col :span="6">
              <a-statistic title="已收集诉求" :value="statisticData.totalAppeal" style="margin-right: 50px">
                <template #prefix>
                  <StarOutlined />
                </template>
              </a-statistic>
            </a-col>
            <a-col :span="6">
              <a-statistic title="下载二维码次数" :value="statisticData.totalTimes">
                <template #prefix>
                  <CloudDownloadOutlined />
                </template>
              </a-statistic>
            </a-col>
            <a-col :span="6">
              <a-statistic title="链接">
                <template #prefix>
                  <LinkOutlined />
                </template>
                <template #formatter>
                  <div class="url_box">
                    <a :href="statisticData.url" :title="statisticData.url" target="_blank" style="font-size: 15px">
                      {{ statisticData.url }}
                    </a>
                  </div>
                </template>
              </a-statistic>
            </a-col>
            <a-col :span="6">
              <a-statistic title="二维码">
                <template #formatter>
                  <div v-if="statisticData.url" style="display: flex; align-items: flex-end">
                    <vue-qr :text="statisticData.url" :size="100" :margin="0" ref="qrRef" />
                    <a style="text-align: right; font-size: 14px" download="诉求问卷1.png" :href="statisticData.qrSrc" @click="downloadQr"> 下载 </a>
                  </div>
                </template>
              </a-statistic>
            </a-col>
          </a-row>
        </a-spin>
      </a-card>
    </div>
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle>
        <a-button type="primary" :loading="exportLoading" @click="exportData">导出</a-button>
      </template>
      <template #bodyCell="{ record, column }">
        <!-- 状态 -->
        <template v-if="column.dataIndex === 'status'">
          <div
            :style="{
              width: '70px',
              height: '32px',
              backgroundColor: record.status === 1 ? '#BEBEBE' : '#fe9923',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '4px',
              margin: '0 auto',
              color: 'white',
            }"
          >
            {{ record.status === 1 ? '已完成' : '进行中' }}
          </div>
        </template>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>

    <!-- 详情 -->
    <a-modal width="600px" v-model:visible="detailModal" :destroyOnClose="true">
      <template #title>
        <span class="modal_title">诉求</span>
      </template>
      <template #footer> <a-button type="primary" @click="detailModal = false">关闭</a-button> </template>
      <a-spin :spinning="detailLoading">
        <a-descriptions bordered :labelStyle="{ width: '140px' }">
          <a-descriptions-item :span="3" label="企业名称">{{ detailData.entName }}</a-descriptions-item>
          <a-descriptions-item :span="3" label="企业联系人">{{ detailData.entContacts }}</a-descriptions-item>
          <a-descriptions-item :span="3" label="企业联系电话">{{ detailData.entContactsPhone }}</a-descriptions-item>
          <a-descriptions-item :span="3" label="问题描述"> {{ detailData.description }} </a-descriptions-item>
        </a-descriptions>
      </a-spin>
    </a-modal>

    <!-- 添加处置结果 -->
    <a-modal
      width="500px"
      v-model:visible="showAddResultModal"
      :destroyOnClose="true"
      :confirmLoading="addResultLoading"
      @ok="addResult"
      @cancel="Object.keys(addResultForm).forEach((item) => (addResultForm[item] = undefined))"
    >
      <template #title>
        <span class="modal_title">添加处置结果</span>
      </template>
      <a-form
        ref="addResultFormRef"
        name="addResultForm"
        :model="addResultForm"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 15 }"
        style="margin-top: 10px"
      >
        <a-form-item label="处置状态" name="status">
          {{ addResultForm.status }}
        </a-form-item>
        <a-form-item label="处置区县" name="districtId" :rules="[{ required: true, message: '请选择处置区县' }]">
          <a-select v-model:value="addResultForm.districtId" placeholder="请选择">
            <a-select-option v-for="(item, key) in districtList" :key="key" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="处置部门" name="departName" :rules="[{ required: true, message: '请选择处置区县' }]">
          <a-input ref="departRef" v-model:value="addResultForm.departName" placeholder="请选择" @click="openAddResultModal" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 选择处置部门 -->
    <a-modal width="800px" v-model:visible="showDepartModal" :destroyOnClose="true" @ok="departSelOk" @cancel="departTableSel = []">
      <template #title>
        <span class="modal_title">选择处置部门</span>
      </template>
      <a-button type="primary" style="margin: 5px 15px" @click="openDepartModal({ type: 'add' })">添加处置部门</a-button>
      <a-table
        style="margin: 0 6px"
        bordered
        rowKey="id"
        :scroll="{ y: '400px' }"
        :loading="departListLoading"
        :pagination="false"
        :row-selection="{ type: 'radio', onChange: (keys, record) => (departTableSel = record) }"
        :dataSource="departTableData"
        :columns="[
          {
            title: '部门名称',
            dataIndex: 'name',
          },
          {
            width: '160px',
            title: '操作',
            dataIndex: 'operate',
          },
        ]"
      >
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'operate'">
            <a-button type="link" @click="openDepartModal({ type: 'edit', record })">编辑</a-button>
            <a-popconfirm title="确定删除吗？" @confirm="delDepart(record)">
              <a-button type="link">删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-modal>

    <!-- 添加处置部门 -->
    <a-modal
      width="500px"
      v-model:visible="showOperateDepartModal"
      :confirmLoading="addDepartLoading"
      :destroyOnClose="true"
      @ok="operateDepart"
      @cancel="Object.keys(addDepartForm).forEach((item) => (addDepartForm[item] = ''))"
    >
      <template #title>
        <span class="modal_title">{{ `${operateDepartType === 'add' ? '添加' : '编辑'}处置部门` }}</span>
      </template>
      <a-form
        ref="addDepartFormRef"
        name="addDepartForm"
        :model="addDepartForm"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 15 }"
        style="margin-top: 10px"
      >
        <a-form-item label="处置部门名称" name="departName" :rules="[{ required: true, message: '请输入处置部门名称' }]">
          <a-input
            v-model:value="addDepartForm.departName"
            placeholder="请选择"
            @input="(value) => (addDepartForm.departName = addDepartForm.departName.replace(/\s/g, ''))"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import vueQr from 'vue-qr/src/packages/vue-qr.vue';
  import dayjs from 'dayjs';
  import { ref, onMounted } from 'vue';
  import { downloadByData } from '/@/utils/file/download';
  import { StarOutlined, CloudDownloadOutlined, LinkOutlined } from '@ant-design/icons-vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useIndexData } from './useIndexData';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { question_getMobileUrl } from '/@/api/enterpriseAppeal/index';
  import {
    appeal_getAppealList,
    appeal_exportForm,
    appeal_getCountInfo,
    appeal_getDistrictList,
    appeal_getDepartList,
    appeal_addDepart,
    appeal_deleteDepart,
    appeal_getAppealDetail,
    appeal_addDownloadTime,
    appeal_processAppeal,
    appeal_updateDepartName,
  } from '/@/api/enterpriseAppeal/appeal.ts';

  const { createMessage } = useMessage();
  const { columns, searchFormSchema } = useIndexData();

  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    tableProps: {
      title: '诉求列表',
      api: appeal_getAppealList,
      columns: columns,
      size: 'small',
      scroll: { x: 1300 },
      showTableSetting: false,
      rowKey: 'id',
      formConfig: {
        labelWidth: 150,
        schemas: searchFormSchema,
        showAdvancedButton: false,
        // fieldMapToTime: [['updateDate', ['startDate', 'endDate'], 'YYYY-MM-DD']],
      },
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
      beforeFetch: (params) => {
        params.year = dayjs(statisticYear.value).year();
      },
    },
  });
  const [registerTable, { reload, getForm }, { rowSelection, selectedRows }] = tableContext;
  //操作栏
  const getTableAction = (record) => [
    {
      label: '详情',
      onClick: async () => {
        try {
          detailModal.value = true;
          detailLoading.value = true;
          const res = await appeal_getAppealDetail({ id: record.id });
          detailData.value = res;
          detailLoading.value = false;
        } catch (error) {
          detailLoading.value = false;
        }
      },
    },
    {
      label: '添加处置结果',
      onClick: async () => {
        addResultForm.value = {
          status: record.status === 1 ? '已完成' : '进行中',
          districtId: record.disposeDistrictId || undefined,
          departId: record.disposeDepartId || undefined,
          departName: record.depart || undefined,
          id: record.id,
        };
        showAddResultModal.value = true;

        const districtRes = await appeal_getDistrictList();
        districtList.value = districtRes;
      },
    },
  ];

  //统计年份
  const statisticYear = ref('');
  const statisticYearChange = () => {
    getStatisticvData();
    reload();
  };

  // 导出loading
  const exportLoading = ref(false);
  //导出
  const exportData = async () => {
    try {
      exportLoading.value = true;
      const res = await appeal_exportForm({
        ...getForm().getFieldsValue(),
        year: dayjs(statisticYear.value).year(),
        ids: selectedRows.value.length ? selectedRows.value.map((item) => item.id).join(',') : '',
      });
      downloadByData(res, '诉求收集.xlsx');
      exportLoading.value = false;
    } catch (error: any) {
      exportLoading.value = false;
    }
  };

  // 统计模块loading
  const statisticLoading = ref(false);
  const qrRef = ref();
  const statisticData = ref({
    totalAppeal: 0,
    totalTimes: 0,
    url: '',
    qrSrc: '',
  });
  const getStatisticvData = async () => {
    try {
      statisticLoading.value = true;

      const res = await appeal_getCountInfo({ year: dayjs(statisticYear.value).year() });
      statisticData.value.totalAppeal = res.totalAppeal;
      statisticData.value.totalTimes = res.totalTimes;

      const mobileUrl = await question_getMobileUrl();
      statisticData.value.url = `${mobileUrl}?businessType=appeal`;
      // statisticData.value.url = `http://172.19.2.73:4500/?businessType=appeal`;

      statisticLoading.value = false;
    } catch (error) {
      statisticLoading.value = false;
    }
  };
  const downloadQr = async () => {
    try {
      statisticData.value.qrSrc = qrRef.value.$el.currentSrc;
      appeal_addDownloadTime();

      const res = await appeal_getCountInfo({ year: dayjs(statisticYear.value).year() });
      statisticData.value.totalAppeal = res.totalAppeal;
      statisticData.value.totalTimes = res.totalTimes;
    } catch (error) {
      throw new Error(error);
    }
  };

  // 详情modal
  const detailModal = ref(false);
  const detailLoading = ref(false);
  const detailData = ref({});

  // 处置结果modal
  const showAddResultModal = ref(false);
  const addResultFormRef = ref();
  const addResultLoading = ref(false);
  const districtList = ref([]);
  const departRef = ref();
  const addResultForm = ref({
    status: undefined,
    districtId: undefined,
    departId: undefined,
    departName: undefined,
    id: undefined,
  });
  // 开启部门选择弹窗
  const openAddResultModal = async () => {
    try {
      showDepartModal.value = true;
      departRef.value.blur();
      departListLoading.value = true;
      const departRes = await appeal_getDepartList();
      departTableData.value = departRes;
      departListLoading.value = false;
    } catch (error) {
      departListLoading.value = false;
    }
  };
  // 添加处置结果
  const addResult = async () => {
    try {
      await addResultFormRef.value.validate();
      addResultLoading.value = true;
      await appeal_processAppeal({
        departId: addResultForm.value.departId,
        districtId: addResultForm.value.districtId,
        id: addResultForm.value.id,
      });
      createMessage.success('操作成功');
      Object.keys(addResultForm.value).forEach((item) => (addResultForm.value[item] = undefined));
      reload();
      addResultLoading.value = false;
      showAddResultModal.value = false;
    } catch (error) {
      addResultLoading.value = false;
    }
  };

  // 选择部门modal
  const showDepartModal = ref(false);
  const departListLoading = ref(false);
  const departTableSel = ref([]);
  const departTableData = ref([]);
  const departSelOk = () => {
    if (departTableSel.value.length === 0) {
      createMessage.warn('当前未选中部门');
      return;
    }
    addResultForm.value.departId = departTableSel.value[0].id;
    addResultForm.value.departName = departTableSel.value[0].name;
    showDepartModal.value = false;
    departTableSel.value = [];
  };
  // 删除部门
  const delDepart = (record) => {
    return new Promise(async (resolve, reject) => {
      try {
        await appeal_deleteDepart({ id: record.id });
        createMessage.success('操作成功');
        resolve();

        departListLoading.value = true;
        const departRes = await appeal_getDepartList();
        departTableData.value = departRes;
        departListLoading.value = false;
      } catch (error) {
        departListLoading.value = false;
        reject();
      }
    });
  };

  const showOperateDepartModal = ref(false);
  const operateDepartType = ref('add');
  const addDepartFormRef = ref();
  const addDepartLoading = ref(false);
  const addDepartForm = ref({
    departName: '',
    id: '',
  });
  const openDepartModal = ({ type, record }) => {
    showOperateDepartModal.value = true;
    operateDepartType.value = type;
    if (type === 'edit') {
      addDepartForm.value.departName = record.name;
      addDepartForm.value.id = record.id;
    }
  };
  // 添加部门
  const operateDepart = async () => {
    try {
      await addDepartFormRef.value.validate();
      addDepartLoading.value = true;
      if (operateDepartType.value === 'add') {
        await appeal_addDepart({ name: addDepartForm.value.departName });
      } else {
        await appeal_updateDepartName({ name: addDepartForm.value.departName, id: addDepartForm.value.id });
      }
      createMessage.success('操作成功');
      Object.keys(addDepartForm.value).forEach((item) => (addDepartForm.value[item] = ''));
      addDepartLoading.value = false;
      showOperateDepartModal.value = false;
      openAddResultModal();
    } catch (error) {
      addDepartLoading.value = false;
    }
  };

  onMounted(() => {
    statisticYear.value = dayjs();
    getStatisticvData();
  });
</script>

<style lang="less" scoped>
  :deep(.ant-card-body) {
    padding: 12px 24px;
  }
  :deep(.ant-statistic-content) {
    display: flex;
    .ant-statistic-content-value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-right: 10px;
      .url_box {
        color: #4476f7;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .statistic {
    margin: 10px 10px 0 10px;
  }

  .modal_title {
    position: relative;
    margin-left: 10px;
    &::before {
      content: ' ';
      position: absolute;
      width: 4px;
      height: 15px;
      border-radius: 4px;
      background-color: #4476fa;
      left: -10px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
