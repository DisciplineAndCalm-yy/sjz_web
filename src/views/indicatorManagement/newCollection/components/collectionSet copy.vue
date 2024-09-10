<template>
    <div class="setContainer">
        <h3>参数配置</h3>
        <div class="radioGroup">
            <span class="radioLabel"><span>*</span>数据获取方式 : </span>
            params.departType {{ params.departType }}
            <a-radio-group v-model:value="params.departType" @change="changeDepartType"
                :options="props.monitorType == '1' ? plainOptions : plainOptions2" />
            <!-- 1: {{ dataSource}} -->
            <!-- props: <strong>{{ props }}</strong>
            <hr>
            params{{ params }}
            <strong>dataSource:</strong>
            {{ dataSource }}
            <hr>
            <strong>tableData1:</strong>
            {{ tableData1 }}
            <hr>
            <strong>tableData2: </strong>
            {{ tableData2 }} -->
            <a-button type="primary" v-if="params.departType == '2' && (tableData2.length < 40)"
                style="display: block;text-align: right;" @click="deal(0)">添加</a-button>
            <BasicTable @register="registerTable" :rowSelection="rowSelection">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'sendDepartList'">
                        <a-select v-model:value="record.sendDepartList" class="width-100-percent" allowClear
                            @focus="focusFn" :mode="params.departType == '1' ? 'multiple' : undefined"
                            @change="handleChange(record)">
                            <a-select-option :disabled="item.disabled" :value="item.id" v-for="item in orgs">{{ item.name
                            }}</a-select-option>
                        </a-select>
                    </template>
                    <template v-if="column.key === 'sendUser'">
                        <a-select v-model:value="record.sendUser" class="width-100-percent" allowClear>
                            <a-select-option :value="item.id" v-for="item in record.departs">{{ item.name
                            }}</a-select-option>
                        </a-select>
                    </template>
                    <template v-if="column.key === 'checkUser'">
                        <a-select v-model:value="record.checkUser" class="width-100-percent" allowClear>
                            <a-select-option :value="item.id" v-for="item in checkUsers">{{ item.name }}</a-select-option>
                        </a-select>
                    </template>
                </template>
                <!--操作栏-->
                <template #action="{ record }" v-if="params.departType == '2'">
                    <TableAction :actions="getTableAction(record)" />
                </template>
            </BasicTable>
        </div>
        <!-- v-if="indicatorId != ''"  -->
        <div class="steps-action">
            <a-space>
                <a-button @click="close">关闭</a-button>
                <a-button type="primary" @click="save">保存配置</a-button>
            </a-space>
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineProps, ref, toRefs, reactive, defineExpose, watch, inject } from 'vue';
import { RadioGroupProps } from 'ant-design-vue';
import { BasicTable, useTable, BasicColumn, TableAction, FormSchema, ActionItem } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { querySendOrg, querySets, querySendDepart, queryCheckRole, replaySet } from '/@/api/indicatorManagement/index'
import { emit } from 'process';
import { useMessage } from '/@/hooks/web/useMessage';

const { notification } = useMessage();

// 声明props
const props = defineProps({
    departType: {
        type: String,
        default: '1'
    },
    questionId: {
        type: String,
        default: ''
    },
    questionIds: {
        type: Array,
        default: []
    },
    monitorType: {//1是市、2是区
        type: String,
        default: ''
    }
})

//配置数据
const params = reactive({
    "departChildren": [],
    "departType": "",
    "questionIds": []
})

//根据类型不同，下拉也不同
const plainOptions: RadioGroupProps['options'] = [
    { label: '同级报送', value: '1' },
    { label: '下级报送', value: '2' }
];

const plainOptions2: RadioGroupProps['options'] = [
    { label: '同级报送', value: '1' }
];




const columns: BasicColumn[] = [
    // {
    //     title: '序号',
    //     dataIndex: 'index'
    // },
    {
        title: '报送范围',
        dataIndex: 'sendDepartList',
        width: 400
    },
    {
        title: '报送部门',
        dataIndex: 'sendUser'
    },
    {
        title: '校核角色',
        dataIndex: 'checkUser'
    },

]

//tab1的表格数据
const tableData1 = ref([
    {
        sendDepartList: [],
        sendUser: "",
        checkUser: "",
    }
])

//tab2的表格数据
const tableData2 = ref([
    {
        sendDepartList: [],
        sendUser: "",
        checkUser: "",
        departs: []
    }
])

const exampleObj = {
    sendDepartList: [],
    sendUser: "",
    checkUser: "",
    departs: []
}


let dataSource = ref([])

//切换数据获取方式，切换数据
const changeDepartType = (a) => {
    // const value = a.target.value;
    // dataSource.value = value == '1' ? tableData1.value : tableData2.value
    reload()
}




// 添加/删除
const deal = (type, record) => {
    console.log(type, record)
    if (type == 0) {
        // console.log('exampleObj', exampleObj)
        const obj = Object.assign({}, exampleObj)
        obj.index = dataSource.value.length
        dataSource.value.push(obj)
    } else {
        dataSource.value.splice(record.index, 1)
        for (let i = 0; i < dataSource.value.length; i++) {
            dataSource.value[i].index = i
        }
    }
}

//查询报送范围
const orgs = ref([]);
// const finalOrgs = ref([]);
const getOrgs = () => {
    querySendOrg({ monitorType: props.monitorType }).then(res => {
        orgs.value = res
    })
}
getOrgs()


const focusFn = () => {
    const departType = params.departType
    if (departType == "2") {
        const selectOrgs = dataSource.values.map(item => item.sendDepartList[0])
        finalOrgs.value = orgs.value.map(item => {
            if (selectOrgs.includes(item.id)) {
                item.disabled = true
            } else {
                item.disabled = false
            }
            return item
        })
    } else {
        finalOrgs.value = orgs.value
    }
}

//查询校核角色
const checkUsers = ref([]);
const getCheckUsers = () => {
    queryCheckRole().then(res => {
        checkUsers.value = res
    })
}
getCheckUsers()

//选择
const handleChange = (record) => {
    console.log('record', record);
    // return
    if (params.departType == 1) {
        getDepart(params.departType, null, record.index)
    } else {
        getDepart(params.departType, record.sendDepartList, record.index)
        dataSource.value[record.index].sendDepartList = [record.sendDepartList];
        dataSource.value[record.index].sendUser = "";
    }
};

//查询报送部门
const departs = ref([]);
const getDepart = (departType, departId, index) => {
    let params = { departType: departType }
    if (departType == 2) {
        params.departId = departId
    }
    console.log('params', params)
    querySendDepart(params).then(res => {
        departs.value = res;
        dataSource.value[index].departs = res;
        // if (departType == '2') {
        //     dataSource.value[index].departs = res;
        // }
    })
}

const findEmptyValue = (obj, parentKey = null) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const currentKey = parentKey ? `${parentKey}.${key}` : key;

            if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
                return { key: currentKey, value: obj[key] };
            } else if (typeof obj[key] === 'object') {
                const nestedResult = findEmptyValue(obj[key], currentKey);
                if (nestedResult) {
                    return nestedResult;
                }
            }
        }
    }

    return null; // 所有值都不为空
}

//校验重复
const isSameValue = (array, key) => {
    // let firstValue = arr[0][key];
    let newArr = [];
    let a = false
    for (let i = 0; i < array.length; i++) {
        const firstValue = array[i][key];
        if (!newArr.includes(firstValue)) {
            newArr.push(firstValue)
            a = false
        } else {
            a = true
        }
    }
    return a
}


// 保存配置
const emit = defineEmits(['getList']) //请求step3的列表
const save = () => {
    // console.log(isSameValue(dataSource.value, 'sendUser'))
    let isSame = isSameValue(dataSource.value, 'sendUser')
    console.log('isSame', isSame)
    if (isSame == true) {
        notification.error({
            message: "警告",
            description: "配置内容不能重复，请检查",
            duration: 3,
        });
        return
    }
    params.departChildren = dataSource.value.map(item => {
        console.log(item)
        // delete item.departs
        // delete item.index
        return item
    })
    const obj = JSON.parse(JSON.stringify(params));
    const result = findEmptyValue(obj);
    console.log('isSame', isSame)
    console.log('params', params)
    console.log('result', result)
    if (result) {
        // console.log(`发现空值，键为 ${result.key}，值为 ${result.value}`);
        notification.error({
            message: "警告",
            description: "配置内容不能为空，请检查",
            duration: 3,
        });
    } else {
        params.departChildren = params.departChildren.map(item => {
            // delete item.departs
            // delete item.index
            return item
        })
        // console.log('对象中所有值都不为空');
        replaySet(params).then(res => {
            emit('getList', { departType: params.departType, questionId: params.questionIds[0] })
        })
    }
    // return
    // console.log('params', params)
    // console.log(11111111111)
    // console.log('params', toRefs(params))

}

// 注入
const provideState = inject('provideState')
const step2Provide = inject('step2Provide')

const close = () => {
    provideState.setindicatorId('')
    step2Provide.reload()
}
// getDepart()

/**
 * 操作栏
 */
function getTableAction(record): ActionItem[] {
    return [
        {
            label: '删除',
            popConfirm: {
                title: '是否确认删除？',
                confirm: deal.bind(null, 1, record),
            },
        },
    ];
}

//审核状态传参，父页面监听-执行
// export const currentAuditStatus = ref(0);


// 列表页面公共参数、方法
const { tableContext } = useListPage({
    tableProps: {
        // title: '指标体系列表',
        api: querySets,
        columns: columns,
        // dataSource: dataSource,
        size: 'small',
        // scroll: { x: 1300 },
        useSearchForm: false,
        fetchSetting: {
            listField: 'res'
        },
        formConfig: {
            labelWidth: 150,
            //   schemas: searchFormSchema,
            showAdvancedButton: false,
            // fieldMapToTime: [
            //   ['auditCreatedTime', ['startDate', 'endDate'], 'YYYY-MM-DD'],
            //   ['releaseCreatedTime', ['startDate', 'endDate'], 'YYYY-MM-DD'],
            // ],
            resetFunc: async () => {
                // currentAuditStatus.value = 0
            },
        },
        showTableSetting: false,
        // showActionColumn: false,
        actionColumn: {
            width: 120,
            fixed: 'right'
        },
        rowKey: 'id',
        //定义rowSelection的类型，默认是checkbox多选，可以设置成radio单选 
        // rowSelection: { type: 'radio' },
        // 请求之前对参数做处理
        beforeFetch(params) {
            console.log('props', props)
            params.questionId = props.questionId
        },
        afterFetch(data) {
            console.log('data', data)
            // alert(1)
            console.log('data.length', data.length)
            if (data.length > 0) {
                // alert(1)
                //回显
                if (params.departType == props.departType) {
                    if (params.departType == "1") {
                        tableData1.value = data
                        dataSource = tableData1
                    } else {
                        tableData2.value = data
                        dataSource = tableData2
                    }



                    for (let i = 0; i < data.length; i++) {
                        const item = data[i]
                        getDepart(props.departType, item.sendDepartList[0], i)
                    }
                } else {
                    //切换
                    dataSource = params.departType == "1" ? tableData1 : tableData2
                }

            } else {
                // alert(2)
                // 新增/切换
                dataSource = params.departType == "1" ? tableData1 : tableData2
            }
            console.log('-------------1', dataSource.value)
            // data = dataSource;
            dataSource.value = dataSource.value.map((item, index) => {
                item.index = index;
                if (params.departType == '2' && item.departs == undefined) {
                    item.departs = []
                }

                return item
            })
            // focusFn()
            console.log('-------------2', dataSource.value)
            return dataSource.value

        }
    },
});

// setTimeout(() => {
//     dataSource.value = [{
//         sendDepartList: "b",
//         sendUser: "b",
//         checkUser: "b"
//     }]
// }, 5000);

//注册table数据
const [registerTable, { reload, clearSelectedRowKeys, setColumns, getForm }, { rowSelection, selectedRows, selectedRowKeys }] = tableContext;

watch(props, (newVal) => {
    console.log('person发生了变化', newVal.departType)
    // params.departType = newVal.departType;
    params.questionIds = newVal.questionIds
}, { deep: true })

//清除数据
const clear = () => {
    tableData1.value = [{
        sendDepartList: [],
        sendUser: "",
        checkUser: "",
        departs: []
    }]

    tableData2.value = [{
        sendDepartList: [],
        sendUser: "",
        checkUser: "",
        departs: []
    }]

    params.departType = props.departType;
    // alert(1)
    params.questionIds = props.questionIds
    reload()
}
// 将方法、变量暴露给父组件使用，父组见才可通过ref API拿到子组件暴露的数据
defineExpose({
    clear
})
</script>
<style lang="less" scoped>
.setContainer {
    width: 100%;
    text-align: left;

    h3 {
        text-align: left;
        font-weight: bold;
        font-size: 17px;
    }

    .radioGroup {
        .radioLabel {
            display: inline-block;
            width: 130px;
            margin-left: 50px;
            position: relative;

            span {
                color: red;
                font-size: 20px;
                position: absolute;
                left: -10px;
                top: -1px;
            }
        }
    }
}
</style>