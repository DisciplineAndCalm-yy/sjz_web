<template>
  <div class="container-padding new-collection-detail" >
    <div class="back" @click="handleBack">
      <left-outlined />
      <span>返回</span>
    </div>
    <collectInfo :pid="pid" :collectInfoConfig="collectInfoConfig" @update-project-info="updateProjectInfo" />
    <collectProgress :pid="pid" v-if="!isDraft" />
    <!-- <indicator-system></indicator-system> -->
    <a-card class="base-info" size="small" title="指标体系">
      <indicator-build source="collect" />
    </a-card>
  </div>
</template>
<script lang="ts" setup name="newCollectionDetail">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  import { LeftOutlined } from '@ant-design/icons-vue';
  import collectInfo from './components/collectInfo.vue';
  import collectProgress from './components/collectProgress.vue';
  import indicatorSystem from './components/indicatorSystem.vue';
  import indicatorBuild from '../indicatorTemplate/indicatorBuild.vue';
  import { CollectInfoConfig, IndicatorProjectDetail } from './index.data';
  const route = useRoute();
  const router = useRouter();

  if (!route.query.id) {
    message.error('项目id不能为空');
  }
  const pid = ref(route.query.id as string);

  // 是否是草稿
  const isDraft = ref(true);

  const collectInfoConfig: CollectInfoConfig = [
    {
      title: '项目名称',
      value: 'name',
    },
    {
      title: '指标体系名称',
      value: 'templateName',
    },
    {
      title: '采集范围',
      value: 'monitorTypeName',
    },
    {
      title: '激活状态',
      value: 'activateStatusText',
    },
    {
      title: '创建部门',
      value: 'createDepart',
    },
    {
      title: '创建日期',
      value: 'createTime',
    },
    {
      title: '状态',
      value: 'projectStatusText',
    },
  ];

  const updateProjectInfo = (data: IndicatorProjectDetail) => {
    // 不等于草稿显示采集进度
    isDraft.value = data.activateStatus === '1';
  };

  const handleBack = () => {
    router.back();
  };
</script>
<style lang="less" scoped>
  .back {
    width: 100%;
    padding: 10px;
    background: white;
    cursor: pointer;
  }
  .ant-col {
    line-height: 37px;
    > span:nth-child(1) {
      font-weight: 400;
    }
  }
</style>
