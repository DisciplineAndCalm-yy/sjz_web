<template>
  <div ref="wrapRef"></div>
</template>
<script lang="ts">
  import type { Ref } from 'vue';
  import { defineComponent, ref, unref, nextTick, computed, watch, onBeforeUnmount, onDeactivated } from 'vue';
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';
  import { useLocale } from '/@/locales/useLocale';
  import { useModalContext } from '../../Modal';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { getToken } from '/@/utils/auth';
  import { getFileAccessHttpUrl } from '/@/utils/common/compUtils';
  import { useGlobSetting } from '/@/hooks/setting';

  const { apiUrl } = useGlobSetting();

  type Lang = 'zh_CN' | 'en_US' | 'ja_JP' | 'ko_KR' | undefined;

  export default defineComponent({
    inheritAttrs: false,
    props: {
      height: { type: Number, default: 360 },
      value: { type: String, default: '' },
    },
    emits: ['change', 'get', 'update:value'],
    setup(props, { attrs, emit }) {
      const wrapRef = ref<ElRef>(null);
      const vditorRef = ref(null) as Ref<Nullable<Vditor>>;
      const initedRef = ref(false);

      const modalFn = useModalContext();

      const { getLocale } = useLocale();
      const { getDarkMode } = useRootSetting();
      const valueRef = ref(props.value || '');

      watch(
        [() => getDarkMode.value, () => initedRef.value],
        ([val, inited]) => {
          if (!inited) {
            return;
          }
          const theme = val === 'dark' ? 'dark' : 'classic';
          instance.getVditor()?.setTheme(theme);
        },
        {
          immediate: true,
          flush: 'post',
        }
      );

      watch(
        () => props.value,
        (v) => {
          if (v !== valueRef.value) {
            instance.getVditor()?.setValue(v);
          }
          valueRef.value = v;
        }
      );

      const getCurrentLang = computed((): 'zh_CN' | 'en_US' | 'ja_JP' | 'ko_KR' => {
        let lang: Lang;
        switch (unref(getLocale)) {
          case 'en':
            lang = 'en_US';
            break;
          case 'ja':
            lang = 'ja_JP';
            break;
          case 'ko':
            lang = 'ko_KR';
            break;
          default:
            lang = 'zh_CN';
        }
        return lang;
      });
      //update-begin-author:taoyan date:2022-5-24 for: VUEN-1090 markdown 无法上传
      const uploadUrl = `${apiUrl}/sys/common/upload`;
      const token = getToken();
      function formatResult(files, responseText): string {
        let data: any = JSON.parse(responseText);
        // {"success":true,"message":"markdown/aa_1653391146501.png","code":0,"result":null,"timestamp":1653391146501}'
        let filename = files[0].name as string;
        let result = {
          msg: '',
          code: 0,
          data: {
            errFiles: [''],
            succMap: {},
          },
        };
        if (data.success) {
          result.data.errFiles = [];
          result.data.succMap = {
            [data.message]: getFileAccessHttpUrl(data.message),
          };
        } else {
          result.code = 1;
          result.msg = data.message;
          result.data.errFiles = [filename];
        }
        return JSON.stringify(result);
      }
      //update-end-author:taoyan date:2022-5-24 for: VUEN-1090 markdown 无法上传
      function init() {
        const wrapEl = unref(wrapRef) as HTMLElement;
        if (!wrapEl) return;
        const bindValue = { ...attrs, ...props };
        const insEditor = new Vditor(wrapEl, {
          theme: getDarkMode.value === 'dark' ? 'dark' : 'classic',
          lang: unref(getCurrentLang),
          mode: 'sv',
          fullscreen: {
            index: 520,
          },
          preview: {
            actions: [],
          },
          //update-begin-author:taoyan date:2022-5-24 for: VUEN-1090 markdown 无法上传
          upload: {
            accept: 'image/*',
            url: uploadUrl,
            fieldName: 'file',
            extraData: { biz: 'markdown' },
            setHeaders() {
              return {
                'X-Access-Token': token as string,
              };
            },
            format(files, response) {
              return formatResult(files, response);
            },
          },
          //update-end-author:taoyan date:2022-5-24 for: VUEN-1090 markdown 无法上传
          input: (v) => {
            valueRef.value = v;
            emit('update:value', v);
            emit('change', v);
          },
          after: () => {
            nextTick(() => {
              modalFn?.redoModalHeight?.();
              insEditor.setValue(valueRef.value);
              vditorRef.value = insEditor;
              initedRef.value = true;
              emit('get', instance);
            });
          },
          blur: () => {
            //unref(vditorRef)?.setValue(props.value);
          },
          ...bindValue,
          cache: {
            enable: false,
          },
        });
      }

      const instance = {
        getVditor: (): Vditor => vditorRef.value!,
      };

      function destroy() {
        const vditorInstance = unref(vditorRef);
        if (!vditorInstance) return;
        try {
          vditorInstance?.destroy?.();
        } catch (error) {}
        vditorRef.value = null;
        initedRef.value = false;
      }

      onMountedOrActivated(init);

      onBeforeUnmount(destroy);
      onDeactivated(destroy);
      return {
        wrapRef,
        ...instance,
      };
    },
  });
</script>
