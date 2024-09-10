<template>
  <div class="analysis">
    <div class="automatic">
      <div class="automatic-wj">
        <div class="automatic-wj-title">
          <div class="title">
            <span>问卷名称:</span>
            <div class="title-sel">
              <input type="text" placeholder="请输入" v-model="value" @keydown.enter="handleSubmit" />
              <div class="title-sel-but">
                <button @click="handleSubmit">查询</button>
                <button @click="handleReset">重置</button>
              </div>
            </div>
          </div>
        </div>
        <div class="automatic-wj-list" v-if="list.length > 0">
          <div class="automatic-wj-list-item" v-for="v in list">
            <div class="awli-container">
              <div class="awli-container-title">{{ v.name }}</div>
              <div class="awli-container-date">
                <span>创建时间：{{ v.createTime }}</span>
                <div class="awli-container-count">已填答:{{ v.finishAmount }}</div>
              </div>
            </div>
            <div class="awli-btn">
              <button @click="handleDetail(v)">数据分析</button>
              <!-- <button @click="handleData(v)" v-if="hasPermission('automaticAnalysis-btns')">数据统计</button> -->
              <a-button @click="handleExcel(v)" :loading="fileLoading_id == v.id" :disabled="fileLoading_id && fileLoading_id !== v.id" v-if="hasPermission('automaticAnalysis-btns')">导出</a-button>
            </div>
          </div>
        </div>
        <div class="automatic-wj-list" v-show="list.length <= 0">
          <a-empty v-show="!load" :image="simpleImage" />
        </div>
        <div class="automatic-wj-list automatic-wj-list-load" v-show="load">
          <a-spin size="large" />
        </div>
        <div class="automatic-wj-page">
          <a-pagination
            v-if="list.length > 0"
            show-size-changer
            v-model:current="current1"
            v-model:pageSize="pageSize"
            :page-size-options="pageSizeOptions"
            :total="total"
            @change="pageChange"
            @showSizeChange="onShowSizeChange"
          />
        </div>
      </div>
    </div>
  </div>

  <a-modal v-model:visible="visible" width="400px" :header="null" :footer="null" :closable="false">
    <div class="model-box">
      <p>数据统计</p>
      <div class="model-box-input">
        <div class="model-box-input-title">
          <span>不计入统计数值：</span>
        </div>
        <div class="model-box-input-text">
          <!-- oninput="if(value>100)value=100"
                     onkeyup="value=value.replace(/[^0-9]/g,'')"
                      oncontextmenu="value=value.replace(/[^0-9]/g,'')"-->
          <input type="text" :disabled="activeRowData && !activeRowData.containsScore" placeholder="请输入" onpaste="return false" v-model.trim="dataValue" @input="handleInput" />
          <nav v-show="isSJTJ && !dataValue">数值不能为空</nav>
          <!-- isSJTJ -->
        </div>
        <div class="model-box-input-title">
          <span> &nbsp;分以下</span>
        </div>
      </div>
      <div class="model-box-foot">
        <a-button style="border-radius: 7px" class="white" @click="handleClickClone">取消</a-button>
        <a-button :disabled="activeRowData && !activeRowData.containsScore" type="primary" style="border-radius: 7px" class="blue" @click="handleClickOk">确定</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
  import { usePermission } from '/@/hooks/web/usePermission';
  import { Empty } from 'ant-design-vue';
  import { ref, reactive } from 'vue';
  import { getquestionnairelist, questionnaireThresholdValue, statisticsAutoSpecialDownload } from '/@/api/dataAnalysis';
  import { useRouter, useRoute } from 'vue-router';
  const { hasPermission } = usePermission();
  const router = useRouter();
  const route = useRoute();
  let value = ref();
  const current1 = ref(1);
  const pageSize = ref(10);
  let total = ref(50);
  let simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  let pageSizeOptions = reactive(['5', '10', '15']);
  let load = ref(true);
  let visible = ref(false);
  let dataValue = ref();
  let activeRowData = ref();
  const handleInput = (e) => {
    if (dataValue.value == '') {
      return false;
    }
    let newValue = Number(String(dataValue.value).replace(/[^0-9]/g, ''));
    dataValue.value = newValue;
    if (dataValue.value >= 100) {
      dataValue.value = 100;
    }
  };
  //重置
  const handleReset = () => {
    value.value = '';
    getList();
  };

  //查询
  const handleSubmit = () => {
    current1.value = 1;
    getList();
  };
  //数据分析
  const handleData = (row) => {
    visible.value = true;
    activeRowData.value = row;
    dataValue.value = row.thresholdValue;
  };
  // 导出
  let fileLoading_id = ref();
  const handleExcel = (row) => {
    let id = row.id;
    fileLoading_id.value = id;
    let fileName = `${row.name}[${row.type}]自动分析.xls`;
    statisticsAutoSpecialDownload(row.id, fileName).finally((res) => {
      fileLoading_id.value = null;
    });
  };
  const handleClickClone = () => {
    dataValue.value = undefined;
    visible.value = false;
  };
  let isSJTJ = ref(false);
  const handleClickOk = () => {
    if (!dataValue.value && dataValue.value !== 0) {
      isSJTJ.value = true;
      return false;
    } else {
      isSJTJ.value = false;
    }
    visible.value = false;
    let id = activeRowData.value.id;
    // let val =  dataValue.value.replace(/[^0-9]/g,'');
    let val = dataValue.value;
    let value = {
      thresholdValue: val,
    };
    questionnaireThresholdValue(id, value).then((res) => {
      getList();
    });
  };

  //查看
  const handleDetail = (obj) => {
    router.push({
      name: 'automatic-detail',
      query: {
        id: obj.id,
      },
    });
  };
  //分页 个数切换
  const onShowSizeChange = (page) => {
    getList();
  };
  //分页 1 2 3切换
  const pageChange = (res) => {
    getList();
  };

  let list = reactive([]);
  const getList = () => {
    load.value = true;
    let param = {
      name: value.value,
      pageNo: current1.value,
      pageSize: pageSize.value,
      type: 'SPECIAL',
    };
    getquestionnairelist(param).then((res) => {
      list.length = 0;
      total.value = res.total;
      list.push(...res.records);
      load.value = false;
    });
  };
  getList();
</script>

<style scoped lang="less">
  .analysis {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  .model-box {
    padding: 20px 30px;

    p {
      height: 40px;
      padding-left: 15px;
      width: 100%;
      box-sizing: border-box;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      color: #333333;
      border-bottom: 1px solid #d9d9d9;
      margin-bottom: 10px;
    }

    .model-box-foot {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 20px;

      button + button {
        margin-left: 20px;
      }
    }

    .model-box-input {
      width: 100%;
      display: flex;
      height: 32px;
      line-height: 32px;
      position: relative;
      margin-bottom: 30px;
      nav {
        position: absolute;
        top: 100%;
        left: 120px;
        right: 0px;
        padding: 0px;
        margin: 0px !important;
        margin-bottom: 0px !important;
        height: 20px;
        border: none;
        font-size: 14px;
        color: red;
        font-weight: 500;
        line-height: 20px;
      }

      .model-box-input-title {
        font-size: 15px;
        text-align: right;
      }

      .model-box-input-text {
        flex: 1;

        input {
          width: 100%;
          height: 100%;
          border-radius: 7px;
          border: 1px solid #d9d9d9;
          outline: none;
          padding-left: 0.5em;
          font-size: 15px;
        }
      }
    }
  }

  .automatic-wj-title {
    padding: 14px 20px;
    background-color: white;
    border-radius: 2px;
  }

  .analysis {
    width: 100%;
    height: auto;

    .automatic {
      width: 100%;
      height: auto;

      .automatic-wj {
        width: 100%;
        height: auto;
        // padding: 14px 20px;
        // background: white;
        border-radius: 2px;
        position: relative;
      }

      .automatic-wj-list-load {
        position: absolute;
        top: 60px;
        display: flex;
        left: 0px;
        background-color: rgba(255, 255, 255, 0.8);

        > div {
          margin: auto;
        }
      }

      .automatic-wj-list {
        width: 100%;
        height: auto;
        margin-top: 10px;
        overflow: auto;
        min-height: calc(100vh - 316px);
        max-height: calc(100vh - 316px);
        padding: 20px;
        background-color: white;
        border-radius: 2px 2px 0px 0px;

        .automatic-wj-list-item + .automatic-wj-list-item {
          margin-top: 16px;
        }

        .automatic-wj-list-item {
          width: 100%;
          height: auto;
          display: flex;

          .awli-container {
            flex: 1;
            box-sizing: border-box;
            padding: 16px;
            background-color: rgba(59, 140, 233, 0.08);
            border-radius: 2px;

            .awli-container-title {
              font-size: 16px;
              color: #333;
              height: 16px;
              line-height: 16px;
            }

            .awli-container-date {
              margin-top: 10px;
              height: 14px;
              line-height: 14px;
              font-size: 14px;
              color: #999999;
              display: flex;

              span {
                margin-right: 3em;
                width: 220px;
              }
            }
          }

          .awli-btn {
            margin-left: 20px;
            display: flex;
            justify-content: flex-end;

            button {
              min-width: 80px !important;
              height: 34px !important;
              padding: 0px 1em !important;
              box-shadow: 0px 0px 10px rgba(154, 154, 154, 0.4) !important;
              background-color: white !important;
              font-size: 15px !important;
              line-height: 28px !important;
              color: #666666 !important;
              margin: auto 0px !important;
              display: block !important;
              border-radius: 7px !important;
              font-family: 'PingFang SC' !important;
            }

            button + button {
              margin-left: 20px !important;
            }
          }
        }
      }

      .automatic-wj-page {
        padding-bottom: 20px;
        padding-top: 20px;
        background-color: white;
        border-radius: 0px 0px 2px 2px;

        /deep/ ul {
          text-align: center;
        }
      }
    }
  }

  .title {
    width: 100%;
    height: 32px;
    line-height: 32px;
    display: flex;

    span {
      font-size: 16px;
      margin-right: 0.5em;
    }

    .title-sel {
      flex: 1;
      display: flex;
      justify-content: space-between;

      input {
        width: 200px;
        height: 32px;
        box-sizing: border-box;
        border: 1px solid #d9d9d9;
        border-radius: 7px;
        outline: none;
        padding-left: 10px;
        font-size: 14px;
      }

      .title-sel-but {
        button {
          margin-left: 50px;
          width: 100px;
          font-size: 16px;
          height: 32px;
          border: none;
          line-height: 30px;
          border-radius: 7px;
        }

        button:nth-child(2) {
          background: #f5f5f5;
          color: #999999;
        }

        button:nth-child(1) {
          background: #3b8ce9;
          color: #fff;
        }
      }
    }

    .ant-calendar-picker {
      width: 260px;
    }
  }

  .automatic-wj-page {
    /deep/.ant-pagination {
      li {
        min-width: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        border: none;
        border-radius: 3px;
        background-color: #f5f5f5;

        a {
          width: 100%;
          height: 100%;
          padding: 0px;
          font-size: 14px;
          border: none;
        }
      }

      .ant-pagination-jump-prev,
      .ant-pagination-jump-next {
        background-color: transparent !important;
      }

      .ant-pagination-prev a,
      .ant-pagination-next a {
        font-size: 12px;
        background-color: #f5f5f5;
      }

      .ant-pagination-item-active {
        background-color: #3b8ce9;

        a {
          color: white;
        }
      }

      .ant-pagination-options {
        width: 80px;

        .ant-select {
          width: 100%;

          .ant-select-selector {
            padding: 0px;
            height: 20px;
            border: none;
            background-color: #f5f5f5;
            outline: none;
          }

          .ant-select-selection-item {
            height: 20px;
            line-height: 18px;
            font-size: 14px;
          }
        }
      }
    }
  }
</style>
