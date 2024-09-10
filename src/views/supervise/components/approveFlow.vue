<template>
  <!-- supId: {{ supId }}
  templateId: {{ templateId }} -->
  <!-- has_city_fgw_Role: {{props.has_city_fgw_Role }}- {{ has_city_fgw_Role == 'true' }} -->
  <div class="card_branch">
    <span class="card_title">操作记录</span>
    <a-button class="export_btn" type="primary" @click="download()">导出</a-button>
  </div>
  <div>
    <a-steps progress-dot :current="props.caseRecordVos.length" direction="vertical" style="width: 100%; overflow-y: scroll; max-height: 400px">
      <a-step style="padding-bottom: 20px" :key="index1" v-for="(item, index1) in caseRecordVos">
        <template #title>
          <div style="overflow: hidden; width: 100%">
            <span class="label">操 作：</span>
            <span class="labelContent">{{ item.operationType }}</span>
          </div>
          <div v-if="item.operationType == '回复' || (item.operationType == '驳回' && item.replyContent != '')" style="width: 100%">
            <div style="overflow: hidden; width: 100%">
              <span class="label">内 容：</span>
              <span class="labelContent">{{ item.replyContent }}</span>
            </div>
          </div>
          <div style="overflow: hidden; width: 100%" v-if="item.caseOption == '驳回'">
            <span class="label">详 情：</span>
            <a class="labelContent" @click="exportXls(item.id)">查看内容</a>
          </div>
          <div style="overflow: hidden; width: 100%">
            <span class="label">操作人：</span>
            <span class="labelContent">{{ item.operationOrgCode }}</span>
          </div>
          <div style="overflow: hidden; width: 100%">
            <span class="label">时 间：</span>
            <span class="labelContent">{{ item.operationTime }}</span>
          </div>
          <!-- <div style="overflow: hidden; width: 100%">
            <span class="label">备 注：</span>
            <span class="labelContent">{{ item.remarks }}</span>
          </div> -->
          <div v-if="item.attachments" style="overflow: hidden; width: 100%; margin-bottom: 30px">
            <span class="label">附 件：</span>
            <div class="labelContent">
              <a style="display: block" v-for="elem in item.attachments" @click="handlePreview(elem)" :key="elem.storageId">{{ elem.storageName }}</a>
            </div>
          </div>
        </template>
      </a-step>
    </a-steps>
  </div>
</template>
<script lang="ts" setup>
  import { getTemporaryPath } from '/@/api/common/api';
  import { operationReportExport } from '/@/api/supervise/index';
  import { exportMethod, downFile } from '/@/utils/file/download';
  // let caseRecordVos = <any>([]);
  // 声明props
  const props = defineProps({
    caseRecordVos: {
      type: Array,
      default: [],
    },
    supId: {
      type: String,
      default: '',
    },
    templateId: {
      type: String,
      default: '',
    },
    has_city_fgw_Role: {
      type: Boolean,
      default: false,
    },
  });
  const handlePreview = async (val) => {
    const url = await getTemporaryPath({ storageId: val.storageId });
    // window.open(url, val.storageName);
    downFile(url, val.storageName);
  };

  //导出
  const download = () => {
    exportMethod(operationReportExport, `操作记录.xlsx`, { templateId: props.templateId, supId: props.supId });
  };
</script>

<style scoped>
  .card_branch {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .card_title {
    color: #333;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  .export_btn {
    width: 100px;
    height: 32px;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    background: #4877f3;
  }
  .label {
    font-weight: bolder;
    float: left;
    width: 70px;
    text-align: justify;
    text-align-last: justify;
  }
  .labelContent {
    float: right;
    text-align: left;
    width: calc(100% - 70px);
  }
</style>
