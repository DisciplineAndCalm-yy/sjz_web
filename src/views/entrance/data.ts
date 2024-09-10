import businessScreenIcon from '/@/assets/images/entrance/business_screen_icon.png';
import simulationEvalutionIcon from '/@/assets/images/entrance/simulation_evaluation_icon.png';
import workSupervisionIcon from '/@/assets/images/entrance/work_supervision_icon.png';
import senselessDetectionIcon from '/@/assets/images/entrance/senseless_detection_icon.png';
import businessThinkTankIcon from '/@/assets/images/entrance/business_think_tank_icon.png';
import corporateDemandsIcon from '/@/assets/images/entrance/corporate_demands_icon.png';

export const menuIconInsinuate = {
  // 指标管理
  'knowledge/': {
    icon: businessThinkTankIcon,
    desc: '营商智库',
  },
  // 智能报告
  enterpriseAppeal: {
    icon: corporateDemandsIcon,
    desc: '企业诉求',
  },
  supervise: {
    icon: workSupervisionIcon,
    desc: '工作督办',
  },
  senselessDetection: {
    icon: senselessDetectionIcon,
    desc: '无感监测',
  },
  businessScreen: {
    icon: businessScreenIcon,
    desc: '营商大屏',
  },
  simulationEvaluation: {
    icon: simulationEvalutionIcon,
    desc: '模拟评价',
  },
};

export interface EntranceItem {
  title: string;
  path: string;
  icon: any;
  mask: any;
  desc: string;
}

export interface NoticeInfo {
  cmd: string;
  msgId: string;
  msgTxt: string;
  type: string;
  userId: string;
}
