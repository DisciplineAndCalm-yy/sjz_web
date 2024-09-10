<template>
  <div class="composite-component" style="height: 100%">
    <slot name="edit-node">
      <slot v-for="item in children" name="node" :record="item"></slot>
    </slot>
  </div>
</template>
<script lang="ts" setup>
  import { type PropType, computed } from 'vue';

  const props = defineProps({
    record: {
      type: Object as PropType<any>,
      require: true,
      default: () => ({}),
    },
  });

  const children = computed(() => {
    return props.record!.children ?? [];
  });
</script>

<style>
  .composite-component {
    margin: 10px 0;
  }
</style>
