<template>
    <BasicModal @register="register" v-bind="$attrs" title="指标体系" @ok="handleSubmit" width="60%">
        <BasicForm @register="registerForm" />
    </BasicModal>
</template>
<script lang="ts" setup>
import { ref, unref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
import { useMessage } from '/@/hooks/web/useMessage';
import { indicatorTemplateAdd, indicatorTemplateEdit } from '/@/api/indicatorManagement/index'
// import { UploadTypeEnum } from '/@/components/Form/src/jeecg/components/JUpload';
const isUpdate = ref(true);

// 声明emit
const emit = defineEmits(['success', 'setMsg'])

// 声明colums
const schemas: FormSchema[] = [
    {
        field: 'id',
        component: 'Input',
        label: '',
        show: false,
        componentProps: {
        },
    },
    {
        field: 'name',
        component: 'Input',
        label: '指标体系名称',
        required: true,
        componentProps: {
            placeholder: "请输入",
        }
    },
    {
        field: 'description',
        component: 'InputTextArea',
        label: '描述信息',
        // required: true,
        componentProps: {
            placeholder: "请输入",
        }
    }
]

// 表单声明、配置
const [registerForm, {setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 120,
    schemas,
    // disabled: true,
    autoSetPlaceHolder: true,//自动设置表单内组件的 placeholder，自定义组件需自行实现
    rulesMessageJoinLabel: true,//如果表单项有校验，会自动生成校验信息，该参数控制是否将字段中文名字拼接到自动生成的信息后方
    actionColOptions: {
        span: 24,
    },
    // autoAdvancedLine: 1,
    showActionButtonGroup: false,
    showSubmitButton: true,
    fieldMapToTime: [//将表单内时间区域的值映射成 2 个字段
        ['time', ['startTime', 'endTime'], 'YYYY-MM-DD'],
    ]
})

// 弹窗声明
const [register, { closeModal, setModalProps }] = useModalInner(async (data) => {
    // 接收参数
    console.log('data', data)

    //重置表单
    await resetFields();
    //关闭loading
    setModalProps({ confirmLoading: false });

    // 赋值
    isUpdate.value = !!data?.isUpdate;

    // 判断是否更新？即-编辑回显 | unref() 如果参数是一个ref则返回它的value，否则返回参数本身
    if (unref(isUpdate)) {
        //表单赋值
        await setFieldsValue({
            ...data.indicatorTemplateObj
        });
    }

})

// 提交事件,用 @ok="handleSubmit",在modal上使用、触发
// const handleSubmit = async () => {
//     //确定按钮loading
//     setModalProps({ confirmLoading: true });

//     //正则校验
//     validate().then(res => {
//         // 请求
//         const a = saveOrUpdatePosition(res, isUpdate.value);
//         a.then(res => {
//             console.log('res', res)
//             //关闭弹窗
//             closeModal();
//             //刷新列表
//             emit('success');
//         }).catch(err => {
//             console.log('err', err)
//         })

//         // 关闭loading
//         setModalProps({ confirmLoading: false });
//     })
//     .catch(error => {// 校验不通过，关闭loading，提醒
//         console.log('error', error)
//         // createMessage.error('请检查')
//         setModalProps({ confirmLoading: false });
//     })
// }

//表单提交事件
const handleSubmit = async () => {
    try {
        const values = await validate();
        console.log('values', values)
        setModalProps({ confirmLoading: true });

        const fn = values.id? indicatorTemplateEdit : indicatorTemplateAdd
        //提交表单
        // await fn(values)
        const res = await fn(values)
        console.log('res', res)
        
        emit('setMsg', {name: values.name, description: values.description, id: res})
        //关闭弹窗
        closeModal();
        //刷新列表
        emit('success');
    } finally {
        setModalProps({ confirmLoading: false });
    }
}

</script>