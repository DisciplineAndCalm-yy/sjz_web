import { type PropType, defineComponent, h, nextTick, computed, ref, watch, inject, Ref } from 'vue';
import Upload from 'ant-design-vue/es/upload';
import message from 'ant-design-vue/es/message';
import Button from 'ant-design-vue/es/button';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { getTemporaryPath } from '/@/api/common/api'
import { getToken } from '/@/utils/auth';
import { downFile } from '/@/utils/file/download'
// const Button = loadAsyncComponent(
//   async () => (await import('ant-design-vue/lib/button')).default
// )

// 封装上传文件组件
export default defineComponent({
  props: {
    modelValue: {
      type: Array as PropType<UploadProps['fileList'] | { storageId: string; path: string }[]>,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    const fileList = ref<UploadProps['fileList']>([]);

    const forms = inject('forms', {}) as Ref<{ [name: string]: any }>;

    watch(
      fileList,
      (e) => {
        const successList = e
          ?.filter((i) => i.status === 'success')
          .map((i) => {
            const { name, uid } = i;
            return {
              storageId: uid,
              storageName: name,
            };
          });
        emit('update:modelValue', successList || []);

        // 上传完成自动校验 form-item
        if (forms.value.default) {
          setTimeout(() => {
            forms.value.default.validateFields([attrs.record.field]);
          }, 200);
        }
      },
    );
    // 处理传递进来的值
    watch(
      () => props.modelValue,
      (e) => {
        if (e != null && e.length > 0) {
          e.forEach((file) => {
            if (fileList.value?.filter((i) => i.uid === (file.uid || file.storageId)).length === 0) {
              if ('storageId' in file) {
                fileList.value?.push({
                  status: 'success',
                  uid: file.storageId,
                  name: file.storageName,
                  url: file.storageName
                });
              } else {
                fileList.value?.push(file);
              }
            }
          });
        }
      },
      { deep: true, immediate: true }
    );

    function handleUpdate(e: UploadProps['fileList']): void {
      nextTick(() => {
        fileList.value = e;
      });
    }

    // 处理数据结果
    const handleChange = (info: UploadChangeParam): void => {
      if (info.file.status === 'uploading') {
        return;
      }

      if (info.file.status === 'done') {
        const response = info.file.response;
        if (response.code === 200) {
          info.file.status = 'success';
          info.file.uid = response.result.storageId;
          info.file.url = `${import.meta.env.VITE_IMAGEPREVIEW_PREFIX}${response.result.tempPath}`
        }
      }

      if (info.file.status === 'error') {
        message.error('upload error');
      }
    };

    // 上传前处理
    const beforeUpload = (file: any) => {
      // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      // if (!isJpgOrPng) {
      //   message.error('您只能上传JPG/PNG文件!');
      // }
      if (attrs.maxSize) {
        const isLt2M = file.size / 1024 / 1024 < (attrs.maxSize as number);
        if (!isLt2M) {
          message.error(`文件大小超过 ${attrs.maxSize}MB!`);
          file.status = 'error';
        }
        return isLt2M;
      }
      // return isJpgOrPng && isLt2M;
    };

    // 预览回调
    const handlePreview = async (file) => {
      const url = await getTemporaryPath({ storageId: file.uid }) as string;
      downFile(`${import.meta.env.VITE_IMAGEPREVIEW_PREFIX}${url}`, file.name)
    }

    const getUploadProps = computed<UploadProps>(() => {
      const props = {
        'onUpdate:file-list': handleUpdate,
        'file-list': fileList.value,
        'before-upload': beforeUpload,
        onChange: handleChange,
        onPreview: handlePreview
      };

      const attribute = {
        headers: {},
        ...attrs,
      };

      attribute.headers['X-Access-Token'] = getToken();

      return {
        ...attribute,
        ...props,
      };
    });

    return () => {
      return h('div', null, {
        default: () => [
          h(Upload, getUploadProps.value, {
            default: () => [
              h(
                Button,
                {},
                {
                  default: () => [
                    h('span', {
                      class: 'iconfont epic-icon-shangchuan1',
                      style: { 'margin-right': '2px' },
                    }),
                    h('span', null, { default: () => '上传文件' }),
                  ],
                }
              ),
            ],
          }),
        ],
      });
    };
  },
});
