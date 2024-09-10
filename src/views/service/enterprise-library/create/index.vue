<!--
 * @Author       : eug yyh3531@163.com
 * @Date         : 2023-04-13 10:18:15
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-04-26 17:47:32
 * @FilePath     : /yst-city-qixian-pepolicy-web/src/views/service/enterprise-library/create/index.vue
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <BasePage @init="useInit" />
</template>

<script setup lang="ts">
import BasePage from "../components/BasePage.vue";
import { TypeEnum } from "/@/views/service/enterprise-library/index.data";
const useInit = (cb: Function) => {
    cb(TypeEnum.create)
}

</script>

<style></style>