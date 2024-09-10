<template>
  <div class="main">
    <div class="box">
      <div class="box_title"> 满意度日常监测/详情 </div>
      <a-spin tip="加载中..." :spinning="loading_baseInfo" style="width: 100%; height: 100%">
        <div class="baseInfo_box">
          <div class="baseInfo">
            <div class="baseInfo_item">
              <p class="baseInfo_item_title">问卷名称：</p>
              <p class="baseInfo_item_value">{{ baseInfo.name }}</p>
            </div>
            <div class="baseInfo_item">
              <p class="baseInfo_item_title">创建部门：</p>
              <p class="baseInfo_item_value">{{ baseInfo.departName }}</p>
            </div>
            <div class="baseInfo_item">
              <p class="baseInfo_item_title">目标样本量：</p>
              <p class="baseInfo_item_value">{{ baseInfo.sampleSize }}</p>
            </div>
            <div class="baseInfo_item">
              <p class="baseInfo_item_title">发布日期：</p>
              <p class="baseInfo_item_value">{{ baseInfo.publishTime }}</p>
            </div>
            <div class="baseInfo_item" style="width: 66%">
              <p class="baseInfo_item_title">链接地址：</p>
              <p class="baseInfo_item_value">
                <a :href="baseInfo.url" target="_blank">{{ baseInfo.url }}</a>
              </p>
            </div>
          </div>
          <div class="qr_box">
            <div class="qr_title">二维码：</div>
            <div>
              <vue-qr :text="baseInfo.url" :size="100" :margin="0" ref="qrRef" />
            </div>
            <a class="qr_download" :href="qrSrc" :download="baseInfo.name" @click="qrSrc = $refs.qrRef.$el.currentSrc">下载</a>
          </div>
        </div>
      </a-spin>
    </div>
    <div class="box">
      <div class="box_title"> 样本量统计 </div>
      <a-spin tip="加载中..." :spinning="loading_baseInfo" style="width: 100%; height: 100%">
        <div>
          <a-table
            :scroll="{ x: 'max-content' }"
            :bordered="true"
            :pagination="false"
            :showHeader="false"
            :columns="sampleSizeTableColumn"
            :data-source="sampleSizeTableData"
          />
        </div>
      </a-spin>
    </div>
    <div class="box">
      <div class="box_title">
        <span>问卷统计</span>
        <a-select v-model:value="currentRegion" style="width: 120px; margin-left: 20px" @change="getOptionTable">
          <a-select-option v-for="(item, key) in regionList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
        </a-select>
      </div>
      <a-spin tip="加载中..." :spinning="loading_optionsStatistics" style="width: 100%; height: 100%">
        <div class="option_statistics">
          <template v-for="(item, key) in optionsStatisticsList" :key="key">
            <p class="tableTitle">{{ item.name }}</p>
            <a-table
              :scroll="{ x: 'max-content' }"
              :bordered="true"
              :pagination="false"
              :columns="
                item.type === 'RATE'
                  ? [
                      ...optionsStasticsColumn,
                      {
                        title: '查看低分原因',
                        dataIndex: 'reason',
                      },
                    ]
                  : optionsStasticsColumn
              "
              :data-source="item.list"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'percent'"> {{ record.percent }}% </template>
                <template v-if="column.dataIndex === 'reason'">
                  <a-button type="link" @click="getReasonTableData({ score: record.value, formItemId: item.formItemId })">查看</a-button>
                </template>
              </template>
            </a-table>
          </template>
        </div>
      </a-spin>
    </div>

    <a-modal v-model:visible="showReasonModal" :destroyOnClose="true" width="800px">
      <template #title>
        <span class="modal_title">查看详情</span>
      </template>
      <template #footer>
        <a-button type="primary" @click="showReasonModal = false">关闭</a-button>
      </template>
      <a-table
        style="margin: 10px"
        :loading="reasonTableLoading"
        :scroll="{ x: 'max-content' }"
        :bordered="true"
        :showHeader="true"
        :pagination="false"
        :columns="reasonTableColumn"
        :data-source="reasonTableData"
      />
    </a-modal>

    <div class="box function"> <a-button type="primary" @click="$router.push('/enterpriseAppeal/dailySatisfaction')">返回</a-button></div>
  </div>
</template>

<script lang="ts" setup>
  import vueQr from 'vue-qr/src/packages/vue-qr.vue';
  import { useRoute } from 'vue-router';
  import { ref, Ref, onMounted, computed } from 'vue';
  import { divide, floor, multiply } from 'lodash-es';
  import {
    question_getByKey,
    question_statistics_sampleList,
    question_statistics_option,
    question_getMobileUrl,
    question_getListLowScoreReason,
  } from '/@/api/enterpriseAppeal/index';
  import { getDict } from '/@/api/sys/dict';

  //二维码src
  const qrSrc = ref('');

  const route = useRoute();

  const formKey = route.query.key;

  // 基本信息loading
  const loading_baseInfo = ref(false);
  // 基本信息
  const baseInfo = ref({
    name: '',
    departName: '',
    sampleSize: '',
    publishTime: '',
    url: '',
  });
  // 获取基本信息
  const getBaseInfo = async () => {
    try {
      loading_baseInfo.value = true;
      const res = await question_getByKey({ key: formKey });
      Object.keys(baseInfo.value).forEach((item) => {
        baseInfo.value[item] = res[item] || '';
      });
      const mobileUrl = await question_getMobileUrl();
      baseInfo.value.url = `${mobileUrl}?formKey=${formKey}`;
      // baseInfo.value.url = `http://172.19.2.204:4500/?formKey=${formKey}`;
      loading_baseInfo.value = false;
    } catch (error: any) {
      loading_baseInfo.value = false;
      throw new Error(error);
    }
  };

  //样本量统计loading
  const loading_sampleSizeStatistics = ref(false);
  const sampleSizeTableColumn: Ref<any[]> = ref([
    {
      dataIndex: 'header',
      width: '150px',
      fixed: 'left',
      customCell: () => {
        return {
          style: {
            background: 'rgb(249,249,249)',
          },
        };
      },
    },
  ]);
  const sampleSizeTableData = computed(() => [
    {
      header: '区域名称',
      dataIndex: 'regionName',
    },
    {
      header: `样本数量(${sampleCountTotal.value})`,
      dataIndex: 'sampleCount',
    },
  ]);
  // 已填报总量
  const sampleCountTotal = ref(0);
  // 获取样本量统计
  const getSampleTableData = async () => {
    try {
      loading_sampleSizeStatistics.value = true;
      const res = await question_statistics_sampleList({ key: formKey });

      //计算样本已填报样本总量
      sampleCountTotal.value = res.reduce((prev, curr) => {
        return prev + curr.sampleCount;
      }, 0);

      // 添加横向表格column及data
      res.map((item, index) => {
        sampleSizeTableColumn.value.push({
          dataIndex: `use${index}`,
        });
        sampleSizeTableData.value[0][`use${index}`] = item[sampleSizeTableData.value[0]['dataIndex']];
        sampleSizeTableData.value[1][`use${index}`] = item[sampleSizeTableData.value[1]['dataIndex']];
      });

      loading_sampleSizeStatistics.value = false;
    } catch (error: any) {
      loading_sampleSizeStatistics.value = false;
      throw new Error(error);
    }
  };

  // 选项统计loading
  const loading_optionsStatistics = ref(false);
  const optionsStasticsColumn = ref([
    {
      title: '选项',
      dataIndex: 'label',
    },
    {
      title: '小计',
      dataIndex: 'count',
    },
    {
      title: '比例',
      dataIndex: 'percent',
    },
  ]);
  const currentRegion = ref('');
  // 地区list
  const regionList = ref([
    {
      label: '全部地区',
      value: '',
    },
  ]);
  // 选项统计所有表格list
  const optionsStatisticsList: Ref<any[]> = ref([]);
  //获取选项统计
  const getOptionTable = async (region = '') => {
    try {
      loading_sampleSizeStatistics.value = true;
      const res = await question_statistics_option({
        key: formKey,
        region,
      });
      if (res.length) {
        res.forEach((item) => {
          if (!item.list.length) return;

          // 当前表格统计总数量
          const totalNum = item.list.reduce((prev, curr) => {
            prev += curr.count;
            return prev;
          }, 0);

          //统计总量为0时 表示每个选项都没有被选中过 所有选项比例设置为0
          if (totalNum === 0) {
            item.list.forEach((value) => {
              value.percent = 0;
            });
            return;
          }

          // 将数量为0的选项百分比设置为0
          item.list.forEach((value) => {
            !value.count && (value.percent = 0);
          });
          // list去掉为0的数据
          const withoutZeroList = item.list.filter((value) => value.count);
          // 计算表格中所有统计百分比
          withoutZeroList.forEach((value, index) => {
            // 如果只有一个选项
            if (withoutZeroList.length === 1) {
              value.percent = 100;
            } else {
              // 最后一个百分比用100 - 前面之和  保证总数等于100
              value.percent =
                index === withoutZeroList.length - 1
                  ? 100 - withoutZeroList.reduce((prev, curr, index) => (index !== withoutZeroList.length - 1 ? prev + curr.percent : prev), 0)
                  : floor(multiply(divide(value.count, totalNum), 100), 0);
            }
          });
        });
      }
      optionsStatisticsList.value = res || [];
      loading_sampleSizeStatistics.value = false;
    } catch (error: any) {
      loading_sampleSizeStatistics.value = false;
      throw new Error(error);
    }
  };

  // 低分原因弹窗
  const showReasonModal = ref(false);
  const reasonTableLoading = ref(false);
  const reasonTableColumn = ref([
    {
      title: '低分原因',
      dataIndex: 'lowScoreReason',
    },
    {
      title: '分数',
      dataIndex: 'satisfactionScore',
    },
    {
      title: '地区',
      dataIndex: 'region',
    },
  ]);
  const reasonTableData = ref([]);
  const getReasonTableData = async ({ score, formItemId }) => {
    try {
      showReasonModal.value = true;
      reasonTableLoading.value = true;
      const res = await question_getListLowScoreReason({
        formKey,
        score,
        scoreItemId: formItemId,
        region: currentRegion.value,
      });
      reasonTableData.value = res;
      reasonTableLoading.value = false;
    } catch (error) {
      reasonTableLoading.value = false;
    }
  };

  onMounted(() => {
    getBaseInfo();
    getSampleTableData();
    getOptionTable();
    getDict({ dictCode: 'appeal_area' }).then((res) => (regionList.value = [...regionList.value, ...res]));
  });
</script>

<style lang="less" scoped>
  .main {
    width: 100%;
    padding: 10px 15px;
    position: relative;
    .box {
      width: 100%;
      border-radius: 4px;
      background-color: white;
      padding: 15px 30px;
      margin-bottom: 15px;
      .box_title {
        font-size: 16px;
        font-weight: 600;
        position: relative;
        margin-bottom: 20px;
        &::before {
          content: ' ';
          width: 4px;
          height: 15px;
          border-radius: 4px;
          position: absolute;
          left: -10px;
          top: 50%;
          transform: translateY(-50%);
          background-color: #4476fa;
        }
      }
    }
    .baseInfo_box {
      display: flex;
      .baseInfo {
        width: 75%;
        display: flex;
        flex-wrap: wrap;
        .baseInfo_item {
          width: 32%;
          margin-right: 1%;
          display: flex;
          margin-bottom: 10px;
          p {
            line-height: 1;
          }
          .baseInfo_item_title {
            color: #666666;
            flex-shrink: 0;
          }
          .baseInfo_item_value {
            width: 100%;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;
          }
        }
      }
      .qr_box {
        width: 25%;
        display: flex;
        .qr_title {
          color: #666666;
        }
        .qr_download {
          align-self: flex-end;
          margin-left: 10px;
          user-select: none;
        }
      }
    }
    .option_statistics {
      min-height: 20px;
      .tableTitle {
        margin: 20px 0 15px 0;
        line-height: 1;
      }
    }
    .modal_title {
      position: relative;
      margin-left: 10px;
      &::before {
        content: ' ';
        position: absolute;
        width: 4px;
        height: 15px;
        border-radius: 4px;
        background-color: #4476fa;
        left: -10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .function {
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
