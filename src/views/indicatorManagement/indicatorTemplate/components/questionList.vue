<template>
    <!-- indicatorId: {{ indicatorId }} -->
    <!-- indicatorObj: {{ indicatorObj }} -->
    <!-- listWrapH: {{ listWrapH }} -->
    <div class="indicatorInfo" :style="{ 'background': prop.source == '' ? 'white' : '#F0F8FD' }">
        <div>
            <span>{{ indicatorObj.indicatorType == '2' ? '二级指标名称 : ' : '三级指标名称 : ' }}</span>
            <span>{{ indicatorObj.indicatorName }}</span>
        </div>
        <div>
            <span>指标说明 :</span>
            <span>{{ indicatorObj.description }}</span>
        </div>
    </div>
    <!-- <button @click="getQuestionList()">获取</button> -->
    <a-list class="demo-loadmore-list" :style="{ height: listWrapH }" :loading="initLoading" item-layout="horizontal"
        :data-source="list" v-cloak="list">
        <!-- <template #loadMore>
            <div v-if="!initLoading && !loading"
                :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                <a-button @click="onLoadMore">loading more</a-button>
            </div>
        </template> -->
        <template #renderItem="{ item, index }">
            <a-list-item :class="prop.source == '' ? 'bgColorWhite' : 'bgColorBlue'">
                <div>
                    <header>
                        <h3>指标项说明: {{ item.description }}</h3>
                        <a-space v-if="prop.source == ''">
                            <arrow-up-outlined class="arrowUpIcon" @click="upQSort(item, index, 1)" v-show="index != 0" />
                            <arrow-up-outlined class="arrowUpIcon opacityColor" v-show="index == 0" />
                            <arrow-down-outlined class="arrowDownIcon" @click="upQSort(item, index, 2)"
                                v-show="index != list.length - 1" />
                            <arrow-down-outlined class="arrowDownIcon opacityColor" v-show="index == list.length - 1" />
                            <form-outlined class="editIcon"
                                @click="toEditQuestion(true, { isUpdate: true, questionObj: item })" />

                            <a-popconfirm title="确定要删除该指标项吗?" ok-text="是" cancel-text="否" @confirm="confirm(item.id)"
                                @cancel="cancel">
                                <delete-outlined class="deleteIcon" />
                            </a-popconfirm>
                        </a-space>
                    </header>
                    <a-row>
                        <a-col :span="24">
                            <span>指标类型 : </span>
                            <span>{{ item.questionTypeText }}</span>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="6" v-if="item.questionType == 'number'">
                            <span>指标单位 : </span>
                            <span>{{ item.unit }}</span>
                        </a-col>
                        <a-col :span="6">
                            <span>是否需佐证 : </span>
                            <span>{{ item.evidenceFlagText }}</span>
                        </a-col>
                        <a-col :span="6" v-if="item.questionType == 'number'">
                            <span>计分方式 : </span>
                            <span style="color:#1790FF;cursor: pointer;" @click="showConfig(item)">{{ item.configTypeText
                            }}</span>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="6" v-if="item.questionType == 'number'">
                            <span>是否纳入算分 : </span>
                            <span>{{ item.scoreFlagText }}</span>
                        </a-col>
                        <a-col :span="6" v-if="item.questionType == 'number'">
                            <span>前沿对标值 : </span>
                            <span>{{ item.standardValue }}</span>
                        </a-col>
                    </a-row>
                    <!-- <article>{{ item.description }}</article>
                    <summary v-if="item.name != undefined">{{ item.name }}</summary>
                    <div class="inputContainer">
                        <a-input v-model:value="value" placeholder="请输入"
                            :type="item.unit == undefined ? 'text' : 'number'" />
                        <span v-if="item.unit != undefined">{{ item.unit }}</span>
                    </div> -->

                </div>
                <!-- <a-skeleton avatar :title="false" :loading="!!item.loading" active>  
                    <a-list-item-meta
                        description="Ant Design, a design language for background applications, is refined by Ant UED Team">
                        <template #title>
                            <a href="https://www.antdv.com/">{{ item.name.last }}</a>
                        </template>
                    </a-list-item-meta>
                    <div>content</div>
                </a-skeleton> -->
            </a-list-item>
        </template>
    </a-list>
    <configModal @register="registerModal" :disabled="true" :modalType="prop.source == '' ? 'indicator' : 'project'">
    </configModal>
    <!-- @mouseenter="btnVisible = true" @mouseleave="btnVisible = false" -->
    <a-space class="newBtn" v-if="prop.source == ''">
        <a-button type="primary" ghost class="buildBtn" preIcon="ant-design:plus-outlined"
            @click="toAction(true, { isUpdate: true, questionObj: { questionType: 'number', indicatorId: indicatorId, scoreFlag: 1 } })">创建数值指标项</a-button>
        <a-button type="primary" ghost class="buildBtn txtBtn" preIcon="ant-design:plus-outlined"
            @click="toAction(true, { isUpdate: true, questionObj: { questionType: 'text', indicatorId: indicatorId } })">创建文本指标项</a-button>
    </a-space>
    <a-button type="primary" size="large" class="reback"
        @click="router.push({ path: '/indicatorManagement/indicatorTemplate' })" v-if="prop.source == ''">返回</a-button>
</template>
<script lang="ts" setup>
import { ref, defineExpose, inject, defineProps, defineEmits, computed } from 'vue';
import { useRouter } from 'vue-router';
import { DeleteOutlined, FormOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue';
import { questionList, coloectQuestionList, questionDel, updateSort } from '/@/api/indicatorManagement/index'
import { useModal } from '/@/components/Modal';
import configModal from '../../indicatorAlgorithmConfiguration/components/configModal.vue'


// 通过computed获得doubleCount
const listWrapH = computed(() => {
    let oHeight = document.body.clientHeight;
    return oHeight - (prop.source == '' ? 420 : 500) + 'px'
})


const [registerModal, { openModal }] = useModal()
//使用inject
const toUseProvideFn = inject('provideObj')
const toAction = (isOpen, obj) => {
    toUseProvideFn.open(isOpen, obj)
}

// prop
const prop = defineProps({
    indicatorId: {
        type: String,
        defult: "",
    },
    indicatorObj: {
        type: Object,
        defult: {}
    },
    source: {
        type: String,
        default: ''
    }
});
console.log('indicatorId', prop.indicatorId)
const initLoading = ref(false);
const loading = ref(false);
// const value = ref<string>('');
const list = ref([]);


const btnVisible = ref(false);
// onMounted(() => {
//     getQuestionList(id)

// });
//查看计分方法
const showConfig = (record) => {
    console.log('record-------', record)
    if (record.configType) {
        openModal(true, record)
    }
}

const getQuestionList = (id) => {
    initLoading.value = true
    const fn = prop.source == '' ? questionList : coloectQuestionList
    fn({
        pageNo: 1,
        pageSize: 100,
        indicatorId: id,
    }).then(res => {
        list.value = prop.source == '' ? res.records : res;
        console.log(res)
        initLoading.value = false
    })
}

const onLoadMore = () => {
    loading.value = true;
    // list.value = data.value.concat(
    //     [...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} })),
    // );
    // fetch(questionList)
    //     .then(res => res.json())
    //     .then(res => {
    //         const newData = data.value.concat(res.results);
    //         loading.value = false;
    //         data.value = newData;
    //         list.value = newData;
    //         nextTick(() => {
    //             // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
    //             // In real scene, you can using public method of react-virtualized:
    //             // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
    //             window.dispatchEvent(new Event('resize'));
    //         });
    //     });
};



// 声明事件
const emit = defineEmits(['editQuestion', 'reloadTree'])

// 编辑
const toEditQuestion = (isOpen, obj) => {
    emit('editQuestion', { isOpen: isOpen, obj: obj })
}

//删除
const confirm = (id) => {
    console.log('indicatorId', prop.indicatorId)
    questionDel({ id: id }).then(res => {
        getQuestionList(prop.indicatorId)
        emit('reloadTree')
    })
};

const cancel = (e: MouseEvent) => {
    console.log(e);
    // message.error('Click on No');
};

const upQSort = (item, index, type) => {
    // console.log(list.value[index-1].id)
    // console.log(list.value[index+1].id)
    // console.log(item.id)
    // console.log(item.value)
    // return
    const targetId = type == 1 ? list.value[index - 1].id : list.value[index + 1].id;
    console.log(targetId)
    console.log(item.id)

    // updateSort({sourceId: item.id, targetId: targetId})

    updateSort({ sourceId: item.id, targetId: targetId }).then(res => {
        getQuestionList(prop.indicatorId)
    })

}

// 声明路由信息
const router = useRouter()

// 输出组件的方法，让外部组件可以调用
defineExpose({
    getQuestionList,
})


</script>
<style scoped lang="less">
.demo-loadmore-list {
    min-height: 350px;
    overflow-y: scroll;
}

.buildBtns {
    // width: 350px;
    margin: 30px auto;
}

.actionContainer {
    width: 158px;
    margin: 0 auto;
}

.buildBtn {
    width: 350px;
    height: 45px;
    margin: 0 auto;
}

.blankBtn {
    margin-top: 20px;
    margin-right: 30px;
}

/deep/ .ant-list-items {
    margin: 0 20px;
}

.bgColorWhite {
    background: #F3F5FA;
}

.bgColorBlue {
    background: #F0F8FD;
}

.ant-list-item {
    padding: 20px;
    box-sizing: border-box;
    border-radius: 4px;
    margin-bottom: 10px;

    >div {
        width: 100%;
    }

    h3 {
        font-weight: bold;
    }

    article {
        margin: 5px 0;
    }

    summary {
        font-weight: bold;
        margin: 15px 0 10px;
    }

    span {
        display: inline;
    }

    .inputContainer {
        width: 100%;
        display: flex;
        justify-content: space-between;

        input {
            width: 94%;
        }

        span {}
    }

    header {
        display: flex;
        justify-content: space-between;

        .editIcon,
        .deleteIcon,
        .arrowDownIcon,
        .arrowUpIcon {
            color: #1790FF;
            font-size: 15px;
            float: right;
            cursor: pointer;
            margin-top: 2px;
            margin-right: 10px;
        }

        .deleteIcon {
            color: red;
            margin-right: 22px;
        }

        .arrowUpIcon {
            margin-right: 10px;
        }

        .arrowDownIcon {
            margin-right: 10px;
        }

        .opacityColor {
            opacity: 0.4;
        }

    }
}

.reback {
    display: block;
    width: 420px;
    margin: 20px auto 0;
}
.txtBtn, .txtBtn:hover{
    color:#FF820F;
    border-color: #FF820F;
}

.indicatorInfo {
    // width: 100%;
    margin: 0 20px 10px;
    padding: 10px 20px;
    box-sizing: border-box;
    // background: white;

    >div:nth-child(1) {
        font-weight: bold;
    }

    >div {
        line-height: 34px;
    }

    // margin-bottom: 10px;
}

.ant-col {
    line-height: 37px;

    >span:nth-child(1) {
        font-weight: bold;
    }
}
.newBtn{
    margin-top: 20px;
    margin-left: 20px;
}
</style>