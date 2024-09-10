<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-25 18:23:56
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-05 11:00:51
 * @FilePath     : /yst-city-xixian-enterpriseServiceSystem-web/src/views/service/enterprise-library/components/DictInformation.vue
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <a-card :bordered="false" size="small" :title="false" class="!mt-4">
        <BasicTitle>{{ title }}</BasicTitle>
        <a-row :gutter="[16, 16]" class="mt-4">
            <a-col class="gutter-row" :span="4" v-for="dict in dictList" :key="dict.value">
                <a-button class="w-full !whitespace-pre-line text-center !min-h-16"
                    :type="vals.has(dict.value) ? 'primary' : ''" @click.stop="useSetActive(dict.value)">
                    {{ dict.label }}
                </a-button>
            </a-col>
        </a-row>
    </a-card>
</template>

<script setup lang="ts">
import { computed, Ref, ref, unref } from "vue"
import { TypeEnum } from "../index.data";
import { BasicTitle } from '/@/components/Basic/index';

const { dictList, title, fileds } = defineProps({
    title: String,
    fileds: {
        type: String,
        default: 'standard'
    },
    dictList: {
        type: Array<any>,
        default: [],
    }
})

const vals = ref<Set<string>>(new Set())

const pageType: Ref<TypeEnum> = ref(TypeEnum.create)
const isCreate = computed(() => {
    return unref(pageType) === TypeEnum.create
})

const isEdit = computed(() => {
    return unref(pageType) === TypeEnum.edit
})

const isDetails = computed(() => {
    return unref(pageType) === TypeEnum.details
})

const useSetActive = (key: string) => {
    if (isDetails.value) return false
    unref(vals).has(key) ? vals.value.delete(key) : vals.value.add(key)
}
// 初始化
const init = (type: TypeEnum, params: any) => {
    pageType.value = type

    const initVals = () => {
        if (!params?.entInfo[fileds]) return
        JSON.parse(params.entInfo[fileds]).forEach(f => vals.value.add(f))
    }

    switch (type) {
        case TypeEnum.create:
            break;
        case TypeEnum.edit:
            initVals()
            break;
        case TypeEnum.details:
            initVals()
            break;
        default:
            break;
    }
}

const validate = () => {
    return Promise.resolve({
        [fileds]: JSON.stringify(Array.from(unref(vals)))
    })
}

const getFieldsValue = () => {
    // return refOtherInformation.value?.getFieldsValue()
}

const setFieldsValue = () => {
    // return refOtherInformation.value?.setFieldsValue(arg)
}

defineExpose({
    init,
    validate,
    getFieldsValue,
    setFieldsValue,
})
</script>

<style></style>