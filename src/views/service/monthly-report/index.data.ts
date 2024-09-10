/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-19 10:56:14
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-05-15 10:41:38
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/monthly-report/index.data.ts
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
    {
        title: '月度',
        dataIndex: 'dataMonth',
        
    },
    {
        title: '企业管家名称',
        dataIndex: 'realName',
        
    },
    {
        title: '手机号',
        dataIndex: 'phone',
        
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
        
    },
    {
        title: '诉求类服务次数',
        dataIndex: 'appealNum',
        
    },
    {
        title: '日常走访服务次数',
        dataIndex: 'recordNum',
        
    },
];



export const searchFormSchema: FormSchema[] = [
    // {
    //     label: '企业名称',
    //     field: 'entName',
    //     component: 'Input',
    // },
    {
        label: '企业管家',
        field: 'realName',
        component: 'Input',
    },
    {
        label: '年度',
        field: 'year',
        component: 'DatePicker',
        required: true,
        defaultValue: new Date(),
        componentProps: {
            placeholder: '请选择年度',
            picker: 'year',
            style: {
                width: '100%'
            },
            valueFormat: 'YYYY'
        },
        colProps: { span: 8 },
    },
    // {
    //     label: '上传时间',
    //     field: 'Date',
    //     component: 'RangeDate',
    //     colProps: { span: 8 },
    //     componentProps: {
    //         style: { width: '100%' }
    //     }
    // },

];
