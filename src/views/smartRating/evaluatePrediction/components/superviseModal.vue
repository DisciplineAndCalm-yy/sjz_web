<template>
    <BasicModal @register="register" v-bind="$attrs" title="一键督办" @ok="handleSubmit" @cancel="closeFn" width="90%"
        :maskClosable="false">
        <template #footer>
            <a-space>
                <a-button key="back" @click="closeFn">取消</a-button>
                <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit(0)">保存草稿</a-button>
                <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit(1)">一键督办</a-button>
            </a-space>
        </template>
        <a-button type="primary" preIcon="ant-design:plus-outlined" style="float: right;" @click="deal(0)">添加</a-button>
        <!-- formData: {{ formData }} -->
        <!-- selectedRowKeys: {{ selectedRowKeys }} -->
        <a-space v-if="formData.supDataList.length > 0" :size="size">
            <span>一级指标：{{ indicatorMsg.firstIndicatorName }}</span>
            <span>二级指标：{{ indicatorMsg.secondIndicatorName }}</span>
        </a-space>
        <!-- :row-selection="rowSelection" -->
        <a-table bordered :rowKey="record => record.id" :columns="columns" :data-source="formData.supDataList" :scroll="{ x: 1500, y: 400 }"
            :footer="null" :pagination="false">
            <template #headerCell="{ column }">
                <template v-if="column.dataIndex === 'title'">
                    <span>
                        <span class="redstar">*</span>
                        标题
                    </span>
                </template>
                <template v-if="column.dataIndex === 'mainContent'">
                    <span>
                        <span class="redstar">*</span>
                        主要内容
                    </span>
                </template>
                <template v-if="column.dataIndex === 'responsibleDepart'">
                    <span>
                        <span class="redstar">*</span>
                        责任单位
                    </span>
                </template>
                <template v-if="column.dataIndex === 'deadlineType'">
                    <span>
                        <span class="redstar">*</span>
                        完成时限
                    </span>
                </template>
            </template>
            <template #bodyCell="{ column, record, index }">
                <template v-if="column.dataIndex === 'title'">
                    <input type="text" v-model="record.formJsonObj.title" placeholder="请输入"
                        class="width-100-percent formPublic">
                        <!-- <textarea type="text" rows="4" v-model="record.formJsonObj.title" placeholder="请输入"
                        class="width-100-percent formPublic" /> -->
                </template>
                <template v-if="column.dataIndex === 'mainContent'">
                    <textarea type="text" rows="2" v-model="record.formJsonObj.mainContent" placeholder="请输入"
                        class="width-100-percent formPublic" />
                </template>
                <template v-if="column.dataIndex === 'responsibleDepart'">
                    <a-select v-model:value="record.formJsonObj.responsibleDepart" class="width-100-percent" allowClear
                        show-search optionFilterProp="label" :filter-option="filterOption" placeholder="请选择">
                        <a-select-option :value="item.dictCode" v-for="item in orgs" :key="item.dictCode"
                            :label="item.dictName">{{ item.dictName
                            }}</a-select-option>
                    </a-select>
                </template>
                <template v-if="column.dataIndex === 'deadlineType'">
                    <a-select v-model:value="record.formJsonObj.deadlineType" class="width-100-percent" allowClear
                        placeholder="请选择" @change="deadlineTypeHandleChange(record.formJsonObj.deadlineType, index)">
                        <a-select-option :value="item.dictCode" v-for="item in types">{{ item.dictName
                            }}</a-select-option>
                    </a-select>
                </template>
                <template v-if="column.dataIndex === 'requireEndTime'">
                    <!-- <input :disabled="record.formJsonObj.deadlineType == 0" type="text" v-model="record.formJsonObj.requireEndTime" placeholder="请输入"
                        class="width-100-percent formPublic"> -->
                    <a-date-picker v-model:value="record.formJsonObj.requireEndTime" format="YYYY-MM-DD"
                        valueFormat="YYYY-MM-DD" :disabled="record.formJsonObj.deadlineType == 0"
                        class="width-100-percent formPublic" />
                </template>
                <template v-if="column.dataIndex === 'attachments'">
                    <div>
                        <JUpload ref="uploadRef" :value="record.formJsonObj.attachments"
                            @change="changeValue($event, index)" />
                        <!-- <ul>
                            <li><span>aaa.png</span> <span>x</span></li>
                        </ul> -->
                    </div>
                </template>
                <template v-if="column.dataIndex === 'action'">
                    <span>
                        <a @click="deal(1, record)">删除</a>
                    </span>
                </template>
            </template>
            <!--操作栏-->

        </a-table>
    </BasicModal>
</template>
<script lang="ts" setup>
import { reactive, ref, unref, watch } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { getResponsibleOrg, getDeadlineType } from '/@/api/taskTemplateConfig'
import { batchSupSend, batchSupSave, getSupid } from '/@/api/smartRating'
import JUpload from '/@/components/Form/src/jeecg/components/JUpload/JUpload.vue';
const loading = ref<boolean>(false);
const size = ref(50)
//过滤规则
const filterOption = (input: string, option: any) => {
    return option.label.indexOf(input) >= 0;
};

// 单条数据样例
let exampleObj = {
    "formJsonObj": {
        "customNotice": {
            "switchFlag": "1",
            "daysType": "1",
            "daysNum": 3,
            "weekType": "1",
            "weekTime": "00:00:00"
        },
        "attachments": "",
        "fileValue": [],
        "title": "",
        "mainContent": "",
        "firstIndicatorName": "",
        "secondIndicatorName": "",
        "deadlineType": undefined,
        "requireEndTime": "",
        "responsibleDepart": undefined
    },
    "supId": ""
}

const formData = reactive({
    "supDataList": [],
    "templateId": ""
})

const indicatorMsg = reactive({
    firstIndicatorName: "",
    secondIndicatorName: ""
})
// 弹窗声明
const [register, { openModal, closeModal, setModalProps }] = useModalInner(async (data) => {
    // 接收参数
    console.log('data', data)
    exampleObj.formJsonObj.firstIndicatorName = data.indicatorMsg.level1IndName
    exampleObj.formJsonObj.secondIndicatorName = data.indicatorMsg.level2IndName
    // exampleObj.formJsonObj = 
    let supDataList = data.supDataList
    indicatorMsg.firstIndicatorName = data.indicatorMsg.level1IndName
    indicatorMsg.secondIndicatorName = data.indicatorMsg.level2IndName
    formData.supDataList = []
    supDataList.map((item,i) => {
        // Object.assign({}, exampleObj)
        let newObj = JSON.parse(JSON.stringify(exampleObj))
        newObj.index = i
        newObj.formJsonObj = Object.assign(newObj.formJsonObj, item)
        formData.supDataList.push(newObj)
    })

    console.log('formData', formData)
    // Object.assign({}, exampleObj)


})

//切换完成时限
const deadlineTypeHandleChange =(deadlineType, index)=>{
    if (deadlineType == 0) {
        formData.supDataList[index].formJsonObj.requireEndTime = "";
    }
}

//关闭弹窗
const closeFn = () => {

    formData.supDataList = [];
    closeModal()
    // formData.templateId = "";
}

// 声明props
const props = defineProps({
    dataSource: {
        type: Array,
        default: []
    }
})

//完成时限
const types = ref([])
// const finalOrgs = ref([]);
const getTypes = () => {
    getDeadlineType().then(res => {
        types.value = res
    })
}
getTypes()




const rowSelection = ref({
    checkStrictly: false,
    onChange: (keys: (string | number)[], selectedRows: DataItem[]) => {
        console.log('keys', keys)
        selectedRowKeys.value = keys
    },
});


//上传
// const fileValue = ref<any>([]);
const changeValue = (val, index) => {
    console.log(val, index)
    formData.supDataList[index].formJsonObj.fileValue = val;

};

//获取supid
// const supId = ref('')
const getSupId = () => {
    getSupid().then(res => {
        formData.templateId = res
    })
}
getSupId()

// //定义表格列
const columns: BasicColumn[] = [
// {
//         title: '序号',
//         dataIndex: 'index',
//         // width: 400,
//         align: 'center',
//         resizable: true
//     },
    {
        title: '标题',
        dataIndex: 'title',
        width: 400,
        align: 'center',
        resizable: true
    },
    {
        title: '主要内容',
        dataIndex: 'mainContent',
        width: 400,
        align: 'center',
        resizable: true
    },
    {
        title: '责任单位',
        dataIndex: 'responsibleDepart',
        width: 200,
        align: 'center',
        resizable: true
    },
    {
        title: '完成时限',
        dataIndex: 'deadlineType',
        width: 200,
        align: 'center',
        resizable: true
    },
    {
        title: '要求完成时间',
        dataIndex: 'requireEndTime',
        width: 200,
        align: 'center',
        resizable: true
    },
    {
        title: '附件',
        dataIndex: 'attachments',
        width: 200,
        // align: 'left',
        resizable: true
    },
    {
        title: '操作',
        dataIndex: 'action',
        width: 100
    },
]

//查询责任单位
const orgs = ref([]);
// const finalOrgs = ref([]);
const getOrgs = () => {
    getResponsibleOrg().then(res => {
        orgs.value = res
    })
}
getOrgs()


// 添加/删除
const deal = (type, record) => {
    console.log(type, record)
    if (type == 0) {
        // console.log('exampleObj', exampleObj)
        const obj = Object.assign({}, JSON.parse(JSON.stringify(exampleObj)))
        obj.index = formData.supDataList.length
        formData.supDataList.push(obj)
    }
    else {
        console.log(record.mainContent)
        formData.supDataList.splice(record.index, 1)
        for (let i = 0; i < formData.supDataList.length; i++) {
            formData.supDataList[i].index = i
        }
    }
}

const toExport = () => {
    console.log('selectedRowKeys', selectedRowKeys.value)
}

/**
 * 提交
*/
const handleSubmit = (type) => {
    const fn = type == 1 ? batchSupSend : batchSupSave
    formData.supDataList.map(item => {
        const fileList = JSON.parse(JSON.stringify(item.formJsonObj.fileValue))
        item.formJsonObj.attachments = fileList.map(file => file.storageId).join(',')
        return item
    })
    console.log('formData', formData)
    fn(formData).then(res => {
        closeFn()
    })

}



/**
 * 操作栏
 */
function getTableAction(record): ActionItem[] {
    return [
        {
            label: '删除',
            color: 'error',
            popConfirm: {
                title: '是否确认删除？',
                confirm: deal.bind(null, 1, record),
            },
        },
    ];
}


</script>
<style lang="less" scoped>
.redstar{
    color: red;
}
.formPublic {
    outline: none;
    min-height: 32px;
    text-align: center;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
}

// :focus{
//     background: #FFFFFF;
//     border: 1px solid #2DA7E0;
//      /* 解决input按钮自动填充后 浏览器渲染的默认背景问题 */
//     box-shadow: inset 0 0 0 1000px #FFFFFF!important;
// }</style>