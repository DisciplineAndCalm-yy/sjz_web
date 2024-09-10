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
import { queryTemplateChooseList} from '/@/api/indicatorManagement/index'


export const columns: BasicColumn[] = [
  {
    title: '指标体系名称',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '一级指标个数',
    dataIndex: 'oneIndicatorNum',
    width: 120,
  },
  {
    title: '二级指标个数',
    width: 150,
    dataIndex: 'secondIndicatorNum',
  },
  {
    title: '三级指标个数',
    width: 150,
    dataIndex: 'thirdIndicatorNum',
  },
  {
    title: '创建部门',
    width: 150,
    dataIndex: 'createDepart',
  },
  {
    title: '更新日期',
    width: 150,
    dataIndex: 'updateDate',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: '指标体系名称',
    componentProps: {
      placeholder: '请输入',
    },
  },
  // {
  //   field: 'updateDate',
  //   component: 'RangePicker',
  //   label: '更新日期',
  //   componentProps: {
  //     valueType: 'Date',
  //     // placeholder: ['开始时间', '结束时间'],
  //   },
  // },
  {
    label: '更新日期',
    field: 'updateDate',
    component: 'RangePicker',
    componentProps: {
      valueType: 'Date',
    }
  },
]