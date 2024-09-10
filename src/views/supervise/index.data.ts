import { FormSchema } from '/@/components/Table';
import { getSupStatus } from '/@/api/supervise/index'

// 公共查询条件
export const publicSearchFormSchema: FormSchema[] = [
  {
    label: '状态',
    field: 'supStatus',
    component: 'ApiSelect',
    componentProps: {
      api: getSupStatus,
      numberToString: true,
      labelField: 'dictName',
      valueField: 'dictCode',
      // allowClear: false,
    },
  },
  {
    label: '完成时限',
    field: 'requireTime',
    component: 'RangePicker',
    componentProps: {
      valueType: 'Date',
    }
  },
  {
    label: '发布日期',
    field: 'createTime',
    component: 'RangePicker',
    componentProps: {
      valueType: 'Date',
    }
  }
];

// 重点任务查询条件
export const taskSearchFormSchema: FormSchema[] = [
  {
    field: 'keyTask',
    component: 'Input',
    label: '重点任务',
    componentProps: {
      placeholder: '请输入',
    },
  }
];

/**
 * 获取最终查询条件
 * @param name {String} 模板名称
 * @param type {String} 类型：search/list
*/
export const getColumns = (name, type) => {
  console.log('name', name)
  const additionalKeys = ['当前进展情况','是否超期', '状态', '发布部门','发布日期']
  switch (name) {
    case '重点任务':
      return type == 'search'? [...taskSearchFormSchema, ...publicSearchFormSchema] : additionalKeys
      break;

    case '创新示范':
      return type == 'search'? [...taskSearchFormSchema, ...publicSearchFormSchema] : additionalKeys
      break;

    case '创新试点改革举措':
      return type == 'search'? [...taskSearchFormSchema, ...publicSearchFormSchema] : additionalKeys
      break;

    default:
      return type == 'search'? [...publicSearchFormSchema] : additionalKeys
      break;
  }
}


