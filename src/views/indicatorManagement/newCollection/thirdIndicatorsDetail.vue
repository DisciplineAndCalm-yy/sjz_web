<template>
  <div class="thrid-indicators">
    <div class="title">{{ name }}</div>
    <div class="content">
      <a-table expandRowByClick bordered :columns="indicatorColumns" :dataSource="data" :pagination="false" :scroll="{ x: 1500 }" :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'control' && record.evidenceFlag === '1' && record.evidenceFile">
            <div class="link" @click="() => onEvidenceClick(record)">查看佐证</div>
          </template>
        </template>
      </a-table>
      <div class="back">
        <a-button @click="handleBack" type="primary" ghost>返回</a-button>
      </div>
    </div>
    <evidenceDetailModal v-bind="modelProps" @register="register" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { TableColumnType } from 'ant-design-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { queryIndicatorProcessDetail } from '/@/api/indicatorManagement';
  import evidenceDetailModal, { EvidenceDetailModalProps } from '/@/views/common/evidenceDetailModal';
  import { useModal } from '/@/components/Modal';
  import { IndicatorProcessRrcord } from './index.data';

  const route = useRoute();
  const router = useRouter();

  const name = ref(route.query.name);

  const indicatorColumns = ref<TableColumnType<IndicatorProcessRrcord>[]>([]);
  const data = ref<IndicatorProcessRrcord[]>([]);
  const isLoading = ref(false);

  onMounted(() => {
    if (route.query.pid) {
      getList();
    }
  });

  const initColumns = () => {
    indicatorColumns.value = [
      {
        title: '指标说明',
        width: 500,
        fixed: 'left',
        align: 'left',
        dataIndex: 'description',
      },
      {
        title: '单位',
        width: 100,
        align: 'center',
        dataIndex: 'unit',
      },
      {
        title: '报送方式',
        width: 100,
        align: 'center',
        dataIndex: 'departTypeText',
      },
      {
        title: '校核角色',
        width: 100,
        align: 'center',
        dataIndex: 'checkUser',
      },
    ];
  };

  const getList = async () => {
    isLoading.value = true;
    queryIndicatorProcessDetail({ indicatorId: route.query.pid })
      .then((res) => {
        initColumns();
        const indicatorColumn = res.columns.map((i) => {
          return {
            ...i,
            align: 'center',
            children: [
              {
                title: '采集进度',
                width: 100,
                align: 'center',
                dataIndex: `${i.dataIndex}-value`,
              },
              {
                title: '报送部门',
                width: 150,
                align: 'center',
                dataIndex: `${i.dataIndex}-sendUser`,
              },
            ],
          };
        }) as TableColumnType<IndicatorProcessRrcord>[];
        indicatorColumns.value.push(...indicatorColumn, {
          title: '操作',
          key: 'control',
          align: 'center',
          fixed: 'right',
          width: 100,
        });

        data.value = res.datasource.map((i) => {
          const obj = { ...i };

          i.processList.forEach((item) => {
            obj[`${item.dataIndex}-value`] = item.process;
            obj[`${item.dataIndex}-sendUser`] = item.sendUser;
          });

          return obj;
        });
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  // 佐证弹窗
  const onEvidenceClick = (record) => {
    modelProps.value = {
      questionId: record.id,
      sendDepartId: '',
      sendUserId: '',
    };
    setModalProps({
      showOkBtn: false,
    });
    openModal(true);
  };

  const modelProps = ref<EvidenceDetailModalProps>({
    questionId: '',
    sendDepartId: '',
    sendUserId: '',
  });
  const [register, { openModal, setModalProps }] = useModal();

  const handleBack = () => {
    router.back();
  };
</script>

<style lang="less" scoped>
  [data-theme='dark'] {
    .thrid-indicators {
      .title {
        color: #c9d1d9;
        background: #151515;
      }
      .content {
        background: #151515;
      }
    }
  }
  [data-theme='light'] {
    .thrid-indicators {
      .title {
        color: #252525;
        background: #fff;
      }
      .content {
        background: #fff;
      }
    }
  }

  .thrid-indicators {
    padding: 10px;
    .title {
      padding: 10px 20px;
      margin-bottom: 10px;
    }

    .content {
      padding-bottom: 6px;

      .back {
        margin-top: 10px;
        text-align: center;
      }
    }
  }

  .link {
    cursor: pointer;
    color: #40a9ff;
  }

  [data-doc-theme='light'] .ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
[data-doc-theme='dark'] .ant-table-striped :deep(.table-striped) td {
  background-color: rgb(29, 29, 29);
}
</style>
