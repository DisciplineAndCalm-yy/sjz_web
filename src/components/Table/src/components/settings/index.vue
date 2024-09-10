<!--
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-07-06 14:22:14
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-07-13 16:21:18
 * @FilePath: \yst-city-xixian-enterpriseServiceSystem-web\src\components\Table\src\components\settings\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="table-settings">
    <RedoSetting v-if="getSetting.redo" :isMobile="isMobile" :getPopupContainer="getTableContainer" />
    <SizeSetting v-if="getSetting.size" :isMobile="isMobile" :getPopupContainer="getTableContainer" />
    <ColumnSetting v-if="getSetting.setting" :isMobile="isMobile" @columns-change="handleColumnChange" :getPopupContainer="getTableContainer" />
    <FullScreenSetting v-if="getSetting.fullScreen" :isMobile="isMobile" :getPopupContainer="getTableContainer" />
  </div>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import type { TableSetting, ColumnChangeParam } from '../../types/table';
  import { defineComponent, computed, unref } from 'vue';
  import ColumnSetting from './ColumnSetting.vue';
  import SizeSetting from './SizeSetting.vue';
  import RedoSetting from './RedoSetting.vue';
  import FullScreenSetting from './FullScreenSetting.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTableContext } from '../../hooks/useTableContext';

  export default defineComponent({
    name: 'TableSetting',
    components: {
      ColumnSetting,
      SizeSetting,
      RedoSetting,
      FullScreenSetting,
    },
    props: {
      setting: {
        type: Object as PropType<TableSetting>,
        default: () => ({}),
      },
      mode: String,
    },
    emits: ['columns-change'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const table = useTableContext();

      const getSetting = computed((): TableSetting => {
        return {
          redo: false,
          size: false,
          setting: true,
          fullScreen: false,
          ...props.setting,
        };
      });
      const isMobile = computed(() => props.mode === 'mobile');

      function handleColumnChange(data: ColumnChangeParam[]) {
        emit('columns-change', data);
      }

      function getTableContainer() {
        return table ? unref(table.wrapRef) : document.body;
      }

      return { getSetting, t, handleColumnChange, getTableContainer, isMobile };
    },
  });
</script>
<style lang="less">
  .table-settings {
    & > * {
      margin-right: 12px;
    }

    svg {
      width: 1.3em;
      height: 1.3em;
    }
  }
</style>
