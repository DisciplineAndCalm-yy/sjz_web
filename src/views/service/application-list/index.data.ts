/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-19 10:56:14
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-28 18:16:31
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/application-list/index.data.ts
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { enterpriseEntMangerApplyEnumList } from '../butler-binding/index.api'
import dayjs from "dayjs";




export const columns: BasicColumn[] = [
    {
        title: '企业名称',
        dataIndex: 'entName',
        width: 120,
    },
    {
        title: '统一社会信用代码',
        dataIndex: 'creditCode',
        width: 200,
    },
    {
        title: '企业规模',
        dataIndex: 'entScale',
        // dataIndex: 'entProperties',
        width: 120,
    },
    {
        title: '企业类型',
        dataIndex: 'entType',
        width: 120,
    },
    {
        title: '申请人手机号',
        dataIndex: 'phone',
        width: 120,
    },
    {
        title: '申请时间',
        dataIndex: 'createTime',
        width: 150,
    },
    {
        title: '绑定状态',
        dataIndex: 'statusText',
        width: 120,
    },
    {
        title: '备注',
        dataIndex: 'reason',
        width: 120,
    },
];



export const searchFormSchema: FormSchema[] = [
    {
        label: '企业名称',
        field: 'entName',
        component: 'Input',
    },
    {
        label: '申请时间',
        field: 'Date',
        component: 'RangeDate',
        colProps: { span: 8 },
        componentProps: {
            style: { width: '100%' }
        }
    },
    {
        label: '绑定状态',
        field: 'status',
        component: 'ApiSelect',
        componentProps: {
            placeholder: '请选择绑定状态',
            api: enterpriseEntMangerApplyEnumList,
            labelField: 'dictText',
            valueField: 'dictValue',
            // resultField: 'entStatus'
        },
    },
];



/**
 * 查看企业绑定 表格列
 */
export const previewModalColumns: BasicColumn[] = [
    {
        title: '企业服务管家',
        dataIndex: 'realname',
    },
    {
        title: '级别',
        dataIndex: 'gradeText',
    },
    {
        title: '绑定时间',
        dataIndex: 'bindTime',
        format: (date: string): string => {
            return dayjs(date).format('YYYY年MM月DD日')
        }
    }
];

/**
 * 企业绑定 表格列
 */
export const modalColumns: BasicColumn[] = [
    {
        title: '企业服务管家',
        dataIndex: 'realname',
    },
    {
        title: '级别',
        dataIndex: 'gradeText',
    },
    {
        title: '创建时间',
        dataIndex: 'startDate',
    }
];


export const modalSearchFormSchema: FormSchema[] = [
    {
        label: '',
        field: 'realname',
        component: 'Input',
        componentProps: {
            placeholder: '请输入企业服务管家名称',
        }
    },
];
