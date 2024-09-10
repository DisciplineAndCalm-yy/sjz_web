<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-12 15:07:14
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-07-20 13:57:28
 * @FilePath     : /yst-city-xixian-enterpriseServiceSystem-web/src/views/service/enterprise-library/components/BasePage.vue
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="p-4">
    <!-- 基本信息 -->
    <EssentialInformation ref="refEssentialInformation" @submit="useValidate" />
    <!-- 人事信息 -->
    <PersonnelInformation ref="refPersonnelInformation" />
    <!-- 经营信息 -->
    <BusinessInformation ref="refBusinessInformation" />
    <!-- 知识产权 -->
    <KnowledgeInformation ref="refKnowledgeInformation" />
    <!-- 其他信息 -->
    <!-- <OtherInformation ref="refOtherInformation" /> -->
    <!-- 荣誉资质 -->
    <DictInformation ref="refQualificationInformation" title="荣誉资质" fileds="certificate"
      :dictList="dictList.ent_info_yqryrz" />
    <!-- 机构设置 -->
    <InstitutionInformation ref="refInstitutionInformation" :dictList="dictList.ent_info_qyxsjg" />
    <!-- 行业许可 -->
    <DictInformation ref="refPermitInformation" title="行业许可" fileds="allow" :dictList="dictList.ent_info_hyxk" />
    <!-- 质量认证 -->
    <DictInformation ref="refQualityInformation" title="质量认证" fileds="standard" :dictList="dictList.ent_info_zlbzrz" />
  </div>
</template>

<script setup lang="ts" name="BasePage">
import { useRoute } from 'vue-router';
import { TypeEnum } from '/@/views/service/enterprise-library/index.data'
import { enterpriseEntInfoAdd, enterpriseEntInfoEdit } from '/@/views/service/enterprise-library/index.api'
// 相关卡片
import PersonnelInformation from "/@/views/service/enterprise-library/components/PersonnelInformation.vue";
import BusinessInformation from "/@/views/service/enterprise-library/components/BusinessInformation.vue";
import EssentialInformation from "/@/views/service/enterprise-library/components/EssentialInformation.vue";
// import OtherInformation from "/@/views/service/enterprise-library/components/OtherInformation.vue";
import KnowledgeInformation from "/@/views/service/enterprise-library/components/KnowledgeInformation.vue";
import InstitutionInformation from "/@/views/service/enterprise-library/components/InstitutionInformation.vue";
import DictInformation from "/@/views/service/enterprise-library/components/DictInformation.vue";

import { onMounted, Ref, ref, unref } from 'vue';
import { useGo } from '/@/hooks/web/usePage';

import { enterpriseEntInfoQueryById, enterpriseEntInfoDictList } from "/@/views/service/enterprise-library/index.api";

const go = useGo()
const route = useRoute()
const emit = defineEmits(['init'])

const refEssentialInformation = ref<HTMLDivElement | null>(null)
const refPersonnelInformation = ref<HTMLDivElement | null>(null)
const refBusinessInformation = ref<HTMLDivElement | null>(null)
const refKnowledgeInformation = ref<HTMLDivElement | null>(null)
// const refOtherInformation = ref<HTMLDivElement | null>(null)
const refQualificationInformation = ref<HTMLDivElement | null>(null)
const refInstitutionInformation = ref<HTMLDivElement | null>(null)
const refPermitInformation = ref<HTMLDivElement | null>(null)
const refQualityInformation = ref<HTMLDivElement | null>(null)

const refList = ref([
  refEssentialInformation,
  refPersonnelInformation,
  refBusinessInformation,
  refKnowledgeInformation,
  // refOtherInformation,
  refQualificationInformation,
  refInstitutionInformation,
  refPermitInformation,
  refQualityInformation
])
const cacheType: Ref<TypeEnum> = ref(TypeEnum.create)
const dictList = ref({
  ent_info_yqryrz: [],
  ent_info_hyxk: [],
  ent_info_qyxsjg: [],
  ent_info_zlbzrz: []
})
const useInitPage = (type: TypeEnum) => {
  // 缓存type
  cacheType.value = type

  // 初始化数据 ( 编辑 | 详情 )
  const initDatas = () => {
    enterpriseEntInfoQueryById({
      id: route.query.id
    }).then(res => {
      refList.value.forEach((current: any) => {
        const { init } = current.value
        init(type, res)
      })
    })
  }
  switch (type) {
    case TypeEnum.create:
      refList.value.forEach((current: any) => {
        const { init } = current.value
        init(type, {})
      })
      break;
    case TypeEnum.edit:
      initDatas()
      break;
    case TypeEnum.details:
      initDatas()
      break;

    default:
      break;
  }
}


onMounted(async () => {
  emit('init', useInitPage)
})

/**
 * 校验
 */
const useValidate = async () => {
  const { useLoading }: any = refEssentialInformation.value
  useLoading && useLoading(true)
  Promise.all(unref(refList).map(({ value: { validate } }: { value: any }) => validate())).then(([
    Essential,
    Personnel,
    Business,
    Knowledge,
    // Other,
    Qualification,
    Institution,
    Permit,
    Quality
  ]: any) => {

    // Essential.entCredential = Essential?.entCredential?.join(',')
    // Essential.entProperties = Essential?.entProperties?.join(',')
    // Essential.technicalCapabilities = Essential?.technicalCapabilities?.join(',')

    useSubmit(Object.assign(Essential, Qualification, Institution, Permit, Quality), {
      ...Personnel,
      ...Knowledge,
      // ...Other 
    }, Business)

  }).catch(error => {
    console.log(error);
    useLoading && useLoading(false)
  })

}

/**
 * 获取字典
 */
const getDictList = () => {
  enterpriseEntInfoDictList({
    dictCodeList: [
      'ent_info_hyxk', // 行业许可
      'ent_info_yqryrz', // 荣誉资质
      'ent_info_qyxsjg', // 机构设置
      'ent_info_zlbzrz' // 质量认证
    ].join(',')
  }).then(res => {
    dictList.value = Object.assign(dictList.value, res)
  })
}
getDictList()

/**
 * 
 * @param entInfo 企业基本信息
 * @param infoDetail 企业信息详情
 * @param infoManages 企业经营信息
 */
const useSubmit = (entInfo: any, infoDetail: any, infoManages: any) => {
  const { useLoading }: any = refEssentialInformation.value
  switch (cacheType.value) {
    case TypeEnum.create:
      enterpriseEntInfoAdd({
        entInfo: Object.assign({
          // entLocation: `${entInfo.longitude || ''},${entInfo.latitude || ''}`
        }, entInfo),
        infoDetail,
        infoManages,
        // longitude: entInfo.longitude,
        // latitude: entInfo.latitude
      }).then(() => {
        useLoading && useLoading(false)
        go('/service/enterprise-library')
      })
      break;
    case TypeEnum.edit:
      enterpriseEntInfoEdit({
        entInfo: Object.assign({
          id: route.query.id,
          // entLocation: `${entInfo.longitude},${entInfo.latitude}`
        }, entInfo),
        infoDetail,
        infoManages,
        // longitude: entInfo.longitude,
        // latitude: entInfo.latitude,
      }).then(() => {
        useLoading && useLoading(false)
        go(`/service/enterprise-library/details?id=${route.query.id}`)
      })
      break;
    case TypeEnum.details:
      break;

    default:
      break;
  }
}
</script>

<style></style>