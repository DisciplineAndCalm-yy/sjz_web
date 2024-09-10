<template>
    <BasicModal @register="register" v-bind="$attrs" title="指标" @ok="handleSubmit" width="60%">
        <BasicForm @register="registerForm" />
    </BasicModal>
</template>
<script lang="ts" setup>
import { ref, unref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
import { useMessage } from '/@/hooks/web/useMessage';
import { indicatorAdd, indicatorEdit } from '/@/api/indicatorManagement/index'
// import { UploadTypeEnum } from '/@/components/Form/src/jeecg/components/JUpload';
const isUpdate = ref(true);

// 声明message
const { createMessage } = useMessage();

// 声明emit
const emit = defineEmits(['success'])

// 声明colums
const schemas: FormSchema[] = [
    {
        field: 'templateId',
        component: 'Input',
        label: '指标体系templateId',
        show: false,
        componentProps: {
        },
    },
    {
        field: 'parentId',
        component: 'Input',
        label: '父级id',
        show: false,
        componentProps: {
        },
    },
    {
        field: 'id',
        component: 'Input',
        label: '指标id',
        show: false,
        componentProps: {
        },
    },
    {
        field: 'indicatorType',
        component: 'Input',
        label: '指标级别',
        show: false,
        componentProps: {
        },
    },
    {
        field: 'indicatorName',
        component: 'Input',
        label: '一级指标名称',
        rules: [{ min: 1, max: 50, message: '长度为1-50字', trigger: 'blur' }],
        required: true,
        componentProps: {
            placeholder: "请输入",
        },
        // ifShow: ({ values }) => {
        //     return values.parentId == undefined
        // },
        ifShow: ({ values }) => {
            if (values.id == undefined) {
                return values.parentId == undefined
            }else{
                return values.indicatorType == "1"
            }
        },
    },
    {
        field: 'indicatorName',
        component: 'Input',
        label: '二级指标名称',
        rules: [{ min: 1, max: 50, message: '长度为1-50字', trigger: 'blur' }],
        required: true,
        componentProps: {
            placeholder: "请输入",
        },
        ifShow: ({ values }) => {
            if (values.id == undefined) {
                return values.indicatorType == "1" 
            }else{
                return values.indicatorType == "2"
            }
        },
    },
    {
        field: 'indicatorName',
        component: 'Input',
        label: '三级指标名称',
        rules: [{ min: 1, max: 50, message: '长度为1-50字', trigger: 'blur' }],
        required: true,
        componentProps: {
            placeholder: "请输入",
        },
        ifShow: ({ values }) => {
            return values.id == undefined?  values.indicatorType == "2" : values.indicatorType == "3"
        },
    },
    // {
    //     field: 'indicatorName',
    //     component: 'Input',
    //     label: isSecond.value == false ? '二级指标名称' : '一级指标名称',
    //     required: true,
    //     componentProps: {
    //         placeholder: "请输入",
    //     }
    // },
    {
        field: 'description',
        component: 'InputTextArea',
        label: '指标说明',
        rules: [{ min: 1, max: 3000, message: '长度为1-300字', trigger: 'blur' }],
        // required: true,
        componentProps: {
            placeholder: "请输入",
        }
    }
]

// 表单声明、配置
const [registerForm, { setProps, setFieldsValue, resetFields, validate }] = useForm({
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
const [register, { openModal, closeModal, setModalProps }] = useModalInner(async (data) => {
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
            ...data.indicatorObj
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

        const fn = values.id ? indicatorEdit : indicatorAdd
        //提交表单
        await fn(values)

        // emit('setMsg', {name: values.name, description: values.description})
        //关闭弹窗
        closeModal();
        //刷新列表
        emit('success');
    } finally {
        setModalProps({ confirmLoading: false });
    }
}

</script>