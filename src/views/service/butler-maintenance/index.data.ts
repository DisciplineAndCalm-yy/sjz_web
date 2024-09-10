/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-17 17:30:14
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-11 10:21:49
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/butler-maintenance/index.data.ts
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { enterpriseEntMangerEnumList } from '../butler-binding/index.api'
import { render } from '/@/utils/common/renderUtils';
import { Rule } from 'ant-design-vue/lib/form';

export const columns: BasicColumn[] = [
    {
        title: '用户账号',
        dataIndex: 'username',
        width: 120,
    },
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
        title: '级别',
        dataIndex: 'gradeText',
        width: 120,
    },
    {
        title: '性别',
        dataIndex: 'sex',
        width: 120,
        customRender: ({ text }) => {
            return render.renderDict(text, 'sex');
        },
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

export const getModalFormSchema = (ifShow): FormSchema[] => {
    return [
        {
            field: 'username',
            component: 'Input',
            label: '用户账户',
            slot: 'username',
            defaultValue: '',
        },
        {
            field: 'realname',
            component: 'Input',
            label: '企业服务管家姓名',
            slot: 'realname',
            defaultValue: '',
        },
        {
            label: '企业服务管家级别',
            field: 'gradeText',
            component: 'Input',
            slot: 'gradeText',
            ifShow: ifShow(true)
        },
        {
            label: '企业服务管家级别',
            field: 'grade',
            component: 'ApiSelect',
            required: true,
            componentProps: {
                placeholder: '请选择管家级别',
                api: enterpriseEntMangerEnumList,
                labelField: 'dictText',
                valueField: 'dictValue',
                // resultField: 'mangerGrade'
            },
            ifShow: ifShow(false)
        },

        {
            label: '企业管家服务时长',
            field: 'Date',
            component: 'RangePicker',
            required: true,
            defaultValue: [],
            componentProps: {
                style: { width: '100%' },
                format: 'YYYY-MM-DD',
            },
            rules: [
                { validator: async(_rule: Rule, value: string) => {
                    if (value && value[0] && value[1]) {
                        return Promise.resolve();
                    } else{
                        return Promise.reject('请选择企业管家服务时长')
                    }

                }, required: true, trigger: 'change' }
            ],
        },
    ]
}






