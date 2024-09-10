<template>
    <!-- pageSchema: {{ pageSchema }} -->
    <!-- selectKeys: {{ selectKeys }} -->
    <!-- modalShow: {{ modalShow }} -->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" class="superviseTable">
        <template #between>
            <a-row class="summary">
                <a-col :span="4">
                    <a-tooltip title="统计维度为具体子任务，仅支持与子任务状态、完成时限、发布日期进行联动查询">
                        <img :src="warning" alt="警告图标" class="warningIcon">
                        <span class="warningTxt">请注意!</span>
                    </a-tooltip>

                </a-col>
                <!-- selectedKey: {{ selectedKey }} -->
                <a-col :span="4" v-for="(value, key) in summary">
                    <div class="summaryItem" @click="toSelect(key)"
                        :style="{ 'color': key == selectedKey ? 'white' : null, 'background': key == selectedKey ? colors[key] : null }">
                        <span class="labelTxt">{{ key }}</span> ：<span>{{ value }}</span>
                    </div>
                </a-col>
            </a-row>
        </template>
        <template #tableTitle class="btnContainer" v-if="has_city_fgw_Role">
            <a-button type="primary" @click="toNew">新建任务</a-button>
            <a-space>
                <!-- <a-popconfirm title="确定要催办这些任务吗?" @confirm="pushCase()">
                    <a-button class="orangeBtn" :disabled="selectedRows.length == 0">催办</a-button>
                </a-popconfirm> -->
                <a-button class="orangeBtn" :disabled="selectedRows.length == 0" @click="toPush()">催办</a-button>
                <a-button type="primary" ghost @click="download(1)">模板下载</a-button>
                <!-- <a-button type="primary" ghost @click="onImportXls">批量导入任务</a-button> -->
                <j-upload-button size="small" type="primary" ghost
                    @click="handleImport($event, 1)">批量导入任务</j-upload-button>
                <a-popconfirm title="确定要批量发起任务吗?" @confirm="handleActive()">
                    <a-button type="primary" ghost :disabled="selectedRows.length == 0">批量发起任务</a-button>
                </a-popconfirm>

                <a-button type="primary" ghost :disabled="selectedRows.length == 0"
                    @click="download(2)">下载待核定结果</a-button>
                <!-- <a-button type="primary" ghost @click="sendAnnounce">导入待核定结果</a-button> -->
                <j-upload-button size="small" type="primary" ghost
                    @click="handleImport($event, 2)">导入待核定结果</j-upload-button>
                <!-- <j-upload-button size="small" type="link" v-if="record.activateStatus == '2'" @click="handleImport($event, record)">导入</j-upload-button> -->
                <a-button type="primary" :disabled="selectedRows.length == 0" @click="download(3)">导出</a-button>
            </a-space>
        </template>
        <!--操作栏-->
        <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
        </template>
    </BasicTable>

    <superviseModal @register="register" @success="reload" @setModalHidden="setModalHidden" v-if="modalShow">
    </superviseModal>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import warning from '/@/assets/images/warning.png';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
import { useModal } from '/@/components/Modal';
import superviseModal from './components/superviseModal.vue';
import { useListPage } from '/@/hooks/system/useListPage';
import { getColumns } from './index.data';
import { useRoute, useRouter } from 'vue-router';
import { exportMethod } from '/@/utils/file/download';
import { queryRolesByCurUser, superviseList, getSchemas, superviseDel, superviseSendBatch, urgeBatch, dataImport, reviewDataImport, templateExport, reviewDataExport, dataExport } from '/@/api/supervise/index'

//   声明路由
const router = useRouter()

const route = useRoute()

const [register, { openModal, closeModal, setModalProps }] = useModal();





// 禁止勾选
const getCheckboxProps = (record) => {           //禁用的方法
    return {
        // disabled: record.activateStatus != '2'
    };
}

//模板id
const templateId = ref('')
//菜单名称
const templateName = ref('')
//最终的查询条件集合
const searchFormSchema = ref([])

const modalShow = ref(false)

//json
const pageSchema = ref('')

//列表展示字段
const keys = ref([])

//当前用户是否有city_fgw角色
const has_city_fgw_Role = ref(true)

//summary数据
const summary = ref({
    "已超期": "",
    "即将超期": "",
    "黄牌": "",
    "红牌": ""
})
// const summary = ref[
//     {
//         name: "已超期",
//         expiredCount: ""
//     }
// ]

// 生命周期
onMounted(() => {
    //获取templateId和路由名称
    const id = route.path.split('/').pop()
    templateId.value = id
    templateName.value = route.meta.title

    // 设置查询条件
    searchFormSchema.value = getColumns(templateName.value, 'search')

    //获取schemas
    getSchemasFn({ templateId: id })

    getQueryRolesByCurUser()
})

//选中
const selectedKey = ref('')
// const colors = ref(['#D59D30', '#FFDC60', '#E3E800', '#FF4B4B'])
const colors = ref({
    "已超期": "#D59D30",
    "即将超期": "#FFDC60",
    "黄牌": "#E3E800",
    "红牌": "#FF4B4B"
})
const toSelect = (key) => {
    selectedKey.value = selectedKey.value != key ? key : ""
    let filterType = ""
    switch (selectedKey.value) {
        case "已超期": filterType = 0
            break;
        case "即将超期": filterType = 1
            break;
        case "黄牌": filterType = 2
            break;
        case "红牌": filterType = 3
            break;
        default: filterType = ""
            break;
    }
    setProps({
        searchInfo: {
            filterType: filterType
        }
    })
    reload()
}

//导出
const download = (type) => {
    switch (type) {
        case 1:
            exportMethod(templateExport, `${templateName.value}-模板.xlsx`, { templateId: templateId.value })
            break;
        case 2:
            exportMethod(reviewDataExport, `${templateName.value}-待核定结果.xlsx`, { templateId: templateId.value, supList: selectedRowKeys.value }, 'post')
            clearSelectedRowKeys()
            break;
        case 3:
            exportMethod(dataExport, `${templateName.value}.xlsx`, { templateId: templateId.value, supList: selectedRowKeys.value }, 'post')
            clearSelectedRowKeys()
            break;
        default:
            break;
    }

}

/**
 * 查询当前用户角色
*/
const getQueryRolesByCurUser = () => {
    queryRolesByCurUser().then(res => {
        console.log(11111111111, res.includes('city_fgw'))
        has_city_fgw_Role.value = res.includes('city_fgw')

    })
}

/**
 * 导入
*/
const handleImport = (file, type) => {
    const fn = type == 1 ? dataImport : reviewDataImport
    fn(file.file, { templateId: templateId.value })
    setTimeout(() => {
        reload()
        clearSelectedRowKeys()
    }, 1500);
}

/**
 * 获取json数据
 * @param additionalShowKeys {Array} 督办分类列表除配置显示外的额外字段
 * */
const getSchemasFn = async (params) => {
    await getSchemas(params).then(res => {
        // 督办分类列表除配置显示外的额外字段
        const additionalShowKeys = getColumns(templateName.value, 'list')

        console.log('additionalShowKeys', additionalShowKeys)
        //赋值
        pageSchema.value = res

        //获取配置的展示字段
        const arr = JSON.parse(res).schemas[0].children[0].children

        // 列表显示字段合并，最终展示字段
        keys.value = [...getKeys(arr), ...additionalShowKeys]
    })

    //查询
    reload()
}

// 列表页面公共参数、方法
const { tableContext } = useListPage({
    tableProps: {
        title: '督办列表',
        api: superviseList,
        immediate: false,
        columns: [],
        size: 'small',
        expandRowByClick: true,
        scroll: { x: 1300 },
        showTableSetting: false,
        // searchInfo: {templateId: 111},
        fetchSetting: {//配置返回参数
            listField: 'dataSource'
        },
        formConfig: {
            labelWidth: 150,
            schemas: searchFormSchema,
            showAdvancedButton: false,
            fieldMapToTime: [
                ['requireTime', ['requireStartTime', 'requireEndTime'], 'YYYY-MM-DD'],
                ['createTime', ['releaseStartTime', 'releaseEndTime'], 'YYYY-MM-DD']
            ],
            resetFunc: async () => {
                // currentAuditStatus.value = 0
            },
        },
        actionColumn: {
            width: 250,
            fixed: 'right'
        },
        rowKey: 'supId',
        rowSelection: {
            preserveSelectedRowKeys: false,
            getCheckboxProps: getCheckboxProps
        },
        // 请求之前对参数做处理
        beforeFetch(params) {
            params.templateId = templateId.value
        },
        afterFetch(data) {
            //获取数据
            let rawData = getRawDataSource()
            console.log('keys', keys.value)

            summary.value['已超期'] = rawData.expiredCount;
            summary.value['即将超期'] = rawData.immediatelyExpiredCount;
            summary.value['黄牌'] = rawData.yellowCardCount;
            summary.value['红牌'] = rawData.redCardCount;

            //筛选要展示的字段(按照keys的顺序排列)
            let columns = keys.value.map(key => {
                return rawData.columns.filter(column => column.title == key)[0]
            })

            // const columns = rawData.columns.filter(item => {
            //     const isCurrentKeyShow = keys.value.includes(item.title)
            //     if (isCurrentKeyShow == true) {
            //         return item
            //     }
            // })
            columns = columns.filter(column => column != undefined)
            console.log('columns', columns)
            // 设置columns
            setColumns(columns)
        },
    }
});




//注册table数据
const [registerTable, { reload, setProps, clearSelectedRowKeys, setColumns, getRawDataSource, getSelectRowKeys }, { rowSelection, selectedRows, selectedRowKeys }] = tableContext;


/** 
 * 操作栏
 */
function getTableAction(record): ActionItem[] {
    return [
        {
            label: '发起',
            popConfirm: {
                title: '是否确认发起当前任务？',
                confirm: handleActive.bind(null, record.supId),
            },
            ifShow: () => {
                return record.supStatus == '1' && record.parentId == null && has_city_fgw_Role.value
            },
        },
        {
            label: '查看',
            onClick: toNextPage.bind(null, record, 'detail'),
            ifShow: () => {
                return record.children == undefined && record.parentId != null
            },
        },
        {
            label: '编辑',
            color: 'warning',
            onClick: toEdit.bind(null, record),
            ifShow: () => {
                return record.supStatus == '1' && record.parentId == null && has_city_fgw_Role.value
            },
        },
        {
            label: '删除',
            color: 'error',
            popConfirm: {
                title: '是否确认删除？',
                confirm: handleDelete.bind(null, record),
            },
            ifShow: () => {
                return record.supStatus == '1' && record.parentId == null && has_city_fgw_Role.value
            },
        }
    ];
}

/**
 * 获取展示字段
 * @param arr {Array} schemas对象数组
*/

const getKeys = (arr) => {
    const newarr = arr.map(item => {
        if (item.isShow == true) {
            return item.label
        } else {
            return null; // 不符合条件时返回null或其他自定义值
        }
    }).filter(Boolean); // 去除结果中的空值（null）
    return newarr
}

//催办
const toPush = () => {
    Modal.confirm({
        title: '确定要催办这些任务吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '若勾选任务中包含草稿、待核定、已完成任务会自动过滤，不会进行催办',
        onOk() {
            pushCase()
        },
        onCancel() {
            console.log('Cancel');
        },
        class: 'test',
    });
}

/**
 * 催办
 * @param supIds {String} 督办数据ids
 * @param templateId {String} 模板id
*/
const pushCase = () => {
    urgeBatch({ supIds: selectedRowKeys.value.join(','), templateId: templateId.value }).then(res => {
        clearSelectedRowKeys()
        reload()
    })
};





// 方法
const toNextPage = (record, suffix) => {
    let queryObj = { supId: record.supId, has_city_fgw_Role: has_city_fgw_Role.value }
    if (suffix == 'detail') {
        queryObj.templateId = record.templateId
    }
    router.push({ path: '/supervise/' + suffix, query: queryObj })
};

/**
   * 删除事件
   * @param supId {String} 督办数据id
   * @param templateId {String} 模板id
   */
async function handleDelete(record) {
    await superviseDel({ supId: record.supId, templateId: record.templateId }).then(res => {
        reload()
    })
}

/**
 * 去编辑
 * @param isUpdate {Boolean} 模板Schema
 * @param supId {String} 督办数据id
 * @param templateId {String} 模板id
 * @param pageSchema {String} 模板Schema
*/
function toEdit(record) {
    modalShow.value = true
    setTimeout(() => {
        openModal(true, { isUpdate: true, pageSchema: pageSchema, supId: record.supId, templateId: record.templateId })
    }, 200)

}



/**
 * 发起
 * @param supIds {String} 督办数据ids
 * @param templateId {String} 模板id
*/
async function handleActive(supId) {
    const supIds = supId ? supId : getSelectRowKeys().join(',')
    await superviseSendBatch({ templateId: templateId.value, supIds: supIds }).then(res => {
        reload()
        clearSelectedRowKeys()
    })
}

/**
 * 新建
 * @param isUpdate {Boolean} 模板Schema
 * @param pageSchema {String} 模板Schema
 * @param templateId {String} 模板id
 */
const toNew = () => {
    modalShow.value = true;
    setTimeout(() => {
        openModal(true, { isUpdate: false, pageSchema: pageSchema, templateId: templateId })
    }, 200)
}


//设置弹窗隐藏
const setModalHidden = (data => {
    modalShow.value = data
})





</script>

<style lang="less" scoped>
/deep/ .ant-btn-background-ghost[disabled],
.ant-btn-background-ghost[disabled]:hover {
    color: rgba(0, 0, 0, 0.25) !important;
    background-color: #f5f5f5 !important;
    border-color: #d9d9d9 !important;
}

/deep/ .jeecg-basic-table-header__tableTitle {
    display: flex;
    width: 100%;
    justify-content: space-between;
}

/deep/ .jeecg-basic-table-header__toolbar {
    width: 0px;
}

.summary {
    height: 54px;
    background: #FFF7E8;
    border: 1px solid #FFD88C;
    border-radius: 4px;
    padding: 11px 10px;
    margin: 10px 0;
    position: relative;
}

.warningIcon {
    position: absolute;
    top: 5px;
    left: 25px;
    width: 24px;
    height: 24px;
}

.warningTxt {
    margin-left: 58px;
    // font-weight: bolder;
    color: #333333;
    line-height: 32px;
    cursor: pointer;
}

.labelTxt {
    // font-weight: bolder;
    // color: #333333;
}

.summaryItem {
    width: 140px;
    cursor: pointer;
    transition: 0.5s;
    padding: 4px 8px;
    border-radius: 4px;
}

// .summaryItem :hover {
//     background: #000;
//     border-radius: 4px;
// }
.summaryItem:hover {
    background-color: #f8e3bc;
    border-radius: 4px;
    color: white;
}
</style>