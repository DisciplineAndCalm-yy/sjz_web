<template>
  <div class="notice">
    <FormItem ref="form" v-bind="attrs" label="催办通知">
      <Switch v-model:checked="formState.switchFlag" :checked-value="SwitchEnum.OPEN" :un-checked-value="SwitchEnum.CLOSE" />
    </FormItem>
    <FormItem ref="form" v-bind="attrs" label="设置通知时间">
      <div class="time">
        <Select v-model:value="formState.daysType" placeholder="Please select favourite colors">
          <SelectOption v-for="item in getOptions.noticeTimeOptions" :key="item.value" :value="item.value">{{ item.label }}</SelectOption>
        </Select>
        <template v-if="formState.daysType === '2'">
          <InputNumber v-model:value="formState.daysNum" />
          天
        </template>
      </div>
    </FormItem>
    <FormItem ref="form" v-bind="attrs" label="设置通知周期">
      <div class="cycle">
        <Select v-model:value="formState.weekType" placeholder="Please select favourite colors">
          <SelectOption v-for="item in getOptions.noticeCycleOptions" :key="item.value" :value="item.value">{{ item.label }}</SelectOption>
        </Select>
        <template v-if="formState.daysType === '2'">
          <TimePicker v-model:value="formState.weekTime" format="HH:mm:ss" value-format="HH:mm:ss" />
        </template>
      </div>
    </FormItem>
  </div>
</template>
<script lang="ts" setup>
  import { ref, useAttrs, watch, onMounted, computed } from 'vue';
  import { FormItem, Switch, Select, SelectOption, InputNumber, TimePicker } from 'ant-design-vue';
  import { DeadlineTypeEnum } from '/@/views/taskTemplateConfig/designerConfig';
  import { SwitchEnum } from '../../enums/component'

  const props = defineProps({
    modelValue: {
      type: Object,
      require: true,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const getOptions = computed(() => {
    if (attrs.record.componentProps.completionDeadline === DeadlineTypeEnum.DATE_SELECT) {
      return {
        noticeTimeOptions: attrs.record.componentProps.noticeTimeOptions,
        noticeCycleOptions: attrs.record.componentProps.noticeCycleOptions,
      };
    } else {
      return {
        noticeTimeOptions: attrs.record.componentProps.noticeTimeOptions.filter((i) => i.value === '1'),
        noticeCycleOptions: attrs.record.componentProps.noticeCycleOptions.filter((i) => i.value === '1'),
      };
    }
  });

  const attrs = useAttrs() as any;

  const formState = ref({
    switchFlag: SwitchEnum.OPEN,
    daysType: '1',
    daysNum: 3,
    weekType: '1',
    weekTime: '00:00:00',
  });

  onMounted(() => {
    emit('update:modelValue', formState.value);
  });

  watch(
    () => formState.value,
    (val) => {
      const data = {
        ...val
      }
      if (data.daysType === '1') {
        data.daysNum = 0
        data.weekTime = '00:00:00'
      }
      emit('update:modelValue', data);
    },
    {
      deep: true,
    }
  );

  watch(
    () => attrs.record.componentProps.completionDeadline,
    (val) => {
      if (val === '0') {
        formState.value.daysType = '1'
        formState.value.weekType = '1'
      }
    }
  );

  const shallowCompare = (obj1, obj2) => {
    if (obj1 === obj2) {
      return true;
    }

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let i = 0; i < keys1.length; i++) {
      const key = keys1[i];
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  let first = true
  watch(
    () => props.modelValue,
    (val) => {
      if (
        first
        && Object.keys(val).length
        && !shallowCompare(val, formState.value)
      ) {
        formState.value = val
        first = false
      }
    },
    {
      deep: true,
      immediate: true
    }
  );

  const form = ref<any>(null);
</script>

<style>
  .cycle,
  .time {
    display: flex;
    align-items: center;
  }
</style>
