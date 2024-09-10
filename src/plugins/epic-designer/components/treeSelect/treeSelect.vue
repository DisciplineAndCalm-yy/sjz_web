<script setup lang="ts">
  import { ref } from 'vue';

  const props = defineProps({
    record: {
      type: Object,
      require: true,
      default: () => ({}),
    },
  });

  // const treeData = ref([
  //   {
  //     label: 'parent 1',
  //     value: 'parent 1',
  //     children: [
  //       {
  //         label: 'parent 1-0',
  //         value: 'parent 1-0',
  //         children: [
  //           {
  //             label: 'my leaf',
  //             value: 'leaf1',
  //           },
  //           {
  //             label: 'your leaf',
  //             value: 'leaf2',
  //           },
  //         ],
  //       },
  //       {
  //         label: 'parent 1-1',
  //         value: 'parent 1-1',
  //       },
  //     ],
  //   },
  // ]);
</script>

<template>
  {{ props }}
  <a-tree-select
    show-search
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="props?.record?.componentProps?.treeData || []"
    tree-node-filter-prop="label"
  />
</template>

<style scoped lang="less"></style>
