<template>
  <!-- <div class="exportWraper">
    <a-button class="exportBtn" @click="toExport">导出</a-button>
  </div> -->
  <div class="dataCheckQuestion">
    <div class="indicatorTree">
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'indicatorName'">
            <div class="indicatorName" @click="toGetQusetionList(record)">
              <span :class="{ selectedColor: indicatorId == record.id, templateName: true }">{{ record.indicatorName }}</span>
            </div>
          </template>
        </template>
      </BasicTable>
    </div>
    <div class="questionTable">
      <questionTable ref="questionListRef"></questionTable>
    </div>
  </div>
  <div class="btnWraper">
    <a-button class="closeBtn" @click="toClose">关闭</a-button>
  </div>
</template>
<script lang="ts" setup>
  import { checkIndicatorTree, exportCheckAnswer } from '/@/api/smartRating/index';
  import { useRoute, useRouter } from 'vue-router';
  import { ref, reactive, toRefs, onMounted, createVNode, provide, nextTick, getCurrentInstance } from 'vue';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicColumn, BasicTable } from '/@/components/Table';
  import questionTable from './components/questionTable.vue';
  // import { useMethods } from '/@/hooks/system/useMethods';
  // const { handleImportXls, handleExportXls } = useMethods();

  let indicatorId = ref('0');
  //获取问题列表
  const questionListRef = ref('questionListRef');
  //存储模板名称
  const indicatorTemplateObj = reactive<any>({
    name: '',
    id: '',
    status: '',
  });
  //定义表格列
  const columns: BasicColumn[] = [
    {
      title: indicatorTemplateObj.name,
      dataIndex: 'indicatorName',
      align: 'left',
      resizable: true,
    },
  ];
  // 列表页面公共参数、方法
  const { tableContext, onExportXls, onImportXls } = useListPage({
    designScope: 'basic-table-demo-ajax',
    tableProps: {
      api: checkIndicatorTree,
      immediate: false,
      columns: columns,
      showActionColumn: false,
      useSearchForm: false,
      pagination: false,
      expandRowByClick: true,
      showTableSetting: false,
      beforeFetch(params) {
        params.id = indicatorTemplateObj.id;
        params.isAll = false;
      },
    },
    // exportConfig: {
    //   name: '指标体系',
    //   url: exportTemplate + '?id=' + route.query.id,
    // },
    // importConfig: {
    //   url: importTemplate + '?id=' + route.query.id,
    // },
  });
  //BasicTable绑定注册
  const [registerTable, { reload, setProps }] = tableContext;
  // 声明路由信息
  const router = useRouter();
  const route = useRoute();

  const toGetQusetionList = (record) => {
    if (record.includeQuestion != '1') return;
    indicatorId = record.id;
    // reload();
    nextTick(() => {
      questionListRef.value.getQuestionList(record.id, indicatorTemplateObj.status);
    });
  };

  // // 数据导出
  // const toExport = () => {
  //   handleExportXls('采集任务', exportCheckAnswer, { id: route.query.id });
  // };

  // 返回上一页
  const toClose = () => {
    router.back();
  };

  onMounted(() => {
    if (route.query.id) {
      indicatorTemplateObj.id = route.query.id;
      indicatorTemplateObj.name = route.query.name;
      indicatorTemplateObj.status = route.query.status;
      setProps({ title: route.query.name });
      setTimeout(() => {
        reload();
      }, 1000);
    }
  });
</script>
<style lang="less" scoped>
  .dataCheckQuestion {
    width: 100%;
    display: flex;
    padding: 10px 20px 0;
    .indicatorTree {
      width: 30%;
      min-width: 430px;
      margin-right: 30px;
      /deep/ .jeecg-basic-table {
        height: 100%;
      }
      /deep/ .ant-table-wrapper {
        height: 100%;
      }
    }
    .questionTable {
      width: 70%;
    }
    .indicatorName {
      padding: 0 5px;
      cursor: pointer;
      overflow: hidden;
    }
    .selectedColor {
      color: #1790ff;
    }
    .templateName {
      width: 250px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .exportWraper {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 30px;
    .exportBtn {
      width: 120px;
      height: 40px;
      text-align: center;
      color: #fff;
      background: #1790ff;
    }
  }
  .btnWraper {
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    .closeBtn {
      width: 120px;
      height: 40px;
      text-align: center;
      color: #1790ff;
      border: 1px solid #1790ff;
    }
  }
</style>
