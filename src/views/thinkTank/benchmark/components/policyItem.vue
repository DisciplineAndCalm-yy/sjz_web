<template>
  <div class="policy-item">
    <div class="title">{{ props.data.title }}</div>
    <div class="content">
      <div class="box">
        <div class="val">
          1.强谋划，精准攻坚“破题”。针对严重违法失信名单管理工作（以下简称“‘列严’工作”）涉及多部门、科室职能，协调调度难的问题，襄阳市市场监管局将“列严”工作纳入“一把手”工程，高站位谋划、统筹安排部署。该局组建“襄阳市市、统筹安排部署。该局组建“襄阳市市...
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
        .val {
          display: -webkit-box;
          -webkit-line-clamp: 3; /* 显示的行数 */
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
