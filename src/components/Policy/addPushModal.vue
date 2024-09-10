<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :width="700" :minHeight="300" :useWrapper="false" :canFullscreen="false" :title="title" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #pushEntIds>
        <a-form-item label="选择企业" name="pushEntIds" :rules="{validator: validateEnt}">
          <a-select
            showSearch
            mode="multiple"
            :disabled="disabled"
            v-model:value="entIds"
            placeholder="请选择企业"
            :options="entList"
            :fieldNames="{label: 'entName', value: 'id', options: entList}"
            :filterOption="false"
            @search="searchEntList"
            @change="changeEnt"
          >
          </a-select>
        </a-form-item>
      </template>
      <template #entYear="{model, field}">
        <a-select 
          class="entYear-select"
          :options="entYearRuleList"
          :fieldNames="{label: 'dictName', value: 'dictCode', options: entYearRuleList}"
        >
        </a-select>
        <a-input class="entYear-input" suffix="年" v-model="model[field]" />
      </template>
      <template #more>
        <a-popover v-model:visible="moreVisible" trigger="click">
          <template #title>
          </template>
          <template #content>
            <a-checkbox-group class="more-list" :options="moreList">
            </a-checkbox-group>
          </template>
          <a class="more" >更多推送设置</a>
        </a-popover>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, onBeforeMount } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { choosePolicyList, getPushRuleType, getPushRuleWay, addPush, editPush, queryEntList, getPushView, getManyDictItems, getEntRegisterTime } from '/@/api/policy/policy'
  import { FormSchema } from '/@/components/Table';
  import { debounce } from 'lodash-es';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const entSshyList = ref([]) // 企业所属行业列表
  const entQylxList = ref([]) // 企业类型列表
  const entQygmList = ref([]) // 企业规模列表
  const entYearRuleList = ref([]) // 企业年份规则列表
  const moreVisible = ref(false)  // 更多规则显示
  const moreList = ref([
    {value: '企业人数', label: '企业人数'},
    {value: '营业收入', label: '营业收入'},
    {value: '科创情况', label: '科创情况'},
    {value: '荣誉资质', label: '荣誉资质'},
    {value: '机构设计', label: '机构设计'},
  ])
  // 
  const formSchema: FormSchema[] = [
    {
      label: '',
      field: 'pushId',
      component: 'Input',
      show: false,
    },
    {
      label: '',
      field: 'type',
      component: 'Input',
      show: false,
    },
    {
      label: '',
      field: 'pushState',
      component: 'Input',
      show: false,
    },
    {
      label: '精准推送编号',
      field: 'pushNumber',
      component: 'Input',
      componentProps: {
        disabled: true
      },
      ifShow: ({values}) => {
        return !!values.pushId
      },
    },
    {
      label: '政策名称',
      field: 'policyId',
      component: 'ApiSelect',
      componentProps: {
        api: choosePolicyList,
        labelField: 'policyTitle',
        valueField: 'policyId', 
        showSearch: true,
        filterOption: (inputValue, option) => {
          return option.label.indexOf(inputValue) > -1
        }
      },
      dynamicDisabled: ({values}) => {
        return !!values.pushId
      },
      dynamicRules: ({model, schema}) => {
        return [{ required: true, message: '请选择政策名称' }];
      },
      // rules: [
      //   {
      //     required: true,
      //     message: '请选择政策名称',
      //   },
      // ],
    },
    {
      label: '推送名称',
      field: 'pushName',
      component: 'Input',
      defaultValue: '新的推送',
      rules: [
        {
          validator: (rule, value, callback) => {
            if (!value) {
              callback('请输入推送名称')
            } else {
              callback()
            }
          }
        }
      ],
    },
    {
      label: '推送说明',
      field: 'pushContent',
      component: 'InputTextArea',
      rules: [
        {
          validator: (rule, value, callback) => {
            if (!value) {
              callback('请输入推送说明')
            } else {
              callback()
            }
          }
        }
      ],
    },
    {
      label: '推送企业规则设置',
      field: 'pushRule',
      component: 'ApiSelect',
      componentProps: {
        api: getPushRuleType,
        labelField: 'dictName',
        valueField: 'dictCode',
      },
      defaultValue: '0',
      rules: [
        {
          required: true,
          message: '请选择推送企业规则',
        },
      ]
    },
    {
      label: '是否持续推送',
      field: 'pushSustain',
      component: 'ApiSelect',
      componentProps: {
        api: getPushRuleWay,
        labelField: 'dictName',
        valueField: 'dictCode',
      },
      ifShow: ({values}) => {
        return values.pushRule === '0'
      },
      defaultValue: '0',
      rules: [
        {
          required: true,
          message: '请选择是否持续推送',
        },
      ]
    },
    {
      label: '选择企业',
      field: 'pushEntIds',
      component: 'ApiSelect',
      componentProps: {
        api: queryEntList,
        showSearch: true,
        labelField: 'entName',
        valueField: 'id',
        mode: 'multiple',
        filterOption: (inputValue, option) => {
          return option.label.indexOf(inputValue) > -1
        }
      },
      dynamicRules: ({model, schema}) => {
        return [{ required: true, message: '请选择企业' }];
      },
      ifShow: ({ values }) => {
        return values.pushRule === '1'
      },
    },
    {
      label: '企业所属行业',
      field: 'entSshy',
      component: 'Select',
      componentProps: {
        options: entSshyList,
      },
      ifShow: ({values}) => {
        return values.pushRule === '2' && !values.pushId
      },
    },
    {
      label: '企业规模',
      field: 'entQygm',
      component: 'Select',
      componentProps: {
        options: entQygmList,
      },
      ifShow: ({values}) => {
        return values.pushRule === '2' && !values.pushId
      },
    },
    {
      label: '企业类型',
      field: 'entQylx',
      component: 'Select',
      componentProps: {
        options: entQylxList,
      },
      ifShow: ({values}) => {
        return values.pushRule === '2' && !values.pushId
      },
    },
    {
      label: '企业注册年份',
      field: 'entYear',
      component: 'Input',
      slot: 'entYear',
      ifShow: ({values}) => {
        return values.pushRule === '2' && !values.pushId
      },
    },
    {
      label: '更多规则设置',
      field: 'more',
      component: 'Input',
      colSlot: 'more',
      ifShow: ({values}) => {
        return values.pushRule === '2' && !values.pushId
      },
    },
    {
      label: '确认结果',
      field: 'node',
      component: 'Input',
      ifShow: ({values}) => {
        return values.type === 'show' && values.pushState >= 2
      },
    },
    {
      label: '确认时间',
      field: 'nodeTime',
      component: 'Input',
      ifShow: ({values}) => {
        return values.type === 'show' && values.pushState >= 2
      },
    },
    {
      label: '驳回原因',
      field: 'auditOpinion',
      component: 'Input',
      ifShow: ({values}) => {
        return values.type === 'show' && values.pushState == 3
      },
    },
  ] 
  const entList = ref([]);
  const entIds = ref();
  const title = ref('新增精准推送')
  const disabled = ref(false)
  

  //表单配置
  const [registerForm, { resetFields, setFieldsValue, validate, setProps }] = useForm({
    schemas: formSchema,
    showActionButtonGroup: false,
    labelCol: {span: 6},
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    entIds.value = [];
    setModalProps({ confirmLoading: false });
    //查询获取表单数据
    if (data.pushId) {
      const res = await getPushView({ pushId: data.pushId });
      console.log('res', res)
      data.node = res.auditRecordVo?.node
      data.auditOpinion = res.auditRecordVo?.auditOpinion
      data.nodeTime = res.auditRecordVo?.nodeTime
      data = res ? {...data,...res} : data;
      entIds.value = data?.entInfoVOList?.map(item => item.id)
      title.value = '精准推送详情'
    } else {
      title.value = '新增精准推送'
    }
    if (data.type == 'show') {
      setProps({disabled: true })
      setModalProps({ showOkBtn: false })
      disabled.value = true
    } else {
      setProps({disabled: false})
      setModalProps({ showOkBtn: true });
      disabled.value = false
    }
    //表单赋值
    await setFieldsValue({ ...data });
  });

  /**
   * 企业列表
   */
  async function getEntList() {
    let res = await getManyDictItems({dictCodeList: 'ent_info_qylx,ent_info_qygm,ent_info_sshy'})
    console.log('res', res)
    entSshyList.value = res.ent_info_sshy
    entQygmList.value = res.ent_info_qygm
    entQylxList.value = res.ent_info_qylx
  }

  /**
   * 企业搜索接口添加防抖
   */
  const searchEntList = debounce( async (value) =>{
      let res = await queryEntList({entName: value})
      entList.value = res
  }, 300)

  /**
   * 更改企业
   * @param value 
   */
  async function changeEnt(value) {
    // console.log('value', value)
    // console.log('更改了变化', entIds.value)
    // await setFieldsValue({pushEntIds: value})
  }

  /**
   * 校验选择企业
   */
  function validateEnt( rule, value, callback) {
    // console.log('出发了校验1111', entIds.value)
    // console.log(!entIds.value || entIds.value?.length == 0)
    if (!entIds.value || entIds.value?.length == 0) {
      callback('请选择企业')
    } else {
      callback()
    }
  }

  //表单提交事件
  async function handleSubmit() {
    try {
      const values = await validate();
      console.log('values', values)
      if (values.pushRule == 1) {
        values.pushEntIds = entIds?.value?.join(',')
      }
      setModalProps({ confirmLoading: true });
      //提交表单
      // await saveOrUpdateAgent(values);
      if (values.pushId) {
        await editPush(values)
      } else {
        await addPush(values)
        // values.auditIds = values.auditId
        // await batchAuditPolicy(values)
      }
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }


  onBeforeMount(async () => {
    entList.value= await queryEntList()
    entYearRuleList.value = await getEntRegisterTime()
    getEntList()
  })
</script>

<style lang="less" scoped>
.entYear-select {
  width: 100px;
  margin-right: 10px;
}
.entYear-input {
  width: 200px;
}
.more {
  float: right;
}
.more-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>