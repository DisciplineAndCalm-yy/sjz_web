import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const citeTypeOptions = [{ label: '工作任务', value: '工作任务' }];

export const columns: BasicColumn[] = [
  {
    title: '模板名称',
    dataIndex: 'templateName',
    width: 120,
  },
  {
    title: '引用流程类型',
    dataIndex: 'citeType',
    width: 120,
  },
  {
    title: '编辑部门',
    dataIndex: 'departIdDesc',
    width: 120,
  },
  {
    title: '创建日期',
    dataIndex: 'createdTime',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'switchFlagDesc',
    width: 120,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '模版名称',
    field: 'templateName',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '引用流程类型',
    field: 'citeType',
    component: 'Select',
    componentProps: {
      options: citeTypeOptions,
    },
    colProps: { span: 6 },
  },
];

// 模板详情
export interface TemplateDetail {
  citeType: string;
  schemasJson: any;
  templateId: string;
  templateName: string;
}

export type BaseInfo = Pick<TemplateDetail, 'citeType' | 'templateName'>;
