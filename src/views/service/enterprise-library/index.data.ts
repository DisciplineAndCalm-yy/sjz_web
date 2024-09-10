import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

const statusOptions = [
    {
        label: '未激活',
        value: 1,
        key: 1,
    },
    {
        label: '已激活',
        value: 2,
        key: 2,
    },
]
export const columns: BasicColumn[] = [
    {
        title: '统一社会信用代码',
        dataIndex: 'creditCode',
        width: 200,
    },
    {
        title: '企业名称',
        dataIndex: 'entName',
        width: 120,
    },
    {
        title: '企业规模',
        dataIndex: 'entScale',
        width: 120,
    },
    {
        title: '企业类型',
        dataIndex: 'entType',
        width: 120,
    },
    {
        title: '所属行业',
        dataIndex: 'trade',
        width: 120,
    },
    // {
    //     title: '注册资本(万元)',
    //     dataIndex: 'regCapital',
    //     width: 120,
    // },
    // {
    //     title: '法人姓名',
    //     dataIndex: 'legalName',
    //     width: 120,
    // },
    {
        title: '注册时间',
        dataIndex: 'estDate',
        width: 120,
    },
    {
        title: '企业激活状态',
        dataIndex: 'status',
        // format(text, record, index) {
        //     const current = statusOptions.find((v: any) => v.value == text)
        //     return current?.label || text
        // },
        width: 120,
    },
    {
        title: '使用人数',
        dataIndex: 'useNum',
        width: 120,
    },
    {
        title: '入库时间',
        dataIndex: 'createTime',
        width: 180,
    },
];
export const searchFormSchema: FormSchema[] = [
    {
        label: '统一社会信用代码',
        field: 'creditCode',
        component: 'Input',
        colProps: { span: 8 },
    },
    {
        label: '企业名称',
        field: 'entName',
        component: 'Input',
        colProps: { span: 8 },
    },
    {
        label: '企业类型',
        field: 'entType',
        component: 'JDictSelectTag',
        componentProps: {
            showChooseOption: false,
            dictCode: 'ent_info_qylx',
            placeholder: '请选择企业类型',
        },
        colProps: { span: 8 },
    },
    {
        label: '所属行业',
        field: 'trade',
        component: 'JDictSelectTag',
        componentProps: {
            showSearch: true,
            showChooseOption: false,
            dictCode: 'ent_info_sshy',
            placeholder: '请输入所属行业',
        },
        colProps: { span: 8 },
    },
    {
        label: '入库时间',
        field: 'toDate',
        component: 'RangeDate',
        colProps: { span: 8 },
        componentProps: {
            style: { width: '100%' }
        }
    },
    {
        label: '企业激活状态',
        field: 'status',
        component: 'Select',
        componentProps: {
            placeholder: '请选择企业激活状态',
            options: statusOptions,
        },
        colProps: { span: 8 },
    },
];


/**
 * 页面类型
 * create | edit | details
 */
export enum TypeEnum {
    create = 'create',
    edit = 'edit',
    details = 'details'
}

/**
 * 企业经营信息 数据定义
 */
export type BusinessData = {
    datas: {
        id?: string,
        year: string | number,
        key: string,
        data: any
    }[]
}

/**
 * 机构设置 表单类型
 */
export enum InstitutionType {
    /**
     * 科技企业孵化器
     */
    couveuse = 'a',
    /**
     * 众创空间
     */
    space = 'b',
    /**
     * 公共服务平台
     */
    public = 'c',
    /**
     * 创新创业示范平台
     */
    innovate = 'f'
}

/**
 * 科创情况 校验合计字段
 */
export const KnowledgeSummationFileds = [
    'propertyFirstNum',
    'propertySecondNum',
    'patentNum',
    'softwareNum',
    'trademarkNum',
    'pctNum'
]

/**
 * 企业人事信息 校验合计字段
 */
export const PersonnelSummationFileds = [
    'associateNum',
    'bachelorNum',
    'masterNum',
    'doctorNum',
    // 'higherNum',
    // 'secondaryNum',
    // 'scientificNum',
    // 'developNum',
]

