<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-06-06 18:28:50
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-07-04 10:36:14
 * @FilePath: \yst-city-qixian-PolicyRecommendationSystem-web\src\views\publishAudit\push\auditDetailModal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :width="600" :useWrapper="false" :canFullscreen="false" title="详情" :showOkBtn="false">
    <BasicForm @register="registerForm">
      <template #auditRecordList="{model, field}">
        <Timeline>
          <TimelineItem v-for="item in model[field]">
            <p>{{ item.node }}</p>
            <p>{{ item.nodeTime }}</p>
            <p>{{ item.auditOpinion }}</p>
          </TimelineItem>
        </Timeline>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { pushAuditTransferDetail, policyAuditTransferDetail } from '/@/api/policy/policy'
  import { FormSchema } from '/@/components/Table';
  import { Timeline, TimelineItem } from 'ant-design-vue';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  // 
  const formSchema: FormSchema[] = [
    {
      label: '',
      field: 'auditId',
      component: 'Input',
      show: false,
    },
    {
      label: '',
      field: 'transferStatus',
      component: 'Input',
      show: false,
    },
    {
      label: '转派状态',
      field: 'transferStatusName',
      component: 'Input',
    },
    {
      label: '转派部门',
      field: 'transferOrgCodeName',
      component: 'Input',
      ifShow: ({values}) => {
        return values.transferStatus == '1'
      }
    },
    {
      label: '确认状态',
      field: 'auditStatusName',
      component: 'Input',
    },
    {
      label: '时间轴',
      field: 'auditRecordList',
      slot: 'auditRecordList',
      component: 'Input',
    }
  ] 
  //表单配置
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    schemas: formSchema,
    showActionButtonGroup: false,
    disabled: true,
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false });
    let res = {}
    //查询获取表单数据
    if (data.type == 1) {
      // 政策
      res = await policyAuditTransferDetail({ auditId: data.auditId });
    } else if (data.type == 2) {
      //精准推送
      res = await pushAuditTransferDetail({ auditId: data.auditId });
    }
    data = res ? {...data,...res} : data;
    console.log('data', data)
    //表单赋值
    await setFieldsValue({ ...data });
  });
</script>
