<template>
    <!-- conditionList: {{ conditionList }} -->
    <div v-for="item in conditionList" :key="item.title" class="conditionContainer">
        <div class="title">{{ item.title }}</div>
        <ul v-for="item1 in item.assembleList" :key="item1.conditionType" class="conditions">
            <li class="conditionType">{{ item1.conditionType }}</li>
            <li v-for="item2 in item1.list" :key="item2.conditionId" class="tableColumn">
                <span>{{ item2.conditionContent }}</span>
                <span>{{ item2.conditionRelationship }}
                    <span v-if="item2.logicalRelation == '且' || (item2.logicalRelation == '或' && item2.conditionOrRelationList && item2.conditionOrRelationList.length==1) ">{{ item2.conditionValue }}</span>
                    <a-popover  v-else>
                        <template #content>
                            <p v-for="item3 in item2.conditionOrRelationList">{{ item3.conditionValue }}</p>
                        </template>
                        <span >{{ item2.conditionValue }} <span v-if="item2.conditionOrRelationList && item2.conditionOrRelationList.length>0" style="color:#1890FF" @click="openModal1"> 等{{
                        item2.conditionOrRelationList.length }}条</span></span>
                    </a-popover>
                    
                </span>
            </li>
        </ul>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed, unref, defineProps } from 'vue';

// 声明props
const props = defineProps({
    conditionList: {
        type: Array,
        default: []
    }
}) 
</script>
<style lang="less">
.conditionContainer{
    width: 100%;
    padding: 0 20px;
    text-align: center;
    // border: 1px solid #e9e9e9;
    .title{
        background: #bee0ff;
        line-height: 30px;
        font-size: 16px;
        font-weight: bold;
        border-right: 2px solid #e9e9e9;
    }
    .conditionType{
        background: #f1f1f1;
        font-weight: bold;
    }
    li{
        line-height: 30px;
        font-size: 14px;
        border-bottom: 2px solid #e9e9e9;
    }
    .tableColumn{
        display: flex;
        justify-content: space-between;
        >span{
            display: inline-block;
            width: 50%;
            text-align: center;
        }
        >span:nth-child(1){
            border-right: 2px solid #e9e9e9;
            border-left: 2px solid #e9e9e9;
        }
        >span:nth-child(2){
            border-right: 2px solid #e9e9e9;
        }
    }
    // display: flex;
    // justify-content: space-between;
    // .conditions{
    //     width: 30%;
    // }
}
</style>