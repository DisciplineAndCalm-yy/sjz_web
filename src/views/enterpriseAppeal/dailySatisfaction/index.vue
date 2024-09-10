<template>
  <div>
    <div class="chart">
      <div class="chart_left chart_box">
        <div class="title_box">
          <div class="title">满意度统计</div>
          <div class="func">
            <span>选择时间:</span>
            <a-cascader
              v-model:value="satisfactionDate"
              :options="chartDateOptions"
              placeholder="请选择日期"
              change-on-select
              :allowClear="false"
              @change="getStatisticsData(1)"
            />
          </div>
        </div>
        <div class="chart_render">
          <Pie height="280px" :option="satisfaction_chartOptions" :chartData="satisfaction_chartData" />
        </div>
      </div>

      <div class="chart_right chart_box">
        <div class="title_box">
          <div class="title">填报数量TOP5</div>
          <div class="func">
            <span>选择时间:</span>
            <a-cascader
              v-model:value="fillingRateDate"
              :options="chartDateOptions"
              placeholder="请选择日期"
              change-on-select
              :allowClear="false"
              @change="getStatisticsData(2)"
            />
          </div>
        </div>
        <div class="chart_render">
          <Bar v-if="fillingRate_chartData.length" height="280px" :option="fillingRate_options" :chartData="fillingRate_chartData" />
          <a-empty v-else />
        </div>
      </div>
    </div>

    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle>
        <a-button type="primary" @click="showCreateDialog = true">新建</a-button>
        <a-button type="primary" :loading="exportLoading" @click="exportData">导出</a-button>
      </template>
      <template #bodyCell="{ record, column }">
        <!-- 填报份数/目标份数 -->
        <template v-if="column.dataIndex === 'num'">
          <span :style="{ color: record.completedCount === record.sampleSize ? 'black' : '#999999' }">{{ record.completedCount }}</span>
          <span style="color: black">/{{ record.sampleSize }}</span>
        </template>
        <!-- 状态 -->
        <template v-if="column.dataIndex === 'status'">
          <div
            :style="{
              width: '70px',
              height: '32px',
              backgroundColor: record.status === 1 ? '#fe9923' : record.status === 2 ? '#4476FA' : record.status === 3 ? '#BEBEBE' : 'black',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '4px',
              margin: '0 auto',
              color: 'white',
            }"
          >
            {{ record.statusName }}
          </div>
        </template>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>

    <!-- 新建modal -->
    <a-modal
      v-model:visible="showCreateDialog"
      :destroyOnClose="true"
      :confirmLoading="createLoading"
      @ok="create"
      @cancel="Object.keys(createForm).forEach((item) => (createForm[item] = ''))"
    >
      <template #title>
        <span class="modal_title">新建</span>
      </template>
      <a-form ref="createFormRef" :model="createForm" name="createForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 15 }" style="margin-top: 10px">
        <a-form-item label="问卷名称" name="name" :rules="[{ required: true, message: '请输入问卷名称' }]">
          <a-input v-model:value="createForm.name" placeholder="请输入" />
        </a-form-item>

        <a-form-item label="目标样本量" name="sampleSize" :rules="[{ required: true, message: '请输入目标样本量' }]">
          <a-input
            v-model:value="createForm.sampleSize"
            placeholder="请输入"
            @input="createForm.sampleSize = createForm.sampleSize.replace(/\D/g, '')"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 查看问卷modal -->
    <a-modal
      v-model:visible="showQuestionViewModal"
      width="600px"
      :destroyOnClose="true"
      :confirmLoading="relaunchLoading"
      cancelText="关闭"
      okText="再次发起问卷"
      @ok="relaunch"
    >
      <template #title>
        <span class="modal_title">问卷</span>
      </template>
      <questionView :formKey="questionViewFormKey" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, Ref, onMounted } from 'vue';
  import moment from 'moment';
  import { BasicTable, TableAction } from '/@/components/Table';
  import Pie from '/@/components/chart/Pie.vue';
  import Bar from '/@/components/chart/Bar.vue';
  import questionView from './questionView.vue';
  import { divide, floor } from 'lodash-es';
  import { downloadByData } from '/@/utils/file/download';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useRouter } from 'vue-router';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    question_create,
    question_get,
    question_delete,
    question_publish,
    question_stop,
    question_copyForm,
    question_statistics_satisfaction,
    question_statistics_area,
    question_exportForm,
  } from '/@/api/enterpriseAppeal/index';
  import { useIndexData } from './useIndexData';

  const { createMessage } = useMessage();
  const { columns, searchFormSchema, chartDateOptions, satisfaction_chartOptions, fillingRate_options } = useIndexData();
  const router = useRouter();

  // 满意度统计时间
  const satisfactionDate = ref(['']);
  // 填报率时间
  const fillingRateDate = ref(['']);
  // 初始化满意度统计/填报率时间
  const setDefaultDate = () => {
    const year = moment().format('YYYY');
    satisfactionDate.value = [year];
    fillingRateDate.value = [year];
  };
  // 获取 满意度统计/填报率 chartData
  const getStatisticsData = (type) => {
    let startYear, startMonth, startDay, endYear, endMonth, endDay;

    const date = type === 1 ? satisfactionDate.value : fillingRateDate.value;
    const year = date.length >= 1 ? date[0] : null;
    const quarter = date.length >= 2 ? date[1] : null;
    const month = date.length >= 3 ? date[2] : null;

    startYear = endYear = year;
    if (month) {
      startMonth = endMonth = month;
    } else {
      if (quarter) {
        switch (quarter) {
          case '1':
            startMonth = '1';
            endMonth = '3';
            break;
          case '2':
            startMonth = '4';
            endMonth = '6';
            break;
          case '3':
            startMonth = '7';
            endMonth = '9';
            break;
          case '4':
            startMonth = '10';
            endMonth = '12';
            break;
        }
      } else {
        startMonth = '1';
        endMonth = '12';
      }
    }
    startDay = '1';
    endDay = moment(year + '-' + endMonth, 'YYYY-MM')
      .endOf('month')
      .format('DD');

    const startTime = `${startYear}-${startMonth}-${startDay}`;
    const endTime = `${endYear}-${endMonth}-${endDay}`;
    if (type === 1 || type === 'all') {
      question_statistics_satisfaction({ startTime, endTime }).then((res) => {
        const totalNum = Object.keys(res).reduce((prev, curr) => {
          if (curr != '0') prev += res[curr];
          return prev;
        }, 0);
        const totalScore = Object.keys(res).reduce((prev, curr) => {
          if (curr != '0') prev += res[curr] * curr;
          return prev;
        }, 0);
        satisfaction_chartOptions.value.title.text = `${totalScore && totalNum ? floor(divide(totalScore, totalNum), 2) : 0}分`;
        satisfaction_chartData.value.forEach((item) => {
          item.value = res[item.key] || 0;
        });
      });
    }
    if (type === 2 || type === 'all') {
      fillingRate_chartData.value = [];
      question_statistics_area({ startTime, endTime }).then((res) => {
        if (Object.keys(res).length) {
          fillingRate_chartData.value = Object.keys(res)
            .map((key) => ({ name: key, value: res[key] }))
            .sort((a, b) => a.value - b.value);
        }
      });
    }
  };
  // 满意度chartData
  const satisfaction_chartData = ref([
    { value: 0, name: '1分', key: '1', itemStyle: { color: '#FF1818' }, label: { color: '#FF1818' } },
    { value: 0, name: '2分', key: '2', itemStyle: { color: '#FFAD33' }, label: { color: '#FFAD33' } },
    { value: 0, name: '3分', key: '3', itemStyle: { color: '#24C8EC' }, label: { color: '#24C8EC' } },
    { value: 0, name: '4分', key: '4', itemStyle: { color: '#3761D1' }, label: { color: '#3761D1' } },
    { value: 0, name: '5分', key: '5', itemStyle: { color: '#07B838' }, label: { color: '#07B838' } },
  ]);
  // 填报率chartData
  const fillingRate_chartData: Ref<any[]> = ref([]);

  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    tableProps: {
      title: '问卷列表',
      api: question_get,
      columns: columns,
      size: 'small',
      scroll: { x: 1300 },
      showTableSetting: false,
      rowKey: 'formKey',
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
    },
  });
  //注册table数据
  const [registerTable, { reload, getForm }, { rowSelection, selectedRows }] = tableContext;

  // 导出loading
  const exportLoading = ref(false);
  //导出
  const exportData = async () => {
    try {
      exportLoading.value = true;
      const res = await question_exportForm({
        name: getForm().getFieldsValue().name || '',
        status: getForm().getFieldsValue().status || '',
        formKeyList: selectedRows.value.length ? selectedRows.value.map((item) => item.formKey).join(',') : '',
      });
      downloadByData(res, '满意度日常监测导出.zip');
      exportLoading.value = false;
    } catch (error: any) {
      exportLoading.value = false;
    }
  };

  /**
   * 操作栏
   */
  function getTableAction(record): any[] {
    type btnsType = {
      statusList: number[]; //status数组内包含当前状态则显示
      btn: Record<string, any>; //按钮
    }[];

    let btns: btnsType = [
      {
        statusList: [2, 3],
        btn: {
          label: '详情',
          onClick: () =>
            router.push({
              path: '/enterpriseAppeal/dailySatisfaction/questionPublishDetail',
              query: { key: record.formKey },
            }),
        },
      },
      {
        statusList: [1],
        btn: {
          label: '激活',
          popConfirm: {
            title: '确认激活发布当前问卷吗?',
            confirm: () =>
              question_publish({ formKey: record.formKey }).then(() => {
                reload();
                createMessage.success('激活成功');
              }),
          },
        },
      },
      {
        statusList: [2],
        btn: {
          label: '结束',
          popConfirm: {
            title: '确认结束收集当前问卷吗?',
            confirm: () =>
              question_stop({ formKey: record.formKey }).then(() => {
                reload();
                createMessage.success('结束成功');
              }),
          },
        },
      },
      {
        statusList: [2, 3],
        btn: {
          label: '查看问卷',
          onClick: () => ((questionViewFormKey.value = record.formKey), (showQuestionViewModal.value = true)),
        },
      },
      {
        statusList: [1],
        btn: {
          label: '编辑',
          onClick: () =>
            router.push({
              path: '/enterpriseAppeal/dailySatisfaction/operate',
              query: { key: record.formKey },
            }),
        },
      },
      {
        statusList: [1],
        btn: {
          label: '删除',
          popConfirm: {
            title: '确认删除当前问卷吗？',
            confirm: () =>
              question_delete({ formKey: record.formKey }).then(() => {
                createMessage.success('删除成功');
                reload();
              }),
          },
        },
      },
    ];
    return btns.filter((item) => item.statusList.includes(record.status)).map((value) => value.btn);
  }

  // 新建modal
  const showCreateDialog = ref(false);
  // 新建loading
  const createLoading = ref(false);
  const createFormRef = ref();
  const createForm = ref({
    name: '',
    sampleSize: '',
  });
  const create = async () => {
    try {
      const values = await createFormRef.value.validateFields();
      createLoading.value = true;
      const res = await question_create({
        ...values,
      });
      createLoading.value = false;

      router.push({ path: '/enterpriseAppeal/dailySatisfaction/operate', query: { key: res.formKey } });
    } catch (error: any) {
      createLoading.value = false;
      throw new Error(error);
    }
  };

  // 查看问卷modal
  const showQuestionViewModal = ref(false);
  // 再次发起loading
  const relaunchLoading = ref(false);
  // 查看问卷的formKey
  const questionViewFormKey = ref('');
  // 再次发起
  const relaunch = async () => {
    try {
      relaunchLoading.value = true;
      await question_copyForm({ key: questionViewFormKey.value });
      relaunchLoading.value = false;
      showQuestionViewModal.value = false;
      createMessage.success('操作成功');
      reload();
    } catch (error: any) {
      relaunchLoading.value = false;
      throw new Error(error);
    }
  };

  onMounted(async () => {
    setDefaultDate();
    getStatisticsData('all');
  });
</script>

<style lang="less" scoped>
  /deep/ .jeecg-basic-table-header__tableTitle {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  /deep/ .jeecg-basic-table-header__toolbar {
    width: 0px;
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
  .chart {
    display: flex;
    margin: 10px 10px 0 10px;
    .chart_box {
      flex: 0 0 49%;
      height: 340px;
      background-color: white;
      border-radius: 4px;
      padding: 0 20px;
      .title_box {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 0 10px 10px;
        .title {
          font-size: 16px;
          font-weight: 600;
          position: relative;
          line-height: 1;
          &::before {
            content: ' ';
            position: absolute;
            left: -10px;
            top: 0;
            width: 4px;
            height: 15px;
            border-radius: 4px;
            background-color: #4476fa;
          }
        }
        .func {
          span {
            margin-right: 10px;
            font-size: 14px;
          }
        }
      }
      .chart_render {
        width: 100%;
        height: 290px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .chart_left {
      margin-right: 2%;
    }
  }
</style>
