<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-10-26 16:18:08
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-10-27 18:21:25
 * @FilePath: \yst-province-hebei-web\src\views\indicatorManagement\indicatorAlgorithmConfiguration\components\combination.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicModal @register="registerModal" v-bind="$attrs" title="企业列表" width="60%" :useWrapper="false"
    :canFullscreen="false"  @ok="handleSubmit">
  </BasicModal>
</template>

<script lang="ts" setup>
import { BasicModal, useModalInner } from '/@/components/Modal';
import { reactive, computed, nextTick, ref  } from 'vue';


// 声明Emits
const emit = defineEmits(['success', 'register']);

const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data)=>{
  setModalProps({ confirmLoading: false });
});

//弹框确认
async function handleSubmit() {
  try {
    setModalProps({ confirmLoading: true });
    
    // emit('success', ids);
    closeModal();
    //刷新列表
  } finally {
    setModalProps({ confirmLoading: false });
  }
}
</script>

<style lang="less" scoped>

</style>