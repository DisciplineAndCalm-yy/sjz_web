<template>
    <!-- <div class="statistics-table-template-card"> -->
        <div class="sttc-item">
            <div class="sttc-itemcenter">
                <span class="sttc-item-title">{{ Number(type) ? '我要投诉量' : '我要咨询量' }}</span>
                <div class="sttc-item-count">{{ resNumber(card.receivingVolume) }}</div>
            </div>
        </div>

        <div class="sttc-item">
            <div class="sttc-itemcenter">
                <span class="sttc-item-title">处理中</span>
                <div class="sttc-item-count">{{ resNumber(card.processingVolume) }}</div>
            </div>
        </div>

        <div class="sttc-item">
            <div class="sttc-itemcenter">
                <span class="sttc-item-title">完成量</span>
                <div class="sttc-item-count">{{ resNumber(card.completedQuantity) }}</div>
            </div>
        </div>

        <div class="sttc-item">
            <div class="sttc-itemcenter">
                <span class="sttc-item-title">工单平均处理完成时间</span>
                <div class="sttc-item-count">{{ card.workOrderTime }} 天</div>
            </div>
        </div>
    <!-- </div> -->
</template>

<script setup>
import resNumber from '/@/utils/number'
import { defineProps } from 'vue';
let { card, type } = defineProps(['card', 'type']);
console.log('type', typeof(type));
</script>

<style scoped lang="less">
.statistics-table-template {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .statistics-table-template-card {
        height: 230px;
        width: 30.5%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-content: flex-start;

        .sttc-item {
            width: 47%;
            height: 122px;
            background-color: white;
            box-shadow: 0px 0px 6px rgba(0, 0, 0, .05);
            border-radius: 10px;
            display: flex;

            .sttc-itemcenter {
                margin: auto;
                width: 80%;

                .sttc-item-title {
                    font-size: 14px;
                    height: 20px;
                    line-height: 20px;
                    color: #999999;
                }

                .sttc-item-count {
                    font-size: 20px;
                    height: 30px;
                    line-height: 30px;
                    color: #3B8CE9;
                }
            }

        }

        .sttc-item:nth-child(1),
        .sttc-item:nth-child(2) {
            margin-bottom: 20px;
        }
    }

    .statistics-table-template-table {
        width: 67%;
    }
}
</style>
