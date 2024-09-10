import { MethodModel } from '@coderlt/form-designer';
import { getAdLevelApi } from '/@/api/demo/thinkTank';
import {
  getDeadlineType,
  getEmergency,
  getIndicator,
  getSupNoticeDaysType,
  getSupNoticeWeekType,
  getResponsibleOrg,
} from '/@/api/taskTemplateConfig';
import { DeadlineTypeEnum } from './component';

export const superviseMethodsConfig: MethodModel[] = [
  {
    methodName: 'getSuperviseExpandField',
    async method() {
      console.log('测试动态数据扩展方法');
      const res = await getAdLevelApi();
      return res.map((i) => ({ label: i.title, value: i.value }));
    },
    describe: '这是一个测试函数描述',
  },
  {
    methodName: 'getDeadlineType',
    async method() {
      const res = await getDeadlineType();
      return res.map((i) => ({ label: i.dictName, value: i.dictCode }));
    },
    describe: '完成时限字典',
  },
  {
    methodName: 'getEmergency',
    async method() {
      const res = await getEmergency();
      return res.map((i) => ({ label: i.dictName, value: i.dictCode }));
    },
    describe: '紧急程度字典',
  },
  {
    methodName: 'getIndicator',
    async method() {
      const res = await getIndicator();
      return res.map((i) => ({ label: i.dictName, value: i.dictCode }));
    },
    describe: '指标查询字典',
  },
  {
    methodName: 'getSupNotice',
    async method() {
      const dayRes = await getSupNoticeDaysType();
      const Weekres = await getSupNoticeWeekType();
      return {
        weekType: Weekres,
        daysType: dayRes,
      };
    },
    describe: '通知字典',
  },
  {
    methodName: 'getResponsibleOrg',
    async method() {
      const res = await getResponsibleOrg();
      return res.map((i) => ({ label: i.dictName, value: i.dictCode }));
    },
    describe: '责任单位',
  },
];

export const scriptCode = `const { defineExpose, find, getResponsibleOrg, getSuperviseExpandField, getDeadlineType, getEmergency, getIndicator, getSupNotice } = epic;
// 完成时限
async function getDeadlineTypeApi() {
  const data = await getDeadlineType()
  const deadlineTypeDetail = find('deadlineType')
  if (deadlineTypeDetail) {
    deadlineTypeDetail.setAttr('options', data)
  } else {
    console.error('未找到完成时限组件', 'deadlineType')
  }
}

// 紧急程度
async function getEmergencyApi() {
  const data = await getEmergency()
  const emergencyDetail = find('emergency')
  if (emergencyDetail) {
    emergencyDetail.setAttr('options', data)
  } else {
    console.error('未找到紧急程度组件', 'emergency')
  }
}

// 指标查询
async function getIndicatorApi() {
  const data = await getIndicator()
  const indicatorDetail = find('indicator')
  if (indicatorDetail) {
    indicatorDetail.setAttr('options', data)
  } else {
    console.error('未找到紧急程度组件', 'indicator')
  }
}

// 完成时限回调
function handleDeadlineTypeChange() {
  const deadlineTypeDetail = find('deadlineType')
  console.log('deadlineTypeDetail', deadlineTypeDetail)
  if (deadlineTypeDetail) {
    // 通知
    const detail = find('customNotice')
    if (detail) {
      detail.setAttr('completionDeadline', deadlineTypeDetail.getValue())
    } else {
      console.error('未找到完成通知组件', 'customNotice')
    }

    // 要求完成时间
    const requireTimeDetail = find('requireEndTime')
    console.log('requireTimeDetail', requireTimeDetail)
    if (requireTimeDetail) {
      requireTimeDetail.setAttr('hidden', deadlineTypeDetail.getValue() == ${DeadlineTypeEnum.SUSTAIN})
    }
  } else {
    console.error('未找到完成时间组件', 'deadlineType')
  }
}

// 设置通知数据
async function setNoticeData() {
  const data = await getSupNotice()
  const detail = find('customNotice')
  if (detail) {
    detail.setAttr('noticeTimeOptions', data.daysType.map(i => ({ label: i.dictName, value: i.dictCode })))
    detail.setAttr('noticeCycleOptions', data.weekType.map(i => ({ label: i.dictName, value: i.dictCode })))
  }
}

// 责任单位
async function getResponsibleOrgApi() {
  const data = await getResponsibleOrg()
  const detail = find('responsibleDepart')
  if (detail) {
    detail.setAttr('options', data)
  }
}

// 责任单位回调
function handResponsibleDepartChange() {
  const responsibleDepartDetail = find('responsibleDepart')
  console.log('responsibleDepartDetail', responsibleDepartDetail)
  if (!responsibleDepartDetail) {
    return console.warn('responsibleDepartDetail 责任单位 未找到')
  }

  const leadDepartDetail = find('leadDepart')
  console.log('leadDepartDetail', leadDepartDetail)
  if (!leadDepartDetail) {
    return console.warn('responsibleDepartDetail 牵头单位 未找到')
  }

  // 责任单位值
  const responsibleDepartVal = responsibleDepartDetail.getValue()
  const leadDepartOptions = leadDepartDetail.getAttr('options')
  if (leadDepartOptions && leadDepartOptions.length) {
    leadDepartDetail.setAttr('options', leadDepartOptions.map(i => ({
      ...i,
      disabled: responsibleDepartVal.includes(i.value)
    })))
  }
}

// 牵头单位
async function getLeadDepartApi() {
  const data = await getResponsibleOrg()
  const detail = find('leadDepart')
  if (detail) {
    detail.setAttr('options', data)
  }
}

// 牵头单位回调
function handLeleadDepartChange() {
  const leadDepartDetail = find('leadDepart')
  console.log('leadDepartDetail', leadDepartDetail)
  if (!leadDepartDetail) {
    return console.warn('responsibleDepartDetail 牵头单位 未找到')
  }

  const responsibleDepartDetail = find('responsibleDepart')
  if (!responsibleDepartDetail) {
    return console.warn('responsibleDepartDetail 责任单位 未找到')
  }

  // 牵头单位值
  const leadDepartVal = leadDepartDetail.getValue()
  const responsibleOptions = responsibleDepartDetail.getAttr('options')
  if (responsibleOptions && responsibleOptions.length) {
    responsibleDepartDetail.setAttr('options', responsibleOptions.map(i => ({
      ...i,
      disabled: leadDepartVal.includes(i.value)
    })))
  }
}

async function setCorrespondingIndicatorsData() {
  const data = await getSuperviseExpandField()
  const responsibleDepartDetail = find('responsibleDepart')
  if (responsibleDepartDetail) {
    find('responsibleDepart').setAttr('options', data)
  } else {
    console.error('未找责任单位组件', 'customNotice')
  }
}

// 通过defineExpose暴露的函数或者属性
defineExpose({
  getDeadlineTypeApi,
  getEmergencyApi,
  getIndicatorApi,
  getResponsibleOrgApi,
  getLeadDepartApi,
  handLeleadDepartChange,
  handResponsibleDepartChange,
 setCorrespondingIndicatorsData,
 handleDeadlineTypeChange,
 setNoticeData
})`;
