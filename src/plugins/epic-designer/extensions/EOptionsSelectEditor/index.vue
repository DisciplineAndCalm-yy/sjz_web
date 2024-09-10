<template>
  <div class="">
    <div class="py-4 my-2 text-center text-gray-400 bg-white" v-show="!modelValueComputed?.length">暂无选项</div>
    <!-- <div>
      <div :class="tree ? 'grid-cols-[16px_auto_auto_16px_16px]' : 'grid-cols-[16px_auto_auto_16px]'"
        class="option-item grid gap-2 items-center mb-2">
        <span></span>
        <div class="text-center">label</div>
        <div class="text-center">value</div>
      </div>
    </div> -->
    <a-select ref="select" v-model:value="currentKey" style="width: 100%" @change="handleChange">
      <a-select-option v-for="item in getAllDictKey" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
    </a-select>
    <KOptionsCol v-model="modelValueComputed" />
    <!-- <Button @click="handleAdd">添加选项</Button> -->
  </div>
</template>

<script lang="ts" setup>
  import KOptionsCol from './optionsCol.vue';
  import { pluginManager } from '@coderlt/form-designer';
  import { provide, computed, ref } from 'vue';
  import { useUserStore } from '/@/store/modules/user';

  //   pluginManager.component('EOptionsSelectEditor', async () => await import('./EOptionsSelectEditor/index.vue'));

  const userStore = useUserStore();

  const currentKey = ref('');
  const getAllDictKey = computed(() => {
    const keys = Object.keys(userStore.getAllDictItems);

    // keys.map((key) => ({ value: key, label: key }))
    return keys.map((key) => ({ value: key, label: key }));
  });

  const handleChange = (key) => {
    const values = userStore.getAllDictItems[key] || [];

    modelValueComputed.value = values.map(({ value, label }) => ({ value, label }));
  };

  const Button = pluginManager.getComponent('button');
  const props = defineProps<{
    tree?: boolean;
    modelValue: Option[];
  }>();

  console.log('propsselect', props);

  const emit = defineEmits(['update:modelValue']);
  const modelValueComputed = computed({
    get() {
      return props.modelValue;
    },
    set(value) {
      emit('update:modelValue', value);
    },
  });

  interface Option {
    label: string;
    value: string;
    children?: Option[];
  }

  provide('tree', props.tree);

  /**
   *  添加选项
   */
  function handleAdd() {
    const option: Option = {
      label: '',
      value: '',
    };
    modelValueComputed.value?.push(option);
  }
</script>
