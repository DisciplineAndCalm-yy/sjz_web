<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-26 16:18:08
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-12-01 11:16:57
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\components\combination.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicModal @register="registerModal" v-bind="$attrs" :title="title" width="40%" :useWrapper="false"
    :canFullscreen="false" :showCancelBtn="false" :showOkBtn="false">
    <iframe
      id="pdfPreviewIframe"
      :src="url"
      frameborder="0"
      width="100%"
      height="550px"
      scrolling="auto">
    </iframe>
  </BasicModal>
</template>

<script lang="ts" setup>
import { BasicModal, useModalInner } from '/@/components/Modal';
import { reactive, computed, nextTick, ref, unref  } from 'vue';
import { addDirStorage, updateDirStorage } from '/@/api/intelligentReport'
import { getTemporaryPath } from '/@/api/common/api';



// 声明Emits
const emit = defineEmits(['success', 'register']);
const title = ref('预览') 
const url = ref('')


const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data)=>{
  setModalProps({ confirmLoading: false });
  url.value = await getTemporaryPath({storageId: data.storageId})
});


</script>

<style lang="less" scoped>
</style>