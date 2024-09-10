<template>
  <div class="policy-filter">
    <div class="condition-item">
      <div class="label">行政级别：</div>
      <div class="value">
        <div class="nav-list">
          <div class="nav all" :class="{ active: form.admLevel === undefined }" @click="form.admLevel = undefined">全部</div>
          <div
            class="nav"
            :class="{ active: form.admLevel === item.value }"
            v-for="item in adLevels"
            :key="item.value"
            @click="form.admLevel = item.value"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
    <div class="condition-item">
      <div class="label">发文时间：</div>
      <div class="value">
        <div class="nav-list">
          <div class="nav all" :class="{ active: form.year === undefined }" @click="() => handleYearClick(undefined)">全部</div>
          <div
            class="nav"
            :class="{ active: form.year === item.value }"
            v-for="item in publishTime"
            :key="item.value"
            @click="() => handleYearClick(item.value)"
          >
            {{ item.title }}
          </div>
          <a-select class="year-select" v-model:value="form.yearSelect" @change="form.year = ''" size="small" placeholder="其他年份">
            <a-select-option v-for="item in moreYear" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </div>
      </div>
    </div>
    <div class="condition-item">
      <div class="label">指标选择：</div>
      <div class="value">
        <div class="nav-list" :class="{ showMore }">
          <div class="nav all" :class="{ active: form.indicatorName === undefined }" @click="form.indicatorName = undefined">全部</div>
          <div
            class="nav"
            :class="{ active: form.indicatorName === item.value }"
            v-for="item in policyIndicator"
            :key="item.value"
            @click="form.indicatorName = item.value"
          >
            {{ item.title }}
          </div>
        </div>
        <div class="more" @click="toggle">
          {{ showMore ? '收起' : '更多' }}
          <div class="icon" :class="{ 'is-open': showMore }">
            <up-outlined />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { UpOutlined } from '@ant-design/icons-vue';
  import { getAdLevelApi, getMoreYearApi, getPolicyIndicatorApi, getPublishTimeApi } from '/@/api/demo/thinkTank';
  import useToggler from '/@/hooks/tools/useToggler';
  import { PolicyFilter, RegionNew } from '..';

  const emit = defineEmits<{
    (event: 'refrenshList', data: PolicyFilter): void;
  }>();

  const form = ref<PolicyFilter & { yearSelect: string | undefined }>({
    admLevel: undefined,
    indicatorName: undefined,
    year: undefined,
    yearSelect: undefined,
  });

  // 行政级别
  const adLevels = ref<RegionNew[]>([]);
  const getInfo = async () => {
    getAdLevelApi().then((res) => {
      adLevels.value = res;
    });
  };

  getInfo();

  // 发文时间
  const publishTime = ref<RegionNew[]>([]);
  const getPublishTime = async () => {
    getPublishTimeApi().then((res) => {
      publishTime.value = res;
    });
  };

  getPublishTime();

  // 更多发文时间
  const moreYear = ref<number[]>([]);
  const getMoreYear = async () => {
    getMoreYearApi().then((res) => {
      moreYear.value = res;
    });
  };

  getMoreYear();
  const handleYearClick = (value: undefined | string) => {
    form.value.yearSelect = undefined;
    form.value.year = value;
  };

  // 指标选择
  const policyIndicator = ref<RegionNew[]>([]);
  const getPolicyIndicator = async () => {
    getPolicyIndicatorApi().then((res) => {
      policyIndicator.value = res;
    });
  };

  getPolicyIndicator();

  const [showMore, toggle] = useToggler(false);

  watch(
    () => form.value,
    (val) => {
      const result = {
        admLevel: val.admLevel,
        indicatorName: val.indicatorName,
        year: val.year || val.yearSelect,
      };
      emit('refrenshList', result);
    },
    {
      deep: true,
    }
  );
</script>

<style lang="less" scoped>
  @import url(../../common/less/filter.less);
  .policy-filter {
    .year-select {
      width: 200px;
    }
  }
</style>
