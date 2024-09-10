<template>
  <div class="policy-item">
    <div class="title">{{ props.data.title }}</div>
    <div class="content">
      <div class="box">
        <div class="quota">
          <div class="label">营商环境指标</div>
          <div class="value">{{ props.data.indicatorName }}</div>
        </div>
        <div class="quota">
          <div class="label">行政级别</div>
          <div class="value">{{ props.data.admLevel }}</div>
        </div>
        <div class="quota">
          <div class="label">发布日期</div>
          <div class="value">{{ props.data.publishTime }}</div>
        </div>
        <div class="quota">
          <div class="label">颁布部门</div>
          <div class="value">{{ props.data.publishOffice }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PolicyResultItem } from '..';

  const props = withDefaults(defineProps<{ data: PolicyResultItem }>(), {
    data: () => ({
      publishTime: '',
      indicatorName: '',
      publishOffice: '',
      admRegionCode: '',
      publishWord: '',
      dataType: '',
      updateTime: '',
      title: '',
      linkFile: '',
      indicatorId: '',
      createBy: '',
      openFlag: '',
      createTime: '',
      updateBy: '',
      topic: null,
      admLevel: '',
      id: '',
      policyLink: '',
      admRegionName: null,
      status: 1,
    }),
  });
</script>

<style lang="less" scoped>
  .policy-item {
    background: #fff;
    font-family: Microsoft YaHei;
    cursor: pointer;
    .title {
      border-bottom: 1px solid #f1f1f1;
      border-radius: 4px 4px 0 0;
      padding: 13px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 18px;
      font-weight: 700;
      color: #1b2a3c;
    }

    .content {
      padding: 10px;

      .box {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        border-radius: 4px;
        padding: 12px;
        background: #f1f1f1 !important;
        .quota {
          width: 50%;

          .label {
            font-size: 14px;
            font-weight: 400;
            color: #666;
            line-height: 24px;
          }

          .value {
            font-size: 18px;
            font-weight: 700;
            color: #4a5b71;
            line-height: 24px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          &:nth-child(-n + 2) {
            margin-bottom: 24px;
          }
        }
      }
    }
  }
</style>
