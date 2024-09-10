<template>
  <div class="container-padding">
    <!-- collectObj: {{ collectObj }}
    <hr>
    indicatorId: {{ indicatorId }} -->
    <!-- current: {{ current }} -->
    <div class="newContainer bg-white">
      <a-steps :current="current" class="steps">
        <a-step v-for="item in steps" :key="item.title" :title="item.title" />
      </a-steps>
      <div class="steps-content">
        <step1 v-if="current == 0" ref="step1Ref"></step1>
        <step2 v-if="current == 1 && indicatorId == ''" :id="collectObj.id" @setindicatorId="setindicatorId"></step2>
        <step3 v-if="indicatorId != ''" :id="indicatorId" :monitorType="collectObj.monitorType"></step3>
      </div>


      <div class="steps-action">
        <a-space>
          <a-button v-if="current < steps.length - 1" type="primary" @click="next">下一步</a-button>
          <a-button v-if="current == 1 && indicatorId == ''" style="margin-left: 8px" @click="prev">上一步</a-button>
          <a-button v-if="(current == 0 || current == 1) && indicatorId == ''" @click="router.push('/indicatorManagement/newCollection')">
            关闭</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, ref, onMounted, provide } from 'vue';
import { projectDetail } from '/@/api/indicatorManagement/index'
import { message } from 'ant-design-vue';
import step1 from './components/step1.vue';
import step2 from './components/step2.vue';
import step3 from './components/step3.vue';
import { useRoute, useRouter } from 'vue-router';
//   声明路由
const router = useRouter()

const current = ref<number>(0);
const collectObj = ref({}); //采集obj
const indicatorId = ref(''); //选中的二级指标id

// 使用step1中defineExpose的方法

const step1Ref = ref('step1Ref')
const next = () => {
  const fn = step1Ref.value.handleSubmit();
  fn.then(res => {
    console.log('res', res)
    collectObj.value = res
    current.value++;
  })
};

const prev = () => {
  if (indicatorId.value == '') {
    current.value--;
  } else {
    indicatorId.value = ''
  }
  nextTick(() => {
    step1Ref.value.setFields(collectObj.value)
  })

};

const steps = [
  {
    title: '配置任务参数',
    content: 'First-content',
  },
  {
    title: '配置指标参数',
    content: 'Second-content',
  },
];

//查看项目详
const getProjectDetail = (id) => {
  projectDetail({ id: id }).then(res => {
    console.log('res', res)
    collectObj.value = res;
    current.value = 1
  })
}

const setindicatorId = (id) => {
  indicatorId.value = id
}

// 声明路由信息
const route = useRoute();

onMounted(() => {
  if (route.query.id) getProjectDetail(route.query.id)
})


// 声明provide
provide('provideState', {
  setindicatorId
})


</script>
<style scoped lang="less">
.steps-content {
  width: 70%;
  margin: 0 auto;
  margin-top: 16px;
  // border: 1px dashed #e9e9e9;
  border-radius: 6px;
  // background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}

.steps-action {
  width: 150px;
  margin: 24px auto;

}

[data-theme='dark'] .steps-content {
  background-color: #2f2f2f;
  border: 1px dashed #404040;
}

.newContainer {
  width: 100%;
  overflow: hidden;

  .steps {
    width: 50%;
    margin: 20px auto;
  }
}
</style>
