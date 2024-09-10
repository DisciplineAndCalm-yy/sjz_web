<template>
  <div class="main">
    <Mbox>
      <div class="date">
        <span class="date_update">数据更新日期:2024年2月19日</span>
        <div class="date_picker">
          <a-range-picker :allowClear="false" style="width: 354px" v-if="dateType === 'range'" v-model:value="searchDate" :ranges="dateRanges" />
          <a-date-picker :allowClear="false" style="width: 354px" v-if="dateType === 'day'" v-model:value="searchDate" placeholder="请选择日期" />
          <a-week-picker :allowClear="false" style="width: 354px" v-if="dateType === 'week'" v-model:value="searchDate" placeholder="请选择周" />
          <a-month-picker :allowClear="false" style="width: 354px" v-if="dateType === 'month'" v-model:value="searchDate" placeholder="请选择月份" />
          <a-radio-group v-model:value="dateType" button-style="solid" style="margin-left: 16px" @change="dateTypeChange">
            <a-radio-button value="range">时间段</a-radio-button>
            <a-radio-button value="day">自然日</a-radio-button>
            <a-radio-button value="week">自然周</a-radio-button>
            <a-radio-button value="month">自然月</a-radio-button>
          </a-radio-group>
        </div>
      </div>
    </Mbox>
    <Mbox title="诉求总量监控">
      <div class="appeal_total_box">
        <div class="appeal_item appeal_all">
          <img class="bg_img" src="/@/assets/images/enterpriseSatisfactionAnalysis/appealTotalLeft.png" alt="" />
          <div class="content">
            <div class="p_box">
              <p class="label">全部诉求</p>
              <p class="value">34</p>
            </div>
            <Wardart title="诉" style="margin-right: 30px" />
          </div>
        </div>
        <div class="appeal_item appeal_solve">
          <img class="bg_img" src="/@/assets/images/enterpriseSatisfactionAnalysis/appealTotalLeft.png" alt="" />
          <div class="content">
            <div class="p_box">
              <p class="label">解决率</p>
              <p class="value">16%</p>
            </div>
            <Wardart title="✓" style="margin-right: 30px" />
          </div>
        </div>
      </div>
    </Mbox>
    <div style="width: 100%; display: flex">
      <Mbox title="企业诉求类型-一级" style="flex: 1; margin-right: 10px; height: 250px">
        <Bar
          height="168px"
          :option="appealType1"
          :chartData="[
            { name: '哈哈', value: 111 },
            { name: '政务环境', value: 120 },
            { name: '政务环境1', value: 30 },
          ]"
        />
      </Mbox>
      <Mbox title="企业诉求类型-二级" style="flex: 1; margin-right: 10px; height: 250px">
        <template #titleRight>
          <a-select style="width: 120px" placeholder="请选择">
            <a-select-option v-for="(item, key) in 5" :key="key" :value="item">{{ item }}</a-select-option>
          </a-select>
        </template>
        <Bar
          height="168px"
          :option="appealType2"
          :chartData="[
            { name: '哈哈', value: 111 },
            { name: '政务环境', value: 120 },
            { name: '政务环境1', value: 30 },
          ]"
        />
      </Mbox>
      <Mbox title="企业诉求类型-三级" style="flex: 1; height: 250px">
        <template #titleRight>
          <a-select style="width: 120px" placeholder="请选择">
            <a-select-option v-for="(item, key) in 5" :key="key" :value="item">{{ item }}</a-select-option>
          </a-select>
        </template>
        <Bar
          height="168px"
          :option="appealType3"
          :chartData="[
            { name: '哈哈', value: 111 },
            { name: '政务环境', value: 120 },
            { name: '政务环境1', value: 30 },
          ]"
        />
      </Mbox>
    </div>
    <div style="width: 100%; display: flex">
      <Mbox title="诉求类型统计TOP10" style="flex: 1; margin-right: 10px; height: 350px">
        <Bar
          height="268px"
          :option="appealTypeRank"
          :chartData="[
            { name: '政务环境', value: 111 },
            { name: '政务环境1', value: 120 },
            { name: '政务环境2', value: 160 },
            { name: '政务环境3', value: 180 },
            { name: '政务环境4', value: 200 },
            { name: '政务环境5', value: 300 },
          ]"
        />
      </Mbox>
      <Mbox title="诉求收集渠道" style="flex: 1; height: 350px">
        <Pie
          height="268px"
          :option="appealChannel"
          :chartData="[
            { value: 42, name: '12306', color: '#4476FA' },
            { value: 58, name: '系统平台', color: '#FE9923' },
          ]"
        />
      </Mbox>
    </div>
    <Mbox title="诉求处置区县" style="height: 250px">
      <Line
        height="168px"
        :option="appealArea"
        :chartData="[
          { name: '1区', value: 111 },
          { name: '2区', value: 222 },
          { name: '3区', value: 333 },
          { name: '4区', value: 123 },
          { name: '5区', value: 700 },
          { name: '6区', value: 450 },
          { name: '7区', value: 980 },
          { name: '8区', value: 20 },
          { name: '9区', value: 999 },
        ]"
      />
    </Mbox>
    <Mbox title="诉求处置部门" style="height: 250px">
      <Bar
        height="168px"
        :option="appealDepart"
        :chartData="[
          { name: '1区', value: 111 },
          { name: '2区', value: 222 },
          { name: '3区', value: 333 },
          { name: '4区', value: 123 },
          { name: '5区', value: 700 },
          { name: '6区', value: 450 },
          { name: '7区', value: 980 },
          { name: '8区', value: 20 },
          { name: '9区', value: 999 },
        ]"
      />
    </Mbox>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted } from 'vue';
  import dayjs from 'dayjs';
  import Mbox from './components/Mbox.vue';
  import Wardart from './components/Wardart.vue';
  import { useIndexData } from './useIndexData';
  import Bar from '/@/components/chart/Bar.vue';
  import Pie from '/@/components/chart/Pie.vue';
  import Line from '/@/components/chart/Line.vue';

  const { appealType1, appealType2, appealType3, appealTypeRank, appealChannel, appealArea, appealDepart } = useIndexData();

  const dateType = ref('range');
  const dateRanges = ref({
    近7天: [dayjs().subtract(6, 'days'), dayjs()],
    近30天: [dayjs().subtract(29, 'days'), dayjs()],
    近90天: [dayjs().subtract(89, 'days'), dayjs()],
  });
  const searchDate = ref(undefined);

  watch(
    () => searchDate.value,
    (n) => {
      if (!n) return;
      switch (dateType.value) {
        case 'range':
          console.log(dayjs(n[0]).format('YYYY-MM-DD'), dayjs(n[1]).format('YYYY-MM-DD'));
          break;
        case 'day':
          console.log(dayjs(n).format('YYYY-MM-DD'), dayjs(n).format('YYYY-MM-DD'));
          break;
        case 'week':
          console.log(dayjs(n).weekday(0).format('YYYY-MM-DD'), dayjs(n).weekday(6).format('YYYY-MM-DD'));
          break;
        case 'month':
          console.log(dayjs(n).format('YYYY-MM-01'), dayjs(n).endOf('month').format('YYYY-MM-DD'));
      }
    },
    {
      deep: true,
    }
  );

  const dateTypeChange = () => {
    searchDate.value = dateType.value === 'range' ? [dayjs().subtract(29, 'days'), dayjs()] : dayjs();
  };

  onMounted(() => {
    dateTypeChange();
  });
</script>

<style lang="less" scoped>
  .main {
    width: clac(100% - 30px);
    margin: 10px 15px;
    .date {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .date_update {
        font-weight: 14px;
      }
      .date_picker {
        display: flex;
      }
    }
    .appeal_total_box {
      width: 100%;
      display: flex;
      .appeal_item {
        flex: 1;
        height: 100px;
        border-radius: 4px;
        position: relative;
        .bg_img {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .content {
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .p_box {
            display: flex;
            align-items: center;
            p {
              font-weight: 700;
              line-height: 1;
              margin: 0;
              color: white;
            }
            .label {
              font-size: 20px;
              margin: 0 40px;
            }
            .value {
              font-size: 32px;
            }
          }
        }
      }
      .appeal_all {
        margin-right: 30px;
        background: linear-gradient(101.46deg, #75c4fe 31.27%, #cfebff 67.58%);
      }
      .appeal_solve {
        background: linear-gradient(100.99deg, #9aa8ff 25.41%, #d0d7ff 67.45%);
      }
    }
  }
</style>
