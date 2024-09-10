<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="修改密码" @ok="handleSubmit" width="600px">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, unref, defineExpose } from 'vue';
  import { rules } from '/@/utils/helper/validator';
  import { defHttp } from '/@/utils/http/axios';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import encryptor from '/@/utils/common/encryptor';
  // 声明Emits
  const emit = defineEmits(['register']);
  const $message = useMessage();
  const formRef = ref();
  const username = ref('');
  //表单配置
  const [registerForm, { resetFields, validate, clearValidate }] = useForm({
    schemas: [
      {
        label: '旧密码',
        field: 'oldpassword',
        component: 'InputPassword',
        required: true,
      },
      {
        label: '新密码',
        field: 'password',
        component: 'StrengthMeter',
        componentProps: {
          placeholder: '请输入新密码',
        },
        rules: [
          {
            required: true,
            validator: (rule, value) => {
              return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>])(?!.*\s).{8,}$/.test(value)
                ? Promise.resolve()
                : Promise.reject('请输入8位以上密码,且含有大小写字母、数字、及特殊字符');
            },
          },
        ],
      },
      {
        label: '确认新密码',
        field: 'confirmpassword',
        component: 'InputPassword',
        dynamicRules: ({ values }) => rules.confirmPassword(values, true),
      },
    ],
    showActionButtonGroup: false,
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner();

  //表单提交事件
  async function handleSubmit() {
    try {
      const values = await validate();
      values.oldpassword = encryptor.encrypt(values.oldpassword);
      values.password = encryptor.encrypt(values.password);
      values.confirmpassword = encryptor.encrypt(values.confirmpassword);
      setModalProps({ confirmLoading: true });
      //提交表单
      let params = Object.assign({ username: unref(username) }, values);
      defHttp.put({ url: '/sys/user/updatePassword', params }, { isTransformResponse: false }).then((res) => {
        if (res.success) {
          $message.createMessage.success(res.message);
          //关闭弹窗
          closeModal();
        } else {
          $message.createMessage.warning(res.message);
        }
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  async function show(name) {
    if (!name) {
      $message.createMessage.warning('当前系统无登录用户!');
      return;
    } else {
      username.value = name;
      await setModalProps({ visible: true });
      await resetFields();
      await clearValidate();
    }
  }

  defineExpose({
    show,
  });
</script>
