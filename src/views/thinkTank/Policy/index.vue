<template>
  <div class="policy-think-tannks">
    <div class="banner"> <img src="./banner.png" alt="" /> </div>
    <div class="filter-box">
      <!-- 过滤条件 -->
      <ConditionFilter class="filter" @refrensh-list="refrenshList" />
    </div>
    <!-- 列表数据 -->
    <PolicyList class="list" ref="policyList" v-bind="ListProps">
      <template #default="{ data }">
        <!-- 列表子项 -->
        <PolicyItem :data="data" @click="() => handleItemDetail(data)" />
      </template>
    </PolicyList>
    <PolicyDetailModal @register="register" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { getPolicyListApi } from '/@/api/demo/thinkTank';
  import PolicyList, { ListProps } from '/@/views/thinkTank/common/components/policyList/index.vue';
  import { useModal } from '/@/components/Modal';
  import ConditionFilter from './components/conditionFilter.vue';
  import PolicyItem from './components/policyItem.vue';
  import PolicyDetailModal from './components/policyDetailModal.vue';
  import { PolicyFilter } from '.';

  const ListProps = ref<ListProps>({
    title: '政策汇编',
    api: getPolicyListApi,
    params: {},
    columnSum: 2,
  });

  const policyList = ref<InstanceType<typeof PolicyList> | null>(null);

  const refrenshList = (data: PolicyFilter) => {
    ListProps.value.params = data;
    policyList.value && policyList.value?.reLoad();
  };

  const [register, { openModal }] = useModal();

  const handleItemDetail = (data) => {
    openModal(true, data);
  };
</script>

<style lang="less" scoped>
  .policy-think-tannks {
    background: #f0f2f5;

    .filter-box {
      position: sticky;
      top: 0;
      z-index: 99;
      background-color: #fff;
      box-shadow: 0 1px 5px #eaeaea;

      .filter {
        margin: 0 auto;
        width: 1200px;
      }
    }
    .list {
      width: 1200px;
      padding-top: 12px;
      margin: 0 auto;
      background-color: #f0f2f5;
    }
  }
</style>
