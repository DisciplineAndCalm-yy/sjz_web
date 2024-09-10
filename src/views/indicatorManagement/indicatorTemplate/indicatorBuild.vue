<template>
    <a-card :title="tableName" style="width: 100%">
        
    
    <div :class="['indicatorContainer', { 'container-padding': props.source == '' }]" ref="containerRef" >
        <!-- <a-affix :target="() => containerRef">
            <a-button type="primary">Fixed at the top of container</a-button>
        </a-affix> -->
        <div class="indicatorTree">
            <!-- indicatorTemplateObj: {{ indicatorTemplateObj }} -->
            <a-space v-if="props.source == ''">
                <!-- indicatorId: {{ indicatorId }} -->
                <a-button type="primary" preIcon="ant-design:export-outlined" @click="toExport"> 导出模板</a-button>
                <j-upload-button type="primary" preIcon="ant-design:import-outlined"
                    @click="onImportXls">导入</j-upload-button>
                <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
            </a-space>
            <!-- <div class="indicatorTemplateName">
                <span>河北省营商环境评价指标体系</span>
                <question-circle-filled class="whyIcon" title="内资企业设立登记业务中（同一登记机关、同一审批事项），进行过两次以上退件的业务量占全部业务数量的比例。" />
                <form-outlined class="editIcon" />
                <plus-outlined class="plusIcon" />
            </div> -->
            <!--定义表格-->
            <!-- expandedRowKeys: {{ expandedRowKeys }} -->
            <!-- :expandedRowKeys="expandedRowKeys" -->
            <BasicTable @register="registerTable">
                <template #headerCell="{ column }">
                    <template v-if="column.key === 'indicatorName'">
                        <div class="indicatorTemplateName">
                            <span :class="{ 'templateName': props.source == '' }" :title="name">{{ name }}</span>
                            <question-circle-filled class="whyIcon" :title="description" v-if="props.source == '' && description != ''" />

                            <form-outlined class="editIcon" v-if="props.source == ''"
                                @click="openIndicatorTemplateModalForm(true, { isUpdate: true, indicatorTemplateObj: { name: name, id: id, description: description } })" />
                            <plus-outlined class="plusIcon" v-if="props.source == '' && name != ''"
                                @click="openIndicatorModalForm(true, { isUpdate: true, indicatorObj: { templateId: id } })" />
                        </div>
                    </template>
                </template>
                <!-- includeQuestion: 0无题目 -->
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'indicatorName'">
                        <div class="indicatorName" @click="toGetQusetionList(record)">
                            <span :title="record.indicatorName"
                                :class="{ 'selectedColor': indicatorId == record.id, 'templateName': props.source == '' }">{{
                                    record.indicatorName }}</span>
                            <form-outlined class="editIcon" v-if="props.source == ''"
                                @click="openIndicatorModalForm(true, { isUpdate: true, indicatorObj: { id: record.id, templateId: record.templateId, indicatorName: record.indicatorName, indicatorType: record.indicatorType, parentId: record.parentId, description: record.description } })" />
                            <delete-outlined class="deleteIcon" @click="toDelete(record.id)" v-if="props.source == ''" />
                            <plus-outlined class="plusIcon"
                                v-if="props.source == '' && (record.indicatorType == 1 || (record.indicatorType == 2 && record.includeQuestion == '0'))"
                                @click="openIndicatorModalForm(true, { isUpdate: true, indicatorObj: { parentId: record.id, templateId: id, indicatorType: record.indicatorType } })" />
                        </div>
                    </template>
                </template>
            </BasicTable>
        </div>
        <!-- 指标体系弹窗 -->
        <indicatorTemplateModalForm @register="registerIndicatorTemplateModalForm" @setMsg='setMsg'>
        </indicatorTemplateModalForm>
        <!-- 新建指标弹窗 -->
        <indicatorModalForm @register="registerIndicatorModalForm" @success='reloadIndicatorList'></indicatorModalForm>
        <!-- 问题弹窗 -->
        <questionModalForm @register="questionModalFormRef" @success='reloadQuestion'></questionModalForm>

        <!-- 模板导出弹窗 -->
        <!-- <templateExportModal @register="templateExportModalRef" :dataSource="dataSource" v-if="showExportModal"></templateExportModal> -->

        <div :class="[props.source == '' ? 'questionList' : 'questionListSource']">
            <questionList :source="props.source" v-if="isQuestionListShow == true" ref="questionListRef"
                :indicatorId='indicatorId' :indicatorObj="indicatorObj" @editQuestion="editQuestion" @reloadTree="reload">
            </questionList>
            <!-- <a-empty v-else/> -->
            <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" v-else style="padding:16px;box-sizing: border-box;" />
        </div>
    </div>
</a-card>
</template>
<script lang="ts" setup>
import { Empty } from 'ant-design-vue';
import { indicatorTree, queryProjectIndicatorTree, indicatorDel, importTemplate, exportTemplate, exportEmptyTemplate } from '/@/api/indicatorManagement/index'
import { DeleteOutlined, QuestionCircleFilled, FormOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { ref, reactive, toRefs, onMounted, createVNode, provide } from 'vue';
import { useListPage } from '/@/hooks/system/useListPage';
import { BasicColumn, BasicTable } from '/@/components/Table';
import indicatorTemplateModalForm from './components/indicatorTemplateModalForm.vue';
import questionModalForm from './components/questionModalForm.vue';
import indicatorModalForm from './components/indicatorModalForm.vue';
import templateExportModal from './components/templateExportModal.vue';
import questionList from './components/questionList.vue';
import { useModal } from '/@/components/Modal';
import { useRoute, useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { exportMethod } from '/@/utils/file/download';
// import { BasicModal, useModalInner } from '/@/components/Modal';
const containerRef = ref();
const showExportModal = ref(false)
// 数据
const dataSource = ref([])
// 声明指标体系弹窗
const [registerIndicatorTemplateModalForm, { openModal: openIndicatorTemplateModalForm, closeModal: closeIndicatorTemplateModalForm, setModalProps: setModalPropsForm }] = useModal();

// 声明新建指标弹窗
const [registerIndicatorModalForm, { openModal: openIndicatorModalForm, closeModal: closeIndicatorModalForm, setModalProps: setIndicatorModalPropsForm }] = useModal();

// 声明三级指标弹窗
const [questionModalFormRef, { openModal: openQuestionModalForm, closeModal: closeIndQuestionModalForm, setModalProps: setQuestionModalPropsForm }] = useModal();

// 声明模板导出弹窗
const [templateExportModalRef, { openModal: openTemplateExportModal, closeModal: closeTemplateExportModal, setModalProps: setModalTemplateExportModal }] = useModal();
//存储模板名称
const indicatorTemplateObj = reactive<any>({
    id: "",
    name: "",
    description: ""
});
// 声明props
const props = defineProps({
    source: {
        type: String,
        default: ''
    }
})

const toExport =()=>{
    exportMethod(exportEmptyTemplate, '指标体系模板');
    // showExportModal.value = true;
    // setTimeout(()=>{
    //     openTemplateExportModal()
    // },200)
}

const expandedRowKeys = ref(['1719616547820589058'])

// 声明路由信息
const route = useRoute();
const router = useRouter()

onMounted(() => {
    if (route.query.id) {
        indicatorTemplateObj.id = route.query.id
        indicatorTemplateObj.name = route.query.name
        indicatorTemplateObj.description = route.query.description ? route.query.description : ""
        setTimeout(() => {
            reload()
        }, 1000);
    } else {
        openIndicatorTemplateModalForm(true)
    }
})

//获取问题列表
const questionListRef = ref('questionListRef');
const indicatorId = ref('0')
const indicatorObj = ref({})
const isQuestionListShow = ref(false)
const toGetQusetionList = (record) => {
    const { indicatorType, id, includeQuestion } = record;
    console.log(record)

    indicatorId.value = id
    if (record.indicatorName) indicatorObj.value = record

    if (indicatorType == "1" || (indicatorType == "2" && record.children != undefined)) {
        isQuestionListShow.value = false
        return
    } else {
        isQuestionListShow.value = true;
    }
    //调用子组件方法
    console.log('questionListRef', questionListRef)
    setTimeout(() => {
        questionListRef.value.getQuestionList(id);
    }, 100);
}

console.log('indicatorTemplateObj', indicatorTemplateObj);

//刷新指标树
const reloadIndicatorList = (data) => {
    // data.indicatorType, data.indicatorId
    reload()
    isQuestionListShow.value = false

}

//刷新问题列表
const reloadQuestion = (data) => {
    // data.indicatorType, data.indicatorId
    reload()
    toGetQusetionList({ indicatorType: data.indicatorType, id: data.indicatorId })
}

//调用编辑
const editQuestion = (payload) => {
    openQuestionModalForm(payload.isOpen, payload.obj)
}

// 保存之后设置指标体系名称
const setMsg = (obj) => {
    indicatorTemplateObj.id = obj.id
    indicatorTemplateObj.name = obj.name
    indicatorTemplateObj.description = obj.description
    router.push({ path: '/indicatorManagement/indicatorTemplate/build', query: { id: obj.id, name: obj.name, description: obj.description } })

}

//删除
const toDelete = (id) => {
    Modal.confirm({
        title: '警告',
        icon: createVNode(ExclamationCircleOutlined),
        content: '您确定要删除该指标吗',
        onOk() {
            indicatorDel({ id: id }).then(res => {
                console.log(res)
                reload()
                isQuestionListShow.value = false
            })
        },
        onCancel() {
            console.log('Cancel');
        },
        class: 'test',
    });

}

// 使用toRefs解构
const { name, id, description } = toRefs(indicatorTemplateObj)

//定义表格列
const columns: BasicColumn[] = [
    {
        title: '河北省营商环境评价指标体系',
        dataIndex: 'indicatorName',
        // width: 170,
        align: 'left',
        resizable: true
    },
    // {
    //     title: 'indicatorType',
    //     dataIndex: 'indicatorType',
    //     // width: 170,
    //     align: 'left',
    //     resizable: true
    // }
]

// 列表页面公共参数、方法
const { tableContext, onExportXls, onImportXls } = useListPage({
    designScope: 'basic-table-demo-ajax',
    tableProps: {
        // title: '用户列表',
        api: props.source == "" ? indicatorTree : queryProjectIndicatorTree, // 空是指标，collect是数据采集查看
        immediate: false,
        columns: columns,
        showActionColumn: false,
        useSearchForm: false,
        expandRowByClick: true,
        pagination: false,
        showTableSetting: false,
        beforeFetch(params) {
            // debugger
            // console.log('indicatorTemplateObj.source', indicatorTemplateObj.source == "")
            if (props.source == "") {
                params.templateId = indicatorTemplateObj.id
            } else {
                params.id = indicatorTemplateObj.id
                params.isAll = false
            }

        },
        afterFetch(data){
            dataSource.value = data

        }
        // actionColumn: {
        //     width: 120,
        // },
    },
    exportConfig: {
        name: route.query.name,
        url: exportTemplate + '?id=' + route.query.id
    },
    importConfig: {
        url: importTemplate + '?id=' + route.query.id
    },
});
//BasicTable绑定注册
const [registerTable, { reload }] = tableContext;
// const nameq = ref('perry');
const open = (isOpen, obj) => {
    console.log(isOpen, obj)
    // alert(1)
    openQuestionModalForm(isOpen, obj)
}

provide('provideObj', {
    open
});


</script>
<style lang="less" scoped>
.indicatorContainer {
    width: 100%;
    display: flex;

    .indicatorTree {
        width: 30%;
        min-width: 430px;
    }

    .questionList {
        width: 70%;
        margin-top: 32px;
    }

    .questionListSource {
        width: 70%;
    }

    .indicatorTemplateName {
        cursor: pointer;
        height: 36px;
        padding: 0 5px;
        line-height: 36px;
        // background: #ECEFF9;
        font-size: 18px;
        text-align: left;
        overflow: hidden;

        span {
            float: left;
        }

        .whyIcon {
            color: #828282;
            font-size: 15px;
            float: left;
            margin: 12px;
            cursor: pointer;
            // display: none;
        }

        .editIcon,
        .plusIcon {
            color: #1790FF;
            font-size: 18px;
            float: right;
            cursor: pointer;
            margin: 10px;
            display: none;
        }
    }

    .indicatorTemplateName:hover>* {
        display: block;
    }

    .selectedColor {
        color: #1790FF;
    }

    .indicatorName {
        // height: 36px;
        padding: 0 5px;
        cursor: pointer;
        // line-height: 36px;
        // background: #ECEFF9;
        // font-size: 18px;
        // text-align: left;
        overflow: hidden;

        span {
            float: left;
        }

        .editIcon,
        .deleteIcon,
        .plusIcon {
            color: #1790FF;
            font-size: 15px;
            float: right;
            cursor: pointer;
            margin-top: 2px;
            margin-right: 10px;
            display: none;
        }

        .plusIcon {
            margin-right: 22px;
        }

        .editIcon {
            margin-right: 10px;
        }

        .deleteIcon {
            color: red;
            margin-right: 22px;
        }
    }

    .indicatorName:hover>* {
        display: block;
    }
}

.templateName {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}</style>