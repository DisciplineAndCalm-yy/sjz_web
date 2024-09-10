<template>
  <div class="container-padding new-collection-detail">
    <!-- <div class="back" @click="handleBack">
      <left-outlined />
      <span>返回</span>
    </div> -->
    <!-- <collectInfo :pid="pid" :collectInfoConfig="collectInfoConfig" @update-project-info="updateProjectInfo" />
    <collectProgress :pid="pid" v-if="!isDraft" /> -->
    <!-- <indicator-system></indicator-system> -->
    <a-card v-if="btnList.length > 0" class="base-info" size="small">
      <a-button v-for="(btnEl) in btnList" :class="['standard_btn', btnColorMap[btnEl.operateCode]]" @click="handleClick(btnEl.operateCode)">{{ btnEl.operateCodeDesc }}</a-button>
    </a-card>
    <a-card class="base-info mt10" size="small">
      <div class="tags_info">
        <div class="tags_info">
          <div>挂牌：</div>
          <div v-if="modifiedSupervise.hangTagTypeDesc !== null" class="tag_box tag_blue">{{ modifiedSupervise.hangTagTypeDesc }}</div>
        </div>
        <div class="tags_info">
          <div>是否超期：</div>
          <div v-if="modifiedSupervise.overdueDesc === null || modifiedSupervise.overdueDesc === '未超期'" class="tag_box tag_blue">{{ modifiedSupervise.overdueDesc }}</div>
          <div v-else class="tag_box tag_red">{{ modifiedSupervise.overdueDesc }}</div>
        </div>
        <div class="tags_info">
          <div>催办次数：</div>
          <div class="tag_box tag_red">{{ modifiedSupervise.urgeNumber }}次</div>
        </div>
      </div>
      <div class="supervise_info">
        <a-row>
          <a-col v-for="(item, index) in detailArr" :key="index" :span="item.text === '任务内容' ? 24 : 8">
            <div v-if="item.text === '附件'">
              <div class="info_label">{{ item.text }}：</div>
              <div style="display: inline-block">
                <div style="display: flex; flex-direction: column;">
                  <a style="height: 20px;" v-for="elem in item.value" @click="handlePreview(elem)" :key="elem.storageId">{{ elem.storageName }}</a>
                </div>
              </div>
            </div>
            <div v-else>
              <span class="info_label">{{ item.text }}：</span>
              <span class="info_content">{{ item.value }}</span>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-card>
    <a-card class="base-info mt10" size="small">
      <div class="card_title">当前进度</div>
      <div class="card_stepbox">
        <a-steps :current="supProgressActive">
          <!-- <a-step>
            <template #title>Finished</template>
            <template #description>
              <span>This is a description.</span>
            </template>
          </a-step>
          <a-step title="In Progress" sub-title="Left 00:00:08" description="This is a description." />
          <a-step title="Waiting" description="This is a description." /> -->
          <a-step v-for="elem in supProgress" :title="elem.supStatusDesc" />
        </a-steps>
      </div>
    </a-card>
    <a-card class="base-info mt10" size="small" v-if="caseRecordVos.length>0">
      <approveFlow :caseRecordVos="caseRecordVos" :supId="supId" :templateId="templateId" :has_city_fgw_Role="has_city_fgw_Role"/>
    </a-card>
  </div>

  <a-modal v-model:visible="visible" :title="modelTitle" width="700" :header="null" :closable="false">
    <div class="modal_body">
      <a-row v-if="modelStatus === '9'">
        <a-col :span="8">
          <span class="info_label"><span class="red_point">*</span>挂牌：</span>
        </a-col>
        <a-col :span="16">
          <a-radio-group v-model:value="listing">
            <a-radio v-for="dict in hangTagTypeList" :value="dict.dictCode">{{ dict.dictName }}</a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-row v-if="modelStatus === '8'">
        <a-col :span="8">
          <span class="info_label"><span class="red_point">*</span>延期：</span>
        </a-col>
        <a-col :span="16">
          <a-date-picker :disabled-date="disabledDate" v-model:value="delay" />
        </a-col>
      </a-row>
      <a-row v-if="modelStatus === '10'">
        <a-col :span="24">
          <a-radio-group v-model:value="checkStatus">
            <a-radio :value="1">通过</a-radio>
            <a-radio :value="0">驳回</a-radio>
          </a-radio-group>
        </a-col>
        <a-col :span="24" v-if="checkStatus == 0">
          <a-textarea :rows="6" v-model:value="checkReply" placeholder="最多300个字符" :maxlength="300" />
        </a-col>
      </a-row>
      <a-row v-if="modelStatus === '3'">
        <a-col v-if="!has_city_fgw_Role" :span="24">
          完成进度：
        </a-col>
        <a-col v-if="!has_city_fgw_Role" :span="20">
          <a-slider v-model:value="finshProgress" />
        </a-col>
        <a-col v-if="!has_city_fgw_Role" :span="4">
          <span style="margin-left: 10px;">{{ finshProgress }}%</span>
        </a-col>
        <a-col :span="24">
          回复内容：
        </a-col>
        <a-col :span="24">
          <a-textarea :rows="6" v-model:value="reply" placeholder="最多300个字符" :maxlength="300" />
        </a-col>
        <a-col :span="24">
          <!-- <a-upload v-model:file-list="selectFileList" :showUploadList="false" :before-upload="beforeUpload">
            <span class="inner-button"><upload-outlined />上传附件</span>
          </a-upload> -->
          
          <JUpload ref="uploadRef" :value="fileValue" @change="changeValue" />
          <!-- <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImport">上传附件</j-upload-button> -->
        </a-col>
      </a-row>
    </div>
    <template #footer>
      <a-button key="back" @click="handleCancel">关闭</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">确定</a-button>
    </template>
  </a-modal>
</template>
<script lang="ts" setup name="newCollectionDetail">
  import { ref, toRefs, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { message, Modal } from 'ant-design-vue';
  import approveFlow from './components/approveFlow.vue';
  import { superviseDetail, getSchemas, getHangTagType, acceptedBatch, supHangTag, supReply, supPostpone, urgeBatch, supSubmit, approvedBatch } from '/@/api/supervise/index'
  // import collectProgress from './components/collectProgress.vue';
  // import indicatorSystem from './components/indicatorSystem.vue';
  // import indicatorBuild from '../indicatorTemplate/indicatorBuild.vue';
  import { CollectInfoConfig, IndicatorProjectDetail } from './index.data';
  import JUpload from '/@/components/Form/src/jeecg/components/JUpload/JUpload.vue';
  import { getTemporaryPath } from '/@/api/common/api';
  import { formatToDate } from '/@/utils/dateUtil';
  import { downFile } from '/@/utils/file/download';

  const route = useRoute();
  const router = useRouter();
  let visible = ref(false);
  let loading = ref<boolean>(false);
  let modelTitle = <String>('');
  let modelStatus = <String>('');
  let listing = ref<String>('');
  let delay = ref<String>('');
  let checkStatus = ref<Number>(1);
  let checkReply = ref<String>('');
  let reply = ref<String>('');
  let finshProgress = ref<Number>(0);
  let hangTagTypeList = ref<any>([]);
  let requireEndTime = ref<any>();
  let fileValue = ref<any>([]);
  let detailArr = ref<any>([]);
  let supProgress = ref<any>([]);
  let supProgressActive = ref<Number>(0);
  let btnList = ref<any>([]);
  let caseRecordVos = ref<any>([]);
  let modifiedSupervise = ref<any>({});
  // 操作类型(1发送, 2接收, 3回复, 4送审（发起核定）, 5驳回, 6通过, 7催办, 8延期, 9挂牌, 10核定)
  const btnColorMap: { [key: string]: string } = {
    '2': 'green',
    '3': 'green',
    '4': 'blue',
    '7': 'crimson',
    '8': 'orange',
    '9': 'yellow',
    '10': 'blue',
  };

  // // 定义 Supervise 类型
  // type Supervise = {
  //   urgeNumber: number | null;
  //   hangTagTypeDesc: string | null;
  //   overdueDesc: string | null;
  // };

  // // 使用 ref 创建响应式变量
  // const supervise: Supervise = {
  //   urgeNumber: null,
  //   hangTagTypeDesc: null,
  //   overdueDesc: null,
  // };

  // const modifiedSupervise = toRefs(supervise);
  
  const supId = ref(route.query.supId as string);
  const templateId = ref(route.query.templateId as string);

  const has_city_fgw_Role = ref(route.query.has_city_fgw_Role as boolean);

  // 是否是草稿
  const isDraft = ref(true);

  const handleClick = (status: any) => {
    /*
      status 状态：2接收, 3回复, 4送审（发起核定）, 7催办, 8延期, 9挂牌, 10核定
    */
    modelStatus = status;
    switch(status) {
      case '2':
        const params = {
          supIds: supId.value,
          templateId: templateId.value
        };
        acceptedBatch(params).then(() => {
          getData();
        });
        return;
      case '3':
        modelTitle = '回复';
        finshProgress.value = 0;
        reply.value = '';
        fileValue.value = [];
        has_city_fgw_Role.value = (has_city_fgw_Role.value == "false" || has_city_fgw_Role.value == false) ? false : true;
        console.log('has_city_fgw_Role', has_city_fgw_Role.value)
        break;
      case '4':
        Modal.confirm({
          title: '发起核定',
          content: '是否确认发起核定?',
          onOk() {
            supSubmit({ supId: supId.value, templateId: templateId.value }).then(() => {
              getData();
            });
          }
        });
        return;
      case '7':
        Modal.confirm({
          title: '催办',
          content: '是否确认催办?',
          onOk() {
            urgeBatch({ supIds: supId.value, templateId: templateId.value }).then(() => {
              getData();
            });
          }
        });
        return;
      case '8':
        modelTitle = '延期';
        delay.value = '';
        break;
      case '9':
        modelTitle = '挂牌';
        listing.value = '';
        break;
      case '10':
        modelTitle = '核定';
        checkStatus.value = 1;
        checkReply.value = '';
        break;
      default:
        break;
    };
    visible.value = true;
  };

  const handleCancel = () => {
    visible.value = false;
  };

  const handleSubmit = () => {
    switch(modelStatus) {
      case '3':
        if(reply.value === '') {
          message.warning('请填写回复内容！');
          return
        };
        if(reply.value.length > 300) {
          message.warning('回复内容不能超过300个字符！');
          return
        };
        let fileStr = '';
        fileValue.value.map(el => {
          fileStr += el.storageId + ';';
        });
        fileStr = fileStr.substr(0, fileStr.length - 1);
        const replyParams = {
          supId: supId.value,
          templateId: templateId.value,
          replyProgress: finshProgress.value,
          replyContent: reply.value,
          replyAttachment: fileStr
        };
        supReply(replyParams).then(() => {
          getData();
        });
        break;
      case '8':
        if(delay.value === '') {
          message.warning('请选择延期时间！');
          return
        };
        const param = {
          supId: supId.value,
          templateId: templateId.value,
          postponeTime: formatToDate(delay.value)
        };
        supPostpone(param).then(() => {
          getData();
        });
        break;
      case '9':
        if(listing.value === '') {
          message.warning('请选择一种挂牌方式！');
          return
        };
        const params = {
          supId: supId.value,
          templateId: templateId.value,
          hangTagType: listing.value
        };
        supHangTag(params).then(() => {
          getData();
        });
        break;
      case '10':
        // if(checkStatus.value === 0) {
        //   message.warning('请选择核定状态！');
        //   return
        // };
        if(checkStatus.value === 0 && checkReply.value === '') {
          message.warning('请填写驳回原因！');
          return
        };
        if(checkReply.value.length > 300) {
          message.warning('驳回原因不能超过300个字符！');
          return
        };
        const approveParams = {
          supIds: supId.value,
          templateId: templateId.value,
          approvedFlag: checkStatus.value,
          approvedContent: checkReply.value
        };
        approvedBatch(approveParams).then(() => {
          getData();
        });
        break;
      default:
        break;
    };
    setTimeout(() => {
      loading.value = false;
      visible.value = false;
    }, 2000);
  };


  const handlePreview = async (val) => {
    const url = await getTemporaryPath({ storageId: val.storageId });
    // window.open(url, val.storageName);
    downFile(url, val.storageName);
  };

  /**
   * 获取展示字段
   * @param arr {Array} schemas对象数组
  */
  const getKeys = (arr) => {
    const newarr = arr.map(item => {
      if (item.isShow === true) {
        return item.label;
      } else {
        return null; // 不符合条件时返回null或其他自定义值
      };
    }).filter(Boolean); // 去除结果中的空值（null）
    return newarr;
  };

  const getData = () => {
    Promise.all([getSchemas({ templateId: templateId.value }), superviseDetail({ supId: supId.value, templateId: templateId.value })]).then(res => {
      modifiedSupervise.value.urgeNumber = res[1].urgeNumber;
      modifiedSupervise.value.overdueDesc = res[1].overdueDesc;
      modifiedSupervise.value.hangTagTypeDesc = res[1].hangTagTypeDesc;
      btnList.value = res[1].powerVoList;
      caseRecordVos.value = res[1].supRecordVoList;
      supProgress.value = res[1].supProgressVoList;
      supProgressActive.value = res[1].supProgressVoList.findIndex(el => el.use);
      // 处理数据
      //获取配置的展示字段
      const arr = JSON.parse(res[0]).schemas[0].children[0].children;
      // console.log('arr:::', arr);
      let keys = getKeys(arr);
      // console.log('keys:::', keys);
      const extraData = ['创建时间', '发布部门', '要求完成时间'];
      extraData.map(el => {
        if(keys.indexOf(el) === -1) keys.push(el);
      });
      detailArr.value = res[1].detailDynamicVoList.filter(el => keys.indexOf(el.text) !== -1);
      if(res[1].attachments) {
        detailArr.value.push({
          text: '附件',
          value: res[1].attachments
        });
      };
      requireEndTime.value = detailArr.value.find(el => el.dataIndex === 'requireEndTime');
      // console.log('detailArr:::', detailArr.value);
    });
  };

  const getHangTag = async () => {
    let res: any = await getHangTagType();
    hangTagTypeList.value = res;
  };

  const changeValue = (val) => {
    fileValue.value = val;
  };

  const disabledDate = (current) => {
    return current && current < new Date(requireEndTime.value.value);
  };

  // 生命周期
  onMounted(() => {
    getHangTag();
    getData();
  });
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
  .mt10 {
    margin-top: 10px;
  }
  .standard_btn {
    width: 100px;
    height: 32px;
    margin-right: 30px;
    border-radius: 4px;
    border: none;
    color: #fff;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  }
  .yellow {
    background: #ffbf43;
  }
  .orange {
    background: #ff833d;
  }
  .crimson {
    background: #ff5454;
  }
  .blue {
    background: #4476fa;
  }
  .green {
    background: #0fb50c;
  }
  .card_title {
    color: #333;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  .tags_info {
    display: flex;
    align-items: center;
    margin-right: 50px;
  }
  .tag_box {
    padding: 3px 12px;
    border-radius: 4px;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .tag_blue {
    color: #4476fa;
    border-radius: 4px;
    border: 1px solid #4476fa;
    background: #e6ecff;
  }
  .tag_red {
    color: #fa4444;
    border-radius: 4px;
    border: 1px solid #fa4444;
    background: #ffe5e5;
  }
  .tag_orange {
    color: #ff7425;
    border-radius: 4px;
    border: 1px solid #ff7425;
    background: #ffeee4;
  }
  .supervise_info {
    margin-top: 20px;
    padding: 20px;
    width: 100%;
    border-radius: 4px;
    background: #f3f3f3;
  }
  .info_label {
    display: inline-block;
    color: #666;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .info_content {
    color: #333;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .card_stepbox {
    margin: 20px 0;
    padding: 0 100px;
  }
  .modal_body {
    padding: 30px 50px;
  }
  .red_point {
    color: red;
  }
  .base-info {
    /deep/ .ant-btn:hover, .ant-btn:focus {
      color: #fff;
      border-color: #FFF;
    }
    // /deep/ .ant-btn-primary:hover, .ant-btn-primary:focus {
    //   border-color: unset;
    //   background: unset;
    // }
  }
</style>
