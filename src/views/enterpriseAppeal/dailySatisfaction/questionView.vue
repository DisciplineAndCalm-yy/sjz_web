<template>
  <div class="main">
    <a-spin tip="加载中..." :spinning="loading" style="width: 100%; height: 100%">
      <div class="form_baseInfo">
        <div class="baseInfo_item">
          <span>满意度问卷名称：</span>
          <span>{{ baseInfo.name }}</span>
        </div>
        <div class="baseInfo_item">
          <span>目标样本量：</span>
          <span>{{ baseInfo.sampleSize }}</span>
        </div>
      </div>
      <div class="formItem_box">
        <div class="formItem" v-for="(element, key) in formItemList" :key="key">
          <div class="formItem_title">
            <span v-if="element.required" class="dot">*</span>
            {{ element.label }}
          </div>
          <div class="formItem_component">
            <template v-if="element.type === 'INPUT'">
              <a-textarea v-if="element.scheme.config.textarea" :placeholder="element.placeholder" style="width: 100%" :rows="1" />
              <a-input v-else :placeholder="element.placeholder" style="width: 100%" />
            </template>
            <a-select v-if="element.type === 'SELECT'" :placeholder="element.placeholder" style="width: 100%">
              <a-select-option v-for="(item, key) in element.scheme.config.options" :key="key" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
            <a-rate v-if="element.type === 'RATE'" :value="2" />
            <a-input-number v-if="element.type === 'NUMBER'" :placeholder="element.placeholder" style="width: 100%" />
            <a-radio-group v-if="element.type === 'RADIO'" :value="null">
              <a-radio v-for="(item, key) in element.scheme.config.options" :key="key">
                {{ item.label }}
              </a-radio>
            </a-radio-group>
            <a-checkbox-group v-if="element.type === 'CHECKBOX'" :value="null" :options="element.scheme.config.options" />
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref, Ref, onMounted } from 'vue';
  import { question_getByKey, question_getItemList } from '/@/api/enterpriseAppeal/index';

  const props = defineProps<{
    formKey: string;
  }>();
  const loading = ref(false);
  const baseInfo = ref({
    formKey: '',
    name: null,
    sampleSize: null,
  });
  const formItemList: Ref<Record<string, any>[]> = ref([]);

  onMounted(async () => {
    try {
      loading.value = true;
      const res_baseInfo = await question_getByKey({ key: props.formKey });
      baseInfo.value = {
        formKey: res_baseInfo.formKey,
        name: res_baseInfo.name,
        sampleSize: res_baseInfo.sampleSize,
      };
      const res_formItemList = await question_getItemList({ key: props.formKey });
      res_formItemList && res_formItemList.length && (formItemList.value = res_formItemList);
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  });
</script>

<style lang="less" scoped>
  .main {
    padding: 26px;
    max-height: 500px;
    overflow-y: auto;
    .form_baseInfo {
      width: 100%;
      margin-bottom: 20px;
      .baseInfo_item {
        width: 50%;
        display: inline-block;
      }
    }
    .formItem_box {
      .formItem {
        margin-bottom: 20px;
        .formItem_title {
          .dot {
            color: red;
            margin-right: 5px;
          }
        }
      }
    }
  }
</style>
