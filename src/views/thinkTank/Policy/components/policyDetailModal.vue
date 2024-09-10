<template>
  <BasicModal v-bind="$attrs" @register="register" width="1200px" :draggable="false" :title="infoDetails?.title" :footer="null">
    <div class="policy-detail">
      <div class="bg-sources">
        <span>发布来源：{{ infoDetails?.publishOffice }}</span>
      </div>
      <div class="flex-item">
        <div v-if="infoDetails?.indicatorName">
          <span>{{ infoDetails.indicatorName }}</span>
        </div>
        <div v-if="infoDetails?.admRegionName">
          <span>{{ infoDetails.admRegionName }}</span>
        </div>
        <div v-if="infoDetails?.createTime">
          <span>{{ infoDetails.publishTime }}</span>
        </div>
        <div v-if="infoDetails?.publishOffice">
          <span>{{ infoDetails.publishOffice }}</span>
        </div>
      </div>
      <div class="border"></div>
      <iframe class="iframe-content" :src="infoDetails?.linkFile" frameborder="0"></iframe>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getPolicyDetailApi } from '/@/api/demo/thinkTank';
  import { PolicyDetail, PolicyResultItem } from '..';

  const infoDetails = ref<PolicyDetail>();

  const getDetail = (data: PolicyResultItem) => {
    getPolicyDetailApi({ id: data.id }).then((res) => {
      infoDetails.value = res;
    });
  };

  const [register] = useModalInner((data: PolicyResultItem) => {
    getDetail(data);
  });
</script>

<style lang="less" scoped>
  .policy-detail {
    width: 900px;
    margin: 0 auto;
    font-family: Microsoft YaHei;
    .bg-sources {
      margin-bottom: 20px;
      font-size: 15px;
      font-weight: 400;
      color: #333;
      margin-right: 27px;
    }

    .flex-item {
      display: flex;
      margin-bottom: 25px;
      div {
        display: flex;
        align-items: center;
        margin-right: 10px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(225, 230, 237, 1);
        border-radius: 4px;
        padding: 0 12px;
        height: 24px;
        span {
          font-size: 14px;
          font-weight: 400;
          color: rgba(94, 109, 129, 1);
        }
      }
    }

    .border {
      height: 1px;
      background: rgba(153, 153, 153, 1);
      margin-bottom: 22px;
    }

    .iframe-content {
      width: 900px;
      height: 1000px;
    }
  }
</style>
