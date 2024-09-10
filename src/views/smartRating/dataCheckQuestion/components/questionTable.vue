<template>
  <BasicTable @register="registerTable" :rowSelection="rowSelection">
    <template #cityData="{ text, record, column }">
      <div v-if="record[`checkCity${column.dataIndex.split('city')[1]}`]">
        <span style="text-decoration: line-through; margin-right: 10px">{{ text }}</span>
        <span style="color: #1790ff">{{ record[`checkCity${column.dataIndex.split('city')[1]}`] }}</span>
      </div>
      <div v-else :title="text" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ text }}</div>
    </template>
    <!--操作栏-->
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <a-modal v-model:visible="visible" width="70vw" title="详情">
    <template #footer>
      <a-button v-if="status == 1" key="submit" type="primary" :loading="loading" @click="handleOk">修订</a-button>
      <a-button key="back" @click="handleCancel">关闭</a-button>
    </template>
    <div class="modalBody">
      <div class="modalInfo">
        <div class="infoWraper">
          <div class="infoLabel">指标项说明</div>
          <div style="height: 120px" class="infoDesc">{{ infos.description }}</div>
        </div>
        <div class="infoWraper">
          <div class="infoLabel">权重</div>
          <div class="infoDesc">{{ infos.weightValue }}</div>
        </div>
        <div class="infoWraper">
          <div class="infoLabel">计分方法</div>
          <div class="infoDesc infoType" @click="showConfig(infos)">{{ infos.configTypeText }}</div>
        </div>
      </div>
      <div v-if="modalType === 1" class="modalTable">
        <a-table :dataSource="datas" :columns="listColums" :pagination="false">
          <template #lastAnswer="{ record }">
            <a-input-number :controls="false" v-model:value="record.lastAnswer" @change="gatherChange(record)" placeholder="请输入" :disabled="!record.answerId || status == 0"></a-input-number>
          </template>
          <template #textAnswer="{ record }">
            <a-textarea v-model:value="record.lastAnswer" @change="gatherChange(record)" placeholder="请输入" :rows="4" :disabled="!record.answerId || status == 0"/>
          </template>
          <template #prove="{ record }">
            <a v-if="record.evidence" @click="handleDownloadFile(record.cityName, record.evidence)" href="javascript:;">下载</a>
          </template>
          <template #action="{ record, index }">
            <a v-if="record.answerId" href="javascript:;" @click="toFillRemark(record, index)">备注</a>
          </template>
        </a-table>
      </div>
      <div v-if="modalType === 2" class="modalTable">
        <a-table :dataSource="datas" :columns="listColums" :pagination="false">
          <template #score="{ record }">
            <a-input-number :controls="false" v-model:value="record.score" placeholder="待赋分" @change="checkScoreChange(record)" :disabled="!record.answerId || status == 0"></a-input-number>
          </template>
          <template #prove="{ record }">
            <a v-if="record.evidence" @click="handleDownloadFile(record.cityName, record.evidence)" href="javascript:;">下载</a>
          </template>
          <template #action="{ record, index }">
            <a v-if="record.answerId" href="javascript:;" @click="toFillRemark(record, index)">备注</a>
          </template>
        </a-table>
      </div>
      <div v-if="modalType === 3" class="modalTable">
        <a-table :dataSource="datas" :columns="listColums" :pagination="false">
          <template #lastAnswer="{ record }">
            <a-input-number :controls="false" v-model:value="record.lastAnswer" @change="gatherChange(record)" placeholder="请输入" :disabled="!record.answerId || status == 0"></a-input-number>
          </template>
          <template #calculateRule="{ record }">
            <a-select
              ref="select"
              placeholder="请选择"
              v-model:value="record.calculateRule"
              @change="ruleChange(record)"
              :disabled="!record.answerId || status == 0"
            >
              <a-select-option value=">">{{ '>' }}</a-select-option>
              <a-select-option value="=">{{ '=' }}</a-select-option>
              <a-select-option value="<">{{ '<' }}</a-select-option>
            </a-select>
          </template>
          <template #fullMarkStandard="{ record, index }">
            <a-input-number :controls="false" v-model:value="record.fullMarkStandard" @change="scoreChange(record, index)" placeholder="请输入" :disabled="!record.answerId || status == 0"></a-input-number>
          </template>
          <template #deviateVal="{ record }">
            <a-input-number :controls="false" v-if="record.showDeviateVal" v-model:value="record.deviateVal" @change="deviateChange(record)" placeholder="请输入" :disabled="!record.answerId || status == 0"></a-input-number>
            <div v-else>0</div>
          </template>
          <template #prove="{ record }">
            <a v-if="record.evidence" @click="handleDownloadFile(record.cityName, record.evidence)" href="javascript:;">下载</a>
          </template>
          <template #action="{ record, index }">
            <a v-if="record.answerId" href="javascript:;" @click="toFillRemark(record, index)">备注</a>
          </template>
        </a-table>
      </div>
      <div v-if="modalType === 4" class="modalTable">
        <a-table :dataSource="datas" :columns="listColums" :pagination="false">
          <template #lastAnswer="{ record }">
            <a-input-number :controls="false" v-model:value="record.lastAnswer" @change="gatherChange(record)" placeholder="请输入" :disabled="!record.answerId || status == 0"></a-input-number>
          </template>
          <template #calculateRule="{ record }">
            <div>{{ '<=' }}</div>
          </template>
          <template #fullMarkStandard="{ record, index }">
            <a-input-number :controls="false" v-model:value="record.fullMarkStandard" @change="scoreChange(record, index)" placeholder="请输入" :disabled="!record.answerId || status == 0"></a-input-number>
          </template>
          <template #deviateVal="{ record }">
            <div>{{ record.deviateVal }}</div>
          </template>
          <template #prove="{ record }">
            <a v-if="record.evidence" @click="handleDownloadFile(record.cityName, record.evidence)" href="javascript:;">下载</a>
          </template>
          <template #action="{ record, index }">
            <a v-if="record.answerId" href="javascript:;" @click="toFillRemark(record, index)">备注</a>
          </template>
        </a-table>
      </div>
      <div v-if="modalType === 5" class="modalTable">
        <a-table :dataSource="datas" :columns="listColums" :pagination="false">
          <template #lastAnswer="{ record }">
            <a-input-number :controls="false" v-model:value="record.lastAnswer" @change="gatherChange(record)" placeholder="请输入" :disabled="!record.answerId || status == 0"></a-input-number>
          </template>
          <template #calculateRule="{ record }">
            <div>{{ '>=' }}</div>
          </template>
          <template #fullMarkStandard="{ record, index }">
            <a-input-number :controls="false" v-model:value="record.fullMarkStandard" @change="scoreChange(record, index)" placeholder="请输入" :disabled="!record.answerId || status == 0"></a-input-number>
          </template>
          <template #deviateVal="{ record }">
            <div>{{ record.deviateVal }}</div>
          </template>
          <template #prove="{ record }">
            <a v-if="record.evidence" @click="handleDownloadFile(record.cityName, record.evidence)" href="javascript:;">下载</a>
          </template>
          <template #action="{ record, index }">
            <a v-if="record.answerId" href="javascript:;" @click="toFillRemark(record, index)">备注</a>
          </template>
        </a-table>
      </div>
    </div>
  </a-modal>
  <a-modal v-model:visible="visibleRemark" title="备注" @ok="handleOkRemark">
    <template #footer>
      <a-button v-if="status == 1" key="submit" type="primary" :loading="loadingRemark" @click="handleOkRemark">保存</a-button>
      <a-button key="back" @click="handleCancelRemark">关闭</a-button>
    </template>
    <div class="remarkWrap">
      <a-textarea v-model:value="remarksValue" placeholder="请输入备注" :rows="4" :disabled="status == 0"/>
    </div>
  </a-modal>

  <configModal @register="registerModal" :disabled="true" modalType="project"></configModal>
</template>

<script lang="ts" name="system-user" setup>
  import { useRoute, useRouter } from 'vue-router';
  import { ref, reactive, toRefs, onMounted, createVNode, provide, Ref, nextTick } from 'vue';
  import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  //   import { columns } from './questionData';
  import { queryCheckQuestionList, checkAnswer, downloadEvidence } from '/@/api/smartRating/index';
  import { BasicColumn } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { exportMethod } from '/@/utils/file/download';
  import { deepCopy } from '/@/utils/deepCopy';
  import configModal from '../../../indicatorManagement/indicatorAlgorithmConfiguration/components/configModal.vue'
  //   声明路由
  const router = useRouter();
  let cityList = <any>[];
  let questionId = <any>('');
  let status = <any>('');
  // let resetColumn = <any>[];
  // let resetSource = <any>[];

  // 禁止勾选
  //   const getCheckboxProps = (record) => {
  //     //禁用的方法
  //     return {
  //       disabled: record.activateStatus != '2',
  //     };
  //   };

  const [registerModal, { openModal } ] = useModal();

  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    tableProps: {
      size: 'small',
      scroll: { x: 1300 },
      useSearchForm: false,
      pagination: false,
      expandRowByClick: true,
      showTableSetting: false,
      striped:true,//斑马纹设置
      actionColumn: {
        width: 250,
        fixed: 'right',
      },
      rowKey: 'id',
      rowSelection: {
        preserveSelectedRowKeys: false,
        // getCheckboxProps: getCheckboxProps,
      },
      showActionColumn: false,
      // 请求之前对参数做处理
      beforeFetch() {},
    },
  });

  //注册table数据
  const [registerTable, { rowSelection, setProps, reload }] = tableContext;

  const getQuestionList = (id: any, type: any) => {
    status = type;
    questionId = id;
    queryCheckQuestionList({ indicatorId: id }).then((res) => {
      let columns: BasicColumn[] = [
        {
          title: '指标项说明',
          dataIndex: 'description',
          width: 250,
        },
        {
          title: '单位',
          width: 80,
          dataIndex: 'unit',
        },
        {
          title: '指标项类型',
          width: 150,
          dataIndex: 'questionTypeText',
        },
        {
          title: '计分方法',
          width: 100,
          dataIndex: 'configTypeText',
        },
        {
          title: '前沿对标值',
          width: 100,
          dataIndex: 'standardValue',
        },
        {
          title: '报送部门',
          width: 120,
          dataIndex: 'sendUser',
        },
      ];
      let city = res.columns;
      cityList = res.columns;
      let source = res.datasource;
      city.map((el, index) => {
        columns.push({
          title: el.title,
          width: 100,
          dataIndex: `city${index + 1}`,
          slots: { customRender: 'cityData' },
        });
      });
      source.map((el) => {
        city.map((item, index) => {
          el[`city${index + 1}`] = '--';
        });
        if (el.answerList) {
          el.answerList.map((item) => {
            if (item.checkAnswer) {
              let n = city.findIndex((els) => els.dataIndex == item.dataIndex);
              if (n != -1) el[`city${n + 1}`] = item.answer;
              if (n != -1) el[`checkCity${n + 1}`] = item.checkAnswer;
            } else {
              let n = city.findIndex((els) => els.dataIndex == item.dataIndex);
              if (n != -1) el[`city${n + 1}`] = item.answer;
            }
          });
        }
      });
      console.log('source:::', source);

      reload();
      // resetColumn = columns;
      // resetSource = deepCopy(source);
      setProps({ columns: columns, dataSource: source, showActionColumn: true });
    });
  };

  /**
   * 操作栏
   */
  function getTableAction(record: any): ActionItem[] {
    return [
      //   {
      //     label: '激活',
      //     popConfirm: {
      //       title: '是否确认激活当前采集任务？',
      //       confirm: handleActive.bind(null, record),
      //     },
      //     ifShow: () => {
      //       return record.activateStatus == '1';
      //     },
      //   },
      //   {
      //     label: '配置算法',
      //     onClick: toNextPage.bind(null, record, 'algorithm'),
      //     ifShow: () => {
      //       return record.activateStatus != '1';
      //     },
      //   },
      {
        label: '修订',
        onClick: toOpenModal.bind(null, record),
        ifShow: () => {
          return status == 1;
        },
      },
      {
        label: '查看',
        onClick: toOpenModal.bind(null, record),
        ifShow: () => {
          return status == 0;
        },
      },
      //   {
      //     label: '删除',
      //     popConfirm: {
      //       title: '是否确认删除？',
      //       confirm: handleDelete.bind(null, record),
      //     },
      //     ifShow: () => {
      //       return record.activateStatus == '1';
      //     },
      //   },
    ];
  }

  const { createMessage } = useMessage();
  let loading = ref<boolean>(false);
  let visible = ref<boolean>(false);
  let loadingRemark = ref<boolean>(false);
  let visibleRemark = ref<boolean>(false);
  let infos = ref<any>({});
  let modalType = ref<any>(0);
  let datas = ref<any>([]);
  let listColums = ref<any>([]);
  let recordIndex = <any>(0);
  let remarksValue = ref<string>('');

  const handleOk = () => {
    loading.value = true;
    console.log('datas:::', datas);
    try {
      checkAnswer(datas).then(res => {
        // console.log('res:::', res);
        loading.value = false;
        visible.value = false;
        getQuestionList(questionId, status);
      }).catch(error => {
        // console.log('error:::', error);
        loading.value = false;
        visible.value = false;
      });
    } catch(err) {
      // console.log('err:::', err);
      loading.value = false;
      visible.value = false;
    }
  };

  const handleCancel = () => {
    visible.value = false;
    getQuestionList(questionId, status);
    // setProps({ columns: resetColumn, dataSource: resetSource, showActionColumn: true });
  };
  
  const handleOkRemark = () => {
    loadingRemark.value = true;
    datas[recordIndex].remark = remarksValue.value;
    nextTick(() => {
      loadingRemark.value = false;
      visibleRemark.value = false;
    });
  };

  const showConfig = (record) => {
    openModal(true, record);
  };

  const handleCancelRemark = () => {
    visibleRemark.value = false;
  };

  const gatherChange = (record) => {
    record.isUpdate = true;
    if (modalType === 3 || modalType === 4 || modalType === 5) {
      if(!record.calculateRule) {
        createMessage.warning('请先选择一个计算规则！');
        record.fullMarkStandard = null;
        return
      };
      const fullMarkStandard = Number(record.fullMarkStandard);
      record.fullMarkStandard = record.fullMarkStandard;
      record.calculateRule = record.calculateRule;
      record.isUpdate = true;
      switch (modalType) {
        case 3:
          if(record.calculateRule === '=') {
            if(record.lastAnswer == fullMarkStandard) {
              record.deviateVal = null;
              record.showDeviateVal = false;
            } else {
              record.showDeviateVal = true;
            };
          } else if(record.calculateRule === '<') {
            if(record.lastAnswer < fullMarkStandard) {
              record.deviateVal = null;
              record.showDeviateVal = false;
            } else {
              record.showDeviateVal = true;
            };
          } else if(record.calculateRule === '>') {
            if(record.lastAnswer > fullMarkStandard) {
              record.deviateVal = null;
              record.showDeviateVal = false;
            } else {
              record.showDeviateVal = true;
            };
          }
          break;
        case 4:
          if(record.lastAnswer <= fullMarkStandard) {
            record.deviateVal = 0;
          } else {
            record.deviateVal = Math.ceil(record.lastAnswer - fullMarkStandard);
          };
          break;
        case 5:
          if(record.lastAnswer >= fullMarkStandard) {
            record.deviateVal = 0;
          } else {
            record.deviateVal = Math.ceil(fullMarkStandard - record.lastAnswer);
          };
          break;
        default:
          break;
      };
    };
  };

  const deviateChange = (record) => {
    record.isUpdate = true;
  };

  const checkScoreChange = (record) => {
    record.isUpdate = true;
  };

  const ruleChange = (record) => {
    datas.map(el => el.isUpdate = true );
    if(record.fullMarkStandard != null) {
      const fullMarkStandard = Number(record.fullMarkStandard);
      datas.map(el => {
        el.fullMarkStandard = record.fullMarkStandard;
        el.calculateRule = record.calculateRule;
        el.isUpdate = true;
        switch (modalType) {
          case 3:
            if(record.calculateRule === '=') {
              if(el.lastAnswer == fullMarkStandard || fullMarkStandard == 0) {
                el.deviateVal = null;
                el.showDeviateVal = false;
              } else {
                el.showDeviateVal = true;
              };
            } else if(record.calculateRule === '<') {
              if(el.lastAnswer < fullMarkStandard) {
                el.deviateVal = null;
                el.showDeviateVal = false;
              } else {
                el.showDeviateVal = true;
              };
            } else if(record.calculateRule === '>') {
              if(el.lastAnswer > fullMarkStandard) {
                el.deviateVal = null;
                el.showDeviateVal = false;
              } else {
                el.showDeviateVal = true;
              };
            }
            break;
          case 4:
            if(el.lastAnswer <= fullMarkStandard) {
              el.deviateVal = 0;
            } else {
              el.deviateVal = Math.ceil(fullMarkStandard - el.lastAnswer);
            };
            break;
          case 5:
            if(el.lastAnswer >= fullMarkStandard) {
              el.deviateVal = 0;
            } else {
              el.deviateVal = Math.ceil(el.lastAnswer - fullMarkStandard);
            };
            break;
          default:
            break;
        }
      });
    };
  };

  const toFillRemark = (record, index) => {
    visibleRemark.value = true;
    recordIndex = index;
    remarksValue.value = record.remark;
  };

  const scoreChange = (record, index) => {
    if(!record.calculateRule) {
      createMessage.warning('请先选择一个计算规则！');
      record.fullMarkStandard = null;
      return
    };
    const fullMarkStandard = Number(record.fullMarkStandard);
    datas.map(el => {
      el.fullMarkStandard = record.fullMarkStandard;
      el.calculateRule = record.calculateRule;
      el.isUpdate = true;
      switch (modalType) {
        case 3:
          if(record.calculateRule === '=') {
            if(el.lastAnswer == fullMarkStandard) {
              el.deviateVal = null;
              el.showDeviateVal = false;
            } else {
              el.showDeviateVal = true;
            };
          } else if(record.calculateRule === '<') {
            if(el.lastAnswer < fullMarkStandard) {
              el.deviateVal = null;
              el.showDeviateVal = false;
            } else {
              el.showDeviateVal = true;
            };
          } else if(record.calculateRule === '>') {
            if(el.lastAnswer > fullMarkStandard) {
              el.deviateVal = null;
              el.showDeviateVal = false;
            } else {
              el.showDeviateVal = true;
            };
          }
          break;
        case 4:
          if(el.lastAnswer <= fullMarkStandard) {
            el.deviateVal = 0;
          } else {
            el.deviateVal = Math.ceil(el.lastAnswer - fullMarkStandard);
          };
          break;
        case 5:
          if(el.lastAnswer >= fullMarkStandard) {
            el.deviateVal = 0;
          } else {
            el.deviateVal = Math.ceil(fullMarkStandard - el.lastAnswer);
          };
          break;
        default:
          break;
      }
    });
  };

  // 跳转问题校核页面
  const toOpenModal = (record) => {
    console.log('record:::', record);
    infos = record;
    switch (record.configType) {
      case 'layer':
      case 'efficacy':
      case 'monitor':
        // 层差法、功效法、监测点取值法
        modalType = 1;
        if (record.answerList) {
          record.answerList.map((item) => {
            let n = cityList.findIndex((els) => els.dataIndex == item.dataIndex);
            item.cityName = cityList[n].title;
            item.unit = record.unit;
            item.remark = item.remark || '';
            item.isUpdate = false;
          });
          datas = record.answerList;
        };
        listColums = [
          {
            title: '城市名称',
            dataIndex: 'cityName',
            align: 'center',
          },
          {
            title: '采集数据',
            dataIndex: 'lastAnswer',
            align: 'center',
            slots: { customRender: 'lastAnswer' },
          },
          {
            title: '单位',
            dataIndex: 'unit',
            align: 'center',
          },
          {
            title: '佐证',
            dataIndex: '',
            align: 'center',
            slots: { customRender: 'prove' },
          },
          {
            title: '操作',
            dataIndex: 'remark',
            align: 'center',
            slots: { customRender: 'action' },
          },
        ];
        break;
      case 'mark':
        // 直接赋分法
        modalType = 2;
        if (record.answerList) {
          record.answerList.map((item) => {
            let n = cityList.findIndex((els) => els.dataIndex == item.dataIndex);
            item.cityName = cityList[n].title;
            item.score = item.score || '';
            item.remark = item.remark || '';
            item.isUpdate = false;
          });
          datas = record.answerList;
        }
        listColums = [
          {
            title: '城市名称',
            dataIndex: 'cityName',
            align: 'center',
          },
          {
            title: '采集数据',
            dataIndex: 'answer',
            align: 'center',
          },
          {
            title: '得分',
            dataIndex: 'score',
            align: 'center',
            slots: { customRender: 'score' },
          },
          {
            title: '佐证',
            dataIndex: '',
            align: 'center',
            slots: { customRender: 'prove' },
          },
          {
            title: '操作',
            dataIndex: 'remark',
            align: 'center',
            slots: { customRender: 'action' },
          },
        ];
        break;
      case 'deduct':
        switch (record.deductAccord) {
          case 'case':
            // 案例扣分式
            modalType = 3;
            if (record.answerList) {
              record.answerList.map((item) => {
                let n = cityList.findIndex((els) => els.dataIndex == item.dataIndex);
                item.cityName = cityList[n].title;
                item.unit = record.unit;
                item.remark = item.remark || '';
                item.calculateRule = item.calculateRule || null;
                item.fullMarkStandard = item.fullMarkStandard === null ? null : item.fullMarkStandard;
                item.deviateVal = item.deviateVal || 0;
                item.showDeviateVal = item.showDeviateVal || true;
                item.isUpdate = false;
              });
              datas = record.answerList;
            }
            listColums = [
              {
                title: '城市名称',
                dataIndex: 'cityName',
                width: 150,
                align: 'center',
              },
              {
                title: '采集数据',
                dataIndex: 'lastAnswer',
                width: 120,
                align: 'center',
                slots: { customRender: 'lastAnswer' },
              },
              {
                title: '单位',
                dataIndex: 'unit',
                width: 80,
                align: 'center',
              },
              {
                title: '运算符号',
                dataIndex: 'calculateRule',
                width: 120,
                align: 'center',
                slots: { customRender: 'calculateRule' },
                customCell: (_, index) => {
                  if(index === 0) {
                    return { rowSpan: datas.length };
                  } else {
                    return { rowSpan: 0 };
                  }
                },
              },
              {
                title: '满分标准',
                dataIndex: 'fullMarkStandard',
                width: 120,
                align: 'center',
                slots: { customRender: 'fullMarkStandard' },
                customCell: (_, index) => {
                  if(index === 0) {
                    return { rowSpan: datas.length };
                  } else {
                    return { rowSpan: 0 };
                  }
                },
              },
              {
                title: '发现个数',
                dataIndex: 'deviateVal',
                width: 120,
                align: 'center',
                slots: { customRender: 'deviateVal' },
              },
              {
                title: '佐证',
                dataIndex: '',
                width: 80,
                align: 'center',
                slots: { customRender: 'prove' },
              },
              {
                title: '操作',
                dataIndex: 'remark',
                width: 80,
                align: 'center',
                slots: { customRender: 'action' },
              },
            ];
            break;
          case 'positiveDeviate':
            // infos.configTypeText = '正向偏离扣分式';
            // 正向偏离扣分式
            modalType = 4;
            if (record.answerList) {
              record.answerList.map((item) => {
                let n = cityList.findIndex((els) => els.dataIndex == item.dataIndex);
                item.cityName = cityList[n].title;
                item.unit = record.unit;
                item.remark = item.remark || '';
                item.calculateRule = '<=';
                item.fullMarkStandard = item.fullMarkStandard === null ? null : item.fullMarkStandard;
                item.deviateVal = item.deviateVal || 0;
                item.isUpdate = false;
              });
              datas = record.answerList;
            }
            listColums = [
              {
                title: '城市名称',
                dataIndex: 'cityName',
                width: 150,
                align: 'center',
              },
              {
                title: '采集数据',
                dataIndex: 'lastAnswer',
                width: 120,
                align: 'center',
                slots: { customRender: 'lastAnswer' },
              },
              {
                title: '单位',
                dataIndex: 'unit',
                width: 80,
                align: 'center',
              },
              {
                title: '运算符号',
                dataIndex: 'calculateRule',
                width: 120,
                align: 'center',
                slots: { customRender: 'calculateRule' },
                customCell: (_, index) => {
                  if(index === 0) {
                    return { rowSpan: datas.length };
                  } else {
                    return { rowSpan: 0 };
                  }
                },
              },
              {
                title: '满分标准',
                dataIndex: 'fullMarkStandard',
                width: 120,
                align: 'center',
                slots: { customRender: 'fullMarkStandard' },
                customCell: (_, index) => {
                  if(index === 0) {
                    return { rowSpan: datas.length };
                  } else {
                    return { rowSpan: 0 };
                  }
                },
              },
              {
                title: '偏离值',
                dataIndex: 'deviateVal',
                width: 120,
                align: 'center',
                slots: { customRender: 'deviateVal' },
              },
              {
                title: '佐证',
                dataIndex: '',
                width: 80,
                align: 'center',
                slots: { customRender: 'prove' },
              },
              {
                title: '操作',
                dataIndex: 'remark',
                width: 80,
                align: 'center',
                slots: { customRender: 'action' },
              },
            ];
            break;
          case 'negativeCase':
            // infos.configTypeText = '负向偏离扣分式';
            // 负向偏离扣分式
            modalType = 5;
            if (record.answerList) {
              record.answerList.map((item) => {
                let n = cityList.findIndex((els) => els.dataIndex == item.dataIndex);
                item.cityName = cityList[n].title;
                item.unit = record.unit;
                item.remark = item.remark || '';
                item.calculateRule = '>=';
                item.fullMarkStandard = item.fullMarkStandard === null ? null : item.fullMarkStandard;
                item.deviateVal = item.deviateVal || 0;
                item.isUpdate = false;
              });
              datas = record.answerList;
            }
            listColums = [
              {
                title: '城市名称',
                dataIndex: 'cityName',
                width: 150,
                align: 'center',
              },
              {
                title: '采集数据',
                dataIndex: 'lastAnswer',
                width: 120,
                align: 'center',
                slots: { customRender: 'lastAnswer' },
              },
              {
                title: '单位',
                dataIndex: 'unit',
                width: 80,
                align: 'center',
              },
              {
                title: '运算符号',
                dataIndex: 'calculateRule',
                width: 120,
                align: 'center',
                slots: { customRender: 'calculateRule' },
                customCell: (_, index) => {
                  if(index === 0) {
                    return { rowSpan: datas.length };
                  } else {
                    return { rowSpan: 0 };
                  }
                },
              },
              {
                title: '满分标准',
                dataIndex: 'fullMarkStandard',
                width: 120,
                align: 'center',
                slots: { customRender: 'fullMarkStandard' },
                customCell: (_, index) => {
                  if(index === 0) {
                    return { rowSpan: datas.length };
                  } else {
                    return { rowSpan: 0 };
                  }
                },
              },
              {
                title: '偏离值',
                dataIndex: 'deviateVal',
                width: 120,
                align: 'center',
                slots: { customRender: 'deviateVal' },
              },
              {
                title: '佐证',
                dataIndex: '',
                width: 80,
                align: 'center',
                slots: { customRender: 'prove' },
              },
              {
                title: '操作',
                dataIndex: 'remark',
                width: 80,
                align: 'center',
                slots: { customRender: 'action' },
              },
            ];
            break;
          default:
        }
        break;
      default:
        if(record.questionType === 'text') {
          // 文本类
          modalType = 1;
          if (record.answerList) {
            record.answerList.map((item) => {
              let n = cityList.findIndex((els) => els.dataIndex == item.dataIndex);
              item.cityName = cityList[n].title;
              item.unit = record.unit;
              item.remark = item.remark || '';
              item.isUpdate = false;
            });
            datas = record.answerList;
          };
          listColums = [
            {
              title: '城市名称',
              dataIndex: 'cityName',
              align: 'center',
            },
            {
              title: '采集数据',
              dataIndex: 'lastAnswer',
              align: 'center',
              slots: { customRender: 'textAnswer' },
            },
            {
              title: '佐证',
              dataIndex: '',
              align: 'center',
              slots: { customRender: 'prove' },
            },
            {
              title: '操作',
              dataIndex: 'remark',
              align: 'center',
              slots: { customRender: 'action' },
            },
          ];
        } else {
          // 默认
          modalType = 1;
          if (record.answerList) {
            record.answerList.map((item) => {
              let n = cityList.findIndex((els) => els.dataIndex == item.dataIndex);
              item.cityName = cityList[n].title;
              item.unit = record.unit;
              item.remark = item.remark || '';
              item.isUpdate = false;
            });
            datas = record.answerList;
          };
          listColums = [
            {
              title: '城市名称',
              dataIndex: 'cityName',
              align: 'center',
            },
            {
              title: '采集数据',
              dataIndex: 'lastAnswer',
              align: 'center',
              slots: { customRender: 'lastAnswer' },
            },
            {
              title: '单位',
              dataIndex: 'unit',
              align: 'center',
            },
            {
              title: '佐证',
              dataIndex: '',
              align: 'center',
              slots: { customRender: 'prove' },
            },
            {
              title: '操作',
              dataIndex: 'remark',
              align: 'center',
              slots: { customRender: 'action' },
            },
          ];
        };
        break;
    };
    visible.value = true;
  };

  // 佐证下载
  const handleDownloadFile = (name: string, ids: string) => {
    exportMethod(downloadEvidence, `${name}-佐证文件.zip`, { fileIds: ids });
  };
  
  // 输出组件的方法，让外部组件可以调用
  defineExpose({
    getQuestionList,
  });
</script>

<style lang="less" scoped>
  .modalBody {
    height: 65vh;
    overflow: hidden;
    overflow-y: scroll;
    padding: 20px 30px;
    display: flex;
    justify-content: space-between;
    .modalInfo {
      .infoLabel {
        margin-top: 20px;
        font-size: 18px;
        font-weight: bold;
      }
      .infoType {
        cursor: pointer;
        color: #1890ff;
      }
      .infoDesc {
      }
    }
    .modalTable {
      min-width: 40vw;
    }
  }
  .remarkWrap {
    padding: 20px 40px;
  }
</style>
