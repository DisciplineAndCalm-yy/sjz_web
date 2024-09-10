<template>
  <div class="thrid-department">
    <div class="title">{{ departName }}</div>
    <div class="content">
      <BasicTable @register="indicatorRegisterTable">
        <template #action="{ record }">
          <TableAction :actions="getTableAction(record)" />
        </template>
      </BasicTable>
      <div class="back">
        <a-button @click="handleBack" type="primary" ghost>返回</a-button>
      </div>
    </div>
    <evidenceDetailModal v-bind="modelProps" @register="register" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { queryDepartProcessDetail } from '/@/api/indicatorManagement';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicTable, BasicColumn, TableAction, ActionItem } from '/@/components/Table';
  import evidenceDetailModal, { EvidenceDetailModalProps } from '/@/views/common/evidenceDetailModal';

  const route = useRoute();
  const router = useRouter();
  const departName = ref(route.query.departName);
  const id = ref(route.query.pid);

  const indicatorColumns: BasicColumn[] = [
    {
      title: '指标说明',
      width: 240,
      align: 'left',
      dataIndex: 'description',
    },
    {
      title: '单位',
      width: 50,
      align: 'center',
      dataIndex: 'unit',
    },
    {
      title: '采集范围',
      width: 130,
      align: 'center',
      dataIndex: 'sendDepart',
    },
    {
      title: '校核角色',
      width: 100,
      align: 'center',
      dataIndex: 'checkUser',
    },
    {
      title: '采集进度',
      width: 50,
      align: 'center',
      dataIndex: 'answerProcess',
    },
  ];
  const { tableContext: indicatorTableContext } = useListPage({
    tableProps: {
      title: '',
      api: queryDepartProcessDetail,
      columns: indicatorColumns,
      striped:true,//斑马纹设置
      size: 'small',
      useSearchForm: false,
      expandRowByClick: true,
      showTableSetting: false,
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
      rowKey: 'id',
      // 请求之前对参数做处理
      beforeFetch(params) {
        params.departId = route.query.departId;
        params.id = id.value;
      },
    },
  });
  const [indicatorRegisterTable] = indicatorTableContext;

  const onEvidenceClick = (record) => {
    modelProps.value = {
      questionId: record.id,
      sendDepartId: '',
      sendUserId: String(route.query.departId),
    };
    setModalProps({
      showOkBtn: false,
    });
    openModal(true, record);
  };
  function getTableAction(record): ActionItem[] {
    return [
      {
        label: '查看作证',
        onClick: () => onEvidenceClick(record),
        ifShow: () => {
          return record.evidenceFlag === '1' && record.answerStatus === '1';
        },
      },
    ];
  }

  // 佐证弹窗
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
    .thrid-department {
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
    .thrid-department {
      .title {
        color: #252525;
        background: #fff;
      }
      .content {
        background: #fff;
      }
    }
  }

  .thrid-department {
    padding: 10px;
    .title {
      padding: 10px 20px;
      margin-bottom: 10px;
    }

    .content {
      padding-bottom: 6px;

      .back {
        text-align: center;
      }
    }
  }
</style>
