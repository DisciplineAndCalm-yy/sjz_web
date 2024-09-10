<template>
  <a-card class="base-info" size="small" title="详情">
    <div class="infoContainer">
      <a-row :gutter="20">
      <a-col :span="6" v-for="item in collectInfoConfig" :key="item.value">
        <div class="info">
          <span>{{ item.title }} : </span>
          <!-- 状态 -->
          <template v-if="item.value === 'projectStatusText'">
            <span class="tag" :style="projectStatusStyle[detail.activateStatus]">{{ detail[item.value] }}</span>
          </template>
          <!-- 激活状态,校核状态 -->
          <template v-else-if="item.value === 'activateStatusText'">
            <span class="point" :style="pointStyle[item.value][detail.activateStatus]">{{ detail[item.value] }}</span>
          </template>
          <!-- 校核状态 -->
          <template v-else-if="'checkStatusText' === item.value">
            <span class="point" :style="pointStyle[item.value][detail.checkStatus]">{{ detail[item.value] }}</span>
          </template>
          <!-- 报送状态 -->
          <template v-else-if="'projectSendStatusText' === item.value">
            <span class="point" :style="pointStyle[item.value][detail.projectSendStatus]">{{ detail[item.value] }}</span>
          </template>
          <template v-else>
            <a-tooltip :title="detail[item.value]">
              <span class="value">{{ detail[item.value] }}</span>
            </a-tooltip>
          </template>
        </div>
      </a-col>
    </a-row>
    </div>

  </a-card>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { queryProjectInfo } from '/@/api/indicatorManagement';
  import { IndicatorProjectDetail, CollectInfoConfig } from '../index.data';

  const props = withDefaults(
    defineProps<{
      pid: string;
      source: 'collect' | 'replay';
      collectInfoConfig: CollectInfoConfig;
    }>(),
    {
      pid: '',
      source: 'collect',
      collectInfoConfig: () => [],
    }
  );

  const emit = defineEmits<{
    (event: 'updateProjectInfo', data: IndicatorProjectDetail): void;
  }>();

  const detail = ref<IndicatorProjectDetail>({
    id: '',
    activateStatus: '3',
    activateStatusText: '',
    activateTime: '',
    checkStatus: '',
    checkStatusText: '',
    createBy: '',
    createDepart: '',
    createTime: '',
    monitorType: '',
    monitorTypeName: '',
    name: '',
    projectSendStatus: '',
    projectSendStatusText: '',
    projectStatusText: '',
    templateId: '',
    templateName: '',
  });

  const getProjectDetail = () => {
    queryProjectInfo({ id: props.pid, source: props.source }).then((res) => {
      detail.value = res;
      emit('updateProjectInfo', detail.value);
    });
  };

  watch(
    () => props.pid,
    (val) => {
      val && getProjectDetail();
    },
    {
      immediate: true,
    }
  );

  const projectStatusStyle = {
    '1': {
      border: '1px solid #FC8F0F',
      color: '#FC8F0F'
    },
    '2': {
      border: '1px solid #4476F7',
      color: '#4476F7'
    },
    '3': {
      border: '1px solid #A3A3A3',
      color: '#A3A3A3'
    },
  }

  const pointStyle = {
    activateStatusText: {
      '1': {
        '--bg': '#999999',
        color: '#999999'
      },
      '2': {
        '--bg': '#4476F7',
        color: '#4476F7'
      },
      '3': {
        '--bg': '#4476F7',
        color: '#4476F7'
      },
    },
    checkStatusText: {
      '0': {
        '--bg': '#FF3535',
        color: '#FF3535'
      },
      '1': {
        '--bg': '#18BA4F',
        color: '#18BA4F'

      }
    },
    projectSendStatusText: {
      '0': {
        '--bg': '#FF5D5D',
        color: '#FF5D5D'
      },
      '1': {
        '--bg': '#38AC25',
        color: '#38AC25'

      }
    }
  }
</script>

<style lang="less" scoped>
  .base-info {
    margin: 10px 0;
    .infoContainer{
      background-color: #F0F8FD;
      padding: 5px 10px;
      border-radius: 4px;
    }
    .info {
      display: flex;
      align-items: center;
      .value {
        flex: 1;
        flex-basis: 0;
        margin-left: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: bolder;
      }

      .tag {
        width: 53.95px;
        height: 22.27px;
        margin-left: 6px;
        line-height: 20.27px;
        text-align: center;
        border-radius: 4px;
      }

      .point {
        font-weight: 700;

        &::before {
          content: '';
          display: inline-block;
          width: 9.09px;
          height: 9.09px;
          border-radius: 50%;
          margin: 0 6px;
          background-color: var(--bg);
        }
      }
    }
  }

  .ant-col {
    line-height: 37px;

    > span:nth-child(1) {
      font-weight: 400;
    }
  }
</style>
