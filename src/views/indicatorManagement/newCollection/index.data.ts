/*
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-20 18:02:20
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-10-20 18:32:31
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\index.data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '任务名称',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '指标体系名称',
    dataIndex: 'templateName',
    width: 120,
  },

  {
    title: '采集范围',
    width: 150,
    dataIndex: 'monitorTypeName',
  },
  {
    title: '发起部门',
    width: 150,
    dataIndex: 'createDepart',
  },
  {
    title: '发起时间',
    width: 150,
    dataIndex: 'activateTime',
  },
  {
    title: '校核状态',
    width: 150,
    dataIndex: 'checkStatusText',
  },
  {
    title: '采集状态',
    width: 150,
    dataIndex: 'projectStatusText',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'projectName',
    component: 'Input',
    label: '任务名称',
    componentProps: {
      placeholder: '请输入',
    },
  },
  {
    field: 'templateName',
    component: 'Input',
    label: '指标体系名称',
    componentProps: {
      placeholder: '请输入',
    },
  },
  // {
  //   label: '采集范围',
  //   field: 'monitorType',
  //   component: 'JDictSelectTag',
  //   componentProps: () => {
  //     return {
  //       dictCode: 'monitor_type',
  //     };
  //   },
  // },
  // {
  //   field: 'createTime',
  //   component: 'RangePicker',
  //   label: '创建日期',
  //   componentProps: {
  //     valueType: 'Date',
  //     // placeholder: ['开始时间', '结束时间'],
  //   },
  // },
  {
    label: '发起日期',
    field: 'createTime',
    component: 'RangePicker',
    componentProps: {
      valueType: 'Date',
    }
  },
];

// detail
export interface IndicatorProjectDetail {
  id: string; //	采集任务id
  activateStatus: '1' | '2' | '3'; //	项目状态 (已完成:3, 进行中:2,草稿:1)
  activateStatusText: string; //	激活状态
  activateTime: string; //	发起时间
  checkStatus: string; //	未知
  checkStatusText: string; //	未知
  createBy: string; //	发起人
  createDepart: string; //	发起部门
  createTime: string; //	创建时间
  monitorType: string; //	采集范围(1:地市级 2 :区级、3 :县（市）级)
  monitorTypeName: string; //	采集范围(1:地市级 2 :区级、3 :县（市）级)
  name: string; //	任务名称
  projectSendStatus: string;
  projectSendStatusText: string; //	报送状态 (0 未报送 1 已报送)
  projectStatusText: string; //	项目状态 (已完成:3, 进行中:2,草稿:1)
  templateId: string; //	模板id
  templateName: string; //
}

export type CollectInfoConfig = { title: string; value: keyof IndicatorProjectDetail }[];

// 采集进度-部门详情
export interface CollectDepartProcess {
  departName: string;
  id: string;
  orgCode: string;
  parentId: string;
  answerProcess: string;
  answerStatus: string;
}

export interface CollectIndicatorProcess {
  answerProcess: string;
  answerStatus: string;
  checkUser: string;
  configStatus: string;
  configStatusText: string;
  description: string;
  evidenceFlag: string;
  id: string;
  includeQuestion: string;
  indicatorName: string;
  indicatorType: string;
  openStatus: string;
  openStatusBoolean: boolean;
  parentId: string;
  projectId: string;
  sendDepart: string;
  submitStatus: string;
  submitStatusText: string;
  templateId: string;
  unit: string;
}

// 三级指标详情
export interface IndicatorProcessRrcord {
  checkUser: string;
  departTypeText: string;
  description: string;
  evidenceFile: boolean;
  evidenceFlag: string;
  id: string;
  processList: { process: string; dataIndex: string; sendUser: string }[];
  unit: string;
}
export interface IndicatorProcessDetail {
  columns: { title: string; dataIndex: string }[];
  datasource: IndicatorProcessRrcord[];
}
