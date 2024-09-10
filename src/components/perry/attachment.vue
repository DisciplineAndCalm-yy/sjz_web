<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-08-28 11:05:51
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-09-07 17:33:58
 * @FilePath: \yst-city-qixian-PolicyRecommendationSystem-web\src\components\perry\attachment.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="attachmentContainer">
        <span>附件 : </span>
        <div>
            <a href="javascript:;" v-for="(item,index) in fileList" :key="index" @click="toDownLoad(item.returnPath)">{{ item.name }}</a>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed, unref, defineProps, watch } from 'vue';
import { getTemporaryPath } from '/@/api/common/api'
// 声明props
const props = defineProps({
    attachments: {
        type: String,
        default: ""
    }
})

// 声明数组
let fileList = []

/**
 * 声明处理函数
 * @param str {String} 文件末端路径，多文件逗号隔开
*/
const dealFn = (str) => {
    console.log('str', str)
    const arr = [];
    const array = str.split(',');
    for (let i = 0; i < array.length; i++) {
        let obj = {}
        const returnPath = array[i];

        let tempUrl = returnPath.substring(returnPath.lastIndexOf('/') + 1);

        // fileSuffix -- 后缀
        let [name, fileSuffix] = tempUrl.split('.')
        
        //去除时间戳的文件名称
        const realName = name.split('_')[0] + '.' + fileSuffix;
        // console.log('realName', realName)

        obj.name = realName
        obj.returnPath = returnPath
        arr.push(obj)
    }

    return arr

}

// console.log(111, dealFn('policyBase/ccc_1692785793029.docx'))

//watch
watch(
    () => props.attachments, (newVal, oldVal) => {
        //组装fileList
        fileList = dealFn(newVal)
    },
    {
        immediate: true,
        deep: true
    }
)


/**
 * 下载
 * @param returnPath {String} 返回路径
 * */
const toDownLoad =async (returnPath)=>{
    // const url = `${import.meta.env.VITE_IMAGEPREVIEW_PREFIX}` +  await getTemporaryPath({filePath: returnPath})
    const url = await getTemporaryPath({filePath: returnPath})
    window.open(url)
    // getTemporaryPath({filePath: returnPath}).then(res=>{
    //     console.log(res)
    //     window.open(res)
    // })
}

</script>
<style lang="less" scoped>
.attachmentContainer {
    display: flex;
    span{
        margin-right: 10px;
        margin-left: -10px;
        font-weight: bold;
        font-size:16px;
    }
}
</style>