<template>
  <div class="think-tank-list">
    <div class="header">
      <div class="title">{{ props.title }}</div>
      <div class="total">总数：{{ pages.total }}条</div>
      <div class="search">
        <a-input-search v-model:value="query.queryKey" placeholder="请输入搜索内容" enter-button="搜索" size="middle" @search="reLoad" />
      </div>
    </div>
    <div class="list">
      <a-row :gutter="16">
        <a-col :span="24 / props.columnSum" v-for="item in list" :key="item.id">
          <div class="item">
            <slot :data="item"></slot>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="clickload" @click="getNextList" v-if="isHasNext">点击加载更多</div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { PolicyFilter, PolicyResultItem } from '/@/views/thinkTank/Policy';
  import { Result } from '.';
  import { onMounted } from 'vue';

  export interface ListProps {
    title: string;
    api: any;
    params: Partial<PolicyFilter>;
    columnSum?: number;
  }

  const props = withDefaults(defineProps<ListProps>(), {
    title: '',
    api: '',
    params: () => ({}),
    columnSum: 2,
  });

  const query = ref<{ queryKey: string }>({
    queryKey: '',
  });

  // 列表数据
  const pages = ref({
    total: 0,
    pageNo: 1,
  });
  const isHasNext = ref(true);
  const list = ref<PolicyResultItem[]>([]);

  // 加载数据
  const onLoad = () => {
    // nextTick 确保拿到正确的 params
    nextTick(() => {
      props
        .api({
          ...props.params,
          ...query.value,
          pageNo: pages.value.pageNo,
        })
        .then((res) => {
          const { records, pages: current, total } = res as Result<PolicyResultItem>;

          if (Number(current) === 1) {
            list.value = [];
          }
          pages.value.total = total;
          pages.value.pageNo = Number(current);
          list.value.push(...records);

          isHasNext.value = records.length >= 10;

          if (moreEle) observer.observe(moreEle);
        });
    });
  };

  // 重置第一页，加载数据
  const reLoad = () => {
    pages.value.total = 0;
    pages.value.pageNo = 1;
    isHasNext.value = true;
    window.scrollTo({ top: 0 });
    onLoad();
  };

  // 加载下一页
  const getNextList = () => {
    if (isHasNext.value) {
      pages.value.pageNo += 1;

      onLoad();
    }
  };

  // 监听元素进入视口，下载下一页使用
  let moreEle: HTMLDivElement | null = null;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log('目标元素进入视口！');
        // 执行相应的操作
        getNextList();
      }
    });
  });

  onMounted(() => {
    moreEle = document.querySelector('.clickload');
    onLoad();
  });

  defineExpose({
    reLoad,
    onLoad,
    getNextList,
  });
</script>

<style lang="less" scoped>
  .think-tank-list {
    .header {
      display: flex;
      align-items: center;
      padding: 12px;
      background: #fff;
      margin-bottom: 10px;
      .title {
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 700;
        color: #333;
        padding-left: 13px;
        line-height: 1em;
        border-left: 6px solid #2386fe;
      }
      .total {
        flex: 1;
        margin-left: 10px;
        font-size: 16px;
        margin-left: 10px;
        font-weight: 500;
      }
      .search {
      }
    }

    .list {
      .item {
        margin-bottom: 16px;
      }
    }

    .clickload {
      padding: 10px;
      text-align: center;
      cursor: pointer;
    }
  }
</style>
