import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { enterpriseEntMangerEnumList } from './index.api';
import dayjs from "dayjs";

export const columns: BasicColumn[] = [
    {
        title: '企业管家姓名',
        dataIndex: 'realname',
        width: 120,
    },
    {
        title: '所属部门',
        dataIndex: 'departName',
        width: 120,
    },
    {
        title: '管家级别',
        dataIndex: 'gradeText',
        width: 120,
    },
    {
        title: '手机号',
        dataIndex: 'phone',
        width: 120,
    },
    {
        title: '开始服务时间',
        dataIndex: 'startDate',
    },
    {
        title: '结束服务时间',
        dataIndex: 'endDate',
    },
    {
        title: '服务企业总数',
        dataIndex: 'entNum',
        width: 120,
    },
];

/**
 * 查看企业绑定 表格列
 */
export const previewModalColumns: BasicColumn[] = [
    {
        title: '企业名称',
        dataIndex: 'entName',
    },
    {
        title: '统一社会信用代码',
        dataIndex: 'creditCode',
    },
    {
        title: '绑定时间',
        dataIndex: 'bindTime',
        format: (date: string): string => {
            return date ? dayjs(date).format('YYYY年MM月DD日') : date
        }
    }
];

/**
 * 企业绑定 表格列
 */
export const modalColumns: BasicColumn[] = [
    {
        title: '企业名称',
        dataIndex: 'entName',
    },
    {
        title: '统一社会信用代码',
        dataIndex: 'creditCode',
        sorter: true,
    },
    {
        title: '企业激活时间',
        dataIndex: 'bindTime',
        sorter: true,
        format: (date: string): string => {
            return date ? dayjs(date).format('YYYY年MM月DD日') : date
        }
    }
];



export const searchFormSchema: FormSchema[] = [
    {
        label: '企业管家',
        field: 'realName',
        component: 'Input',
    },
    {
        label: '管家级别',
        field: 'grade',
        component: 'ApiSelect',
        componentProps: {
            placeholder: '请选择管家级别',
            api: enterpriseEntMangerEnumList,
            labelField: 'dictText',
            valueField: 'dictValue',
            // resultField: 'mangerGrade'
        },
    },
];

export const modalSearchFormSchema: FormSchema[] = [
    {
        label: '',
        field: 'entNameOrCode',
        component: 'Input',
        componentProps: {
            placeholder: '请输入企业名称或社会信用代码',
        }
    },
];




