<template>
    <a-card class="collect-progress" size="small" title="指标体系">
        <BasicTable @register="registerTable" >
                <template #headerCell="{ column }">
                    <template v-if="column.key === 'indicatorName'">
                        <div class="indicatorTemplateName">
                            <span>{{ name }}</span>
                            <question-circle-filled class="whyIcon" :title="description" />

                            <form-outlined class="editIcon"
                                @click="openIndicatorTemplateModalForm(true, { isUpdate: true, indicatorTemplateObj: { name: name, id: id, description: description } })" />
                            <plus-outlined class="plusIcon"
                                @click="openIndicatorModalForm(true, { isUpdate: true, indicatorObj: { templateId: id } })" />
                        </div>
                    </template>
                </template>
                <!-- includeQuestion: 0无题目 -->
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'indicatorName'">
                        <div class="indicatorName" @click="toGetQusetionList(record)">
                            <span :class="{'selectedColor': indicatorId == record.id}">{{ record.indicatorName }}</span>
                            <form-outlined class="editIcon"
                                @click="openIndicatorModalForm(true, { isUpdate: true, indicatorObj: record })" />
                            <delete-outlined class="deleteIcon" @click="toDelete(record.id)" />
                            <plus-outlined class="plusIcon" v-if="record.indicatorType == 1 || (record.indicatorType == 2 && record.includeQuestion == '0')"
                                @click="openIndicatorModalForm(true, { isUpdate: true, indicatorObj: { parentId: record.id, templateId: id, indicatorType:record.indicatorType } })" />
                        </div>
                    </template>
                </template>
            </BasicTable>
    </a-card>
</template>
<script lang="ts" setup>
import { BasicColumn, BasicTable } from '/@/components/Table';
</script>