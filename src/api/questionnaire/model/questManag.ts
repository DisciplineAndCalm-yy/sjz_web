// 问卷管理调查表列表数据
export interface InvestigationList {
  name: string; //问卷名称
  state: string; //问卷状态
  pageNo: number; //当前第几页
  pageSize: number; //每页几条数据
}

// 问卷管理新增调查表列表数据提交
export interface AddQuestionListData {
  name: string; //问卷名称
  //问题数据
  questions: [
    {
      // 选项数据
      choices: [
        {
          code: string; //选项字母
          content: string; //选项内容
          needExtension: boolean; //是否是其他说明
          seriesNumber: number; //选项序号
        }
      ];
      containsOther: boolean; //是否存在其他说明
      seriesNumber: number; //问题序号
      topic: string; //题目
      type: string; //问题类型
    }
  ];
  type: string; //问卷类型
}
// 问卷管理调查表列表数据
export interface PreviewList {
  id: string; //问卷id
}
// 问卷管理发布问卷
export interface ReleasePublishData {
  id: string; //问卷id
  type: string; // 发布方式
}
// 问卷管理编辑调查表列表数据提交
export interface EditQuestionListData {
  id: string; //id
  questionnaire: {
    name: string; //问卷名称
    //问题数据
    questions: [
      {
        // 选项数据
        choices: [
          {
            code: string; //选项字母
            content: string; //选项内容
            needExtension: boolean; //是否是其他说明
            seriesNumber: number; //选项序号
          }
        ];
        containsOther: boolean; //是否存在其他说明
        seriesNumber: number; //问题序号
        topic: string; //题目
        type: string; //问题类型
      }
    ];
    type: string; //问卷类型
  };
}
// 删除问卷
export interface DeteleListData {
  id: string; //问卷id
}
// 结束问卷管理发布问卷
export interface EndTerminateData {
  id: string; //问卷id
  type: string; // 结束方式
}
//
export interface RespondentListData {
  questionnaireId: string; //问卷id
  beginDate: string; //	开始时间
  endDate: string; //	结束时间
  pageNo: number; //当前第几页
  pageSize: number; //每页几条数据
}
// 问卷管理发布问卷
export interface SeeLisTData {
  id: string; //id
}
