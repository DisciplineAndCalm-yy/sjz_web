<template>
  <a-card :title="tableName" style="width: 100%">
    <template #extra>
      <!-- <a-button class="exportBtn" @click="toExport">导出</a-button></template> -->
      <a-button type="primary" preIcon="ant-design:export-outlined" @click="toExport"> 导出</a-button>
    </template>
    <BasicTable @register="registerTable" :defaultExpandAllRows="true" :isTreeTable="true">
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <div class="btnWraper">
      <!-- <a-button class="makeBtn" @click="toMakeExl">生成报表</a-button> -->
      <a-button class="closeBtn" @click="toClose">关闭</a-button>
    </div>
  </a-card>
  <superviseModal @register="SuperviseModalRef" :dataSource="dataSource"></superviseModal>
</template>

<script lang="ts" name="system-user" setup>
import { preview, generate, exportTemplate, queryIndInfoById } from '/@/api/smartRating/index';
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { useListPage } from '/@/hooks/system/useListPage';
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useMethods } from '/@/hooks/system/useMethods';
import { useModal } from '/@/components/Modal';
import { exportMethod } from '/@/utils/file/download';
import superviseModal from './components/superviseModal.vue';

// 数据
const dataSource = ref([])
// 声明模板导出弹窗
const [SuperviseModalRef, { openModal: openSuperviseModal, closeModal: closeSuperviseModal, setModalProps: setModalSuperviseModal }] = useModal();

//声明路由
const router = useRouter();
const route = useRoute();

// 列表页面公共参数、方法
const { tableContext } = useListPage({
  designScope: 'basic-table-demo-ajax',
  tableProps: {
    immediate: false,
    showActionColumn: true,
    striped: true, //斑马纹设置
    useSearchForm: false,
    // scroll: { x: 1300 },
    // striped:true,//斑马纹设置
    expandRowByClick: true,
    pagination: false,
    showTableSetting: false,
  },
  // exportConfig: {
  //   name: '指标体系',
  //   url: exportTemplate + '?projectId=' + route.query.id,
  // },
  // importConfig: {
  //   url: importTemplate + '?id=' + route.query.id,
  // },
});

/** 
 * 操作栏
 */
function getTableAction(record): ActionItem[] {
  return [
    {
      label: '一键督办',
      ifShow: record.indicatorName == null,
      onClick: act.bind(null, record)
    }
  ];
}

// const result = [
//   {
//     name: "开办企业",
//     id: "4931f8022cf30d57b26e1b6eb4740004"
//   },
//   {
//     name: "二-开办企业001",
//     id: "4931f8022cf30d57b26e1b6eb4740007"
//   },
//   {
//     name: "三-开办企业001",
//     id: "4931f8022cf30d57b26e1b6eb4740009"
//   },
// ]

//BasicTable绑定注册
const [registerTable, { setProps, expandAll }] = tableContext;

let tableName = ref<any>('');
let projectId = ref<any>('');
let showBtn = ref<any>(false);
let columns = []

const { createMessage } = useMessage();

const getTableData = (id: any) => {
  preview({ projectId: id }).then((res) => {
    res.columns.map((el) => {
      el.width = 120;
      if (el.children) {
        el.children.map((item) => (item.width = 120));
      }
    });
    columns = res.columns
    setProps({ columns: res.columns, dataSource: res.scoreMapList });
  });
};

//过滤出来的字段，用在组装数据
let departIds = []

let supDataList = []
//要过滤掉的数字字段
const anotherKeys = ["id", "parentId", "indicatorName", "description", "standardValue", "weightValue", "indicatorType", "indicatorCode"]

const act = (record) => {
  console.log(record)
  //   alert(1)
  //   // departIds = Object.keys(record).map(item=>item.length == )
  //   departIds = Object.keys(record).filter(item => !anotherKeys.includes(item));
  // console.log(departIds)


  // return
  queryIndInfoById({ questionId: record.id }).then(res => {
    //组装数据
    const keys = Object.keys(record)
    supDataList = []
    keys.map(key => {
      if (!anotherKeys.includes(key)) {
        const departName = columns.filter(column => column.dataIndex == key)[0].title
        let obj = {
          title: `关于【${tableName.value}】【${res.level1IndName}·${res.level2IndName}】的整改提醒`,
          mainContent: `本次评测中，【${departName}】在【${res.level1IndName}·${res.level2IndName}】中具体的【${record.description}】填答内容【${res.departAnswerMap[key] != undefined? res.departAnswerMap[key] : ""}】，表现有待提高，请注意整改提升`,
          responsibleDepart: key
        }
        supDataList.push(obj)
      }
      


    })
    console.log('supDataList', supDataList)
    openSuperviseModal(true, {
      indicatorMsg: res,
      supDataList: supDataList
    })
  })
}

/**
 * 查询指标数据
*/
// const getIndicators = () => {
//     queryIndInfoById().then(res => {
//       openSuperviseModal(true, { isUpdate: true, indicatorObj: { templateId: id } })
//     })
// }

// 数据导出
const toExport = () => {
  exportMethod(exportTemplate, `${route.query.name}-评分预览`, { projectId: route.query.id });
};

// 生成报表
const toMakeExl = () => {
  generate({ projectId: projectId.value }).then((res) => {
    // getTableData(projectId.value);
  });
};

// 返回上一页
const toClose = () => {
  router.back();
};

onMounted(() => {
  if (route.query.id) {
    tableName.value = route.query.name;
    projectId.value = route.query.id;
    showBtn = route.query.showBtn;
    getTableData(route.query.id);
  }
  setTimeout(() => {
    expandAll()
  }, 200)
});
</script>

<style lang="less" scoped>
.tableTitle {
  margin: 20px 20px 0;
  font-size: 18px;
  font-weight: bold;
}

.modalBody {
  height: 65vh;
  overflow: hidden;
  overflow-y: scroll;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;

  .modalInfo {
    .infoLabel {
      margin-top: 20px;
      font-size: 18px;
      font-weight: bold;
    }

    .infoType {
      color: #1890ff;
    }

    .infoDesc {}
  }

  .modalTable {
    min-width: 40vw;
  }
}

.remarkWrap {
  padding: 20px 40px;
}

.exportWraper {
  margin-bottom: 20px;
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

  .makeBtn {
    width: 120px;
    height: 40px;
    text-align: center;
    color: #fff;
    background: #1790ff;
    margin-right: 40px;
  }

  .closeBtn {
    width: 120px;
    height: 40px;
    text-align: center;
    color: #1790ff;
    border: 1px solid #1790ff;
  }
}
</style>
