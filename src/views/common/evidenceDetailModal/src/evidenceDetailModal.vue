<template>
  <BasicModal v-bind="$attrs" :title="`查看佐证`" width="1000px" @visible-change="onVisibleChange">
    <template v-if="unify">
      <a-button type="primary" @click="() => handleDownloadFile(getUnifyDonwloadInfo.name, getUnifyDonwloadInfo.ids)">批量下载</a-button>
      <div class="file" v-for="file in fileInfo" :key="file.filePath">
        {{ file.fileName }}
        <span class="download-text" @click="() => download(file.filePath)">下载</span>
      </div>
    </template>
    <template v-else>
      <a-table bordered :columns="tableColumn" :dataSource="tableData" :pagination="false">
        <template #headerCell="{ column }">
          <div class="column-title">
            <div class="title">
              {{ column.title }}
            </div>
            <DownloadOutlined class="icon" @click="() => handleDownloadFile(column.title, column.filePath)" />
          </div>
        </template>
        <template #bodyCell="{ record, column }">
          <div class="download-text" @click="download(item.storageId)" v-for="item in record[`${column.dataIndex}_files`]" :key="item.id">
            {{ item.storageName }}
          </div>
        </template>
      </a-table>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup name="evidenceDetailModal">
  import { ref, computed, nextTick } from 'vue';
  import { TableColumnType } from 'ant-design-vue';
  import { DownloadOutlined } from '@ant-design/icons-vue';
  import { getTemporaryPath } from '/@/api/common/api';
  import { queryEvidence, downloadEvidence } from '/@/api/indicatorManagement';
  import { BasicModal } from '/@/components/Modal';
  import { EvidenceFile } from '..';
  import { downloadFn } from '/@/utils/perry';
  import { exportMethod } from '/@/utils/file/download';

  interface EvidenceDetailModalProps {
    questionId: string;
    sendDepartId?: string;
    sendUserId?: string;
  }

  const props = withDefaults(defineProps<EvidenceDetailModalProps>(), {
    questionId: '',
    sendDepartId: '',
    sendUserId: '',
  });

  const unify = ref(true);
  const fileInfo = ref<{ fileName: string; filePath: string }[]>([]);
  const tableColumn = ref<(TableColumnType & { filePath: string })[]>([]);
  const tableData = ref<{ [key: string]: string | EvidenceFile[] }[]>([]);

  const onVisibleChange = (val) => {
    if (val) {
      nextTick(() => {
        getEvidence();
      })
    }
  };

  const getEvidence = async () => {
    const parmas = {
      questionId: props.questionId,
      sendDepartId: props.sendDepartId,
      sendUserId: props.sendUserId,
    };
    queryEvidence(parmas).then((res) => {
      if (!res) {
        unify.value = true;
        fileInfo.value = [];
        return;
      }

      unify.value = res.type !== '1';
      // 独立上传文件类型
      if (res.type === '1') {
        tableColumn.value = [];
        const tableObj = {};
        tableData.value = [];

        res.file.forEach((i) => {
          tableObj[i.departId] = i.attachments.map((i) => `${i.storageName}.${i.storageType}`).join('，');
          tableObj[`${i.departId}_files`] = i.attachments;

          tableColumn.value.push({
            title: i.departName,
            dataIndex: i.departId,
            width: 100,
            filePath: i.filePath,
          });
        });

        tableData.value.push(tableObj);

        return;
      }

      // 统一上传类型
      if (!res.file.length || !res.file[0].attachments.length) {
        fileInfo.value = [];
        return;
      }

      fileInfo.value = res.file[0].attachments.map((i) => ({
        fileName: i.storageName,
        filePath: i.storageId,
      }));
    });
  };

  const getUnifyDonwloadInfo = computed(() => {
    return {
      name: fileInfo.value.map((i) => i.fileName).join(','),
      ids: fileInfo.value.map((i) => i.filePath).join(','),
    };
  });

  const download = async (id) => {
    const url = await getTemporaryPath({ storageId: id });
    downloadFn(url);
  };

  const handleDownloadFile = (name: string, ids: string) => {
    exportMethod(downloadEvidence, `${name}-佐证文件.zip`, { fileIds: ids });
  };
</script>

<style lang="less" scoped>
  /deep/ .ant-table .download-text,
  .download-text {
    color: #40a9ff;
    cursor: pointer;
    margin-left: 10px;
  }

  .column-title {
    display: flex;
    align-items: center;

    .title {
      margin-right: 10px;
    }
    .icon {
      position: relative;
      top: 1px;
      cursor: pointer;

      &:hover {
        color: #6fbdfe;
      }
    }
  }
</style>
