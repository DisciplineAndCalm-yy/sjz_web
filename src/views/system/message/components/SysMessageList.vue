<template>
  <div class="message-list" :class="[ mode === 'white' ? 'white-message-theme' : 'dark-message-theme' ]">
    <div class="message-item" v-for="message of messageList">
      <img src="../../../../assets/images/messages/read.png" />
      <div class="content">
        <div class="msg">{{ message.msgContent }}</div>
        <div class="time">{{ message.sendTime }}</div>
      </div>
    </div>
    <template v-if="!messageList.length">
      <a-empty  />
    </template>
    <template v-else>
      <div  class="message-more" v-if="messageList && messageList.length > 0 && !loadEndStatus && !loadingMoreStatus"
        :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
        <span @click="onLoadMore">加载更多</span>
      </div>
      <div  class="message-nomore" v-else
        :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
        <span>已经到底了</span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { inject, onMounted, onUnmounted, ref } from 'vue';
import { FilterOutlined, CloseOutlined, BellFilled, ExclamationOutlined, MailOutlined, InteractionOutlined, AlertOutlined } from '@ant-design/icons-vue';
import { useSysMessage, useMessageHref } from './useSysMessage';
import { useRouter } from 'vue-router';
import { editCementSend } from '/@/views/monitor/mynews/mynews.api'


export default {
  name: 'SysMessageList',
  components: {
    FilterOutlined,
    CloseOutlined,
    BellFilled,
    ExclamationOutlined,
    MailOutlined,
    InteractionOutlined,
    AlertOutlined
  },
  props: {
    mode: {
      type: String,
      default: 'white'
    },
    star: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'detail'],
  setup(props, { emit }) {
    const { messageList, loadEndStatus, loadingMoreStatus, onLoadMore, noRead, getMsgCategory, searchParams, reset, loadData, updateStarMessage } = useSysMessage();

    //使用inject
    const toUseProvideFn = inject('provideObj')

    function reload(params) {
      let { fromUser, rangeDateKey, rangeDate } = params;
      searchParams.fromUser = fromUser || '';
      searchParams.rangeDateKey = rangeDateKey || '';
      searchParams.rangeDate = rangeDate || [];
      if (props.star === true) {
        searchParams.starFlag = '1'
      } else {
        searchParams.starFlag = ''
      }
      reset();
      loadData();
    }

    function clickStar(item) {
      console.log(item)
      updateStarMessage(item);
      if (item.starFlag == '1') {
        item.starFlag = '0'
      } else {
        item.starFlag = '1'
      }
    }

    const { goPage } = useMessageHref(emit);

    function showMessageDetail(record) {
      record.readFlag = '1'
      goPage(record);
      emit('close', record.id)
    }

    const router = useRouter();
    const tonextPage = (serverType) => {
      toUseProvideFn.closeFn()
        if (serverType == 'ent') {
          router.push('/enterprise/unbindApplyList')
        } else {
          router.push('/policyRelease/add')
        }
    }

    // 监听元素进入视口，下载下一页使用
    let moreEle = ref<HTMLDivElement | null>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('目标元素进入视口！');
          // 执行相应的操作
          onLoadMore();
        }
      });
    });

    onMounted(() => {
      // 开启查看更多监听
      setTimeout(() => {
        moreEle.value = document.querySelector('.message-more') as HTMLDivElement;
        if (moreEle.value) observer.observe(moreEle.value)
      }, 1000)
    })

    onUnmounted(() => {
      // 销毁监听事件
      if (moreEle.value) observer.disconnect()
    })

    const handleReadClick = (message) => {
      if (noRead(message)) {
        editCementSend({ anntId: message.anntId }).then(() => {
          message.readFlag = '1'
        }, () => {
          message.readFlag = '0'
        });
      }
    }

    // function tonextPage(){
    //   router.push('/policyRelease/add')
    // }

    return {
      messageList,
      loadEndStatus,
      loadingMoreStatus,
      onLoadMore,
      noRead,
      getMsgCategory,
      reload,
      clickStar,
      showMessageDetail,
      tonextPage,
      handleReadClick
    }
  }
};
</script>

<style scoped lang="less">
.message-list {
  height: 370px;
  overflow-y: auto;
  .message-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    margin-right: 16px;
    padding: 15px 22px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0em;
    cursor: pointer;

    img {
      position: relative;
      top: 4px;
      display: block;
      width: 23px;
      height: 27.4px;
      margin-right: 17px;
    }
    .content {
      flex: 1;
      .msg {
        overflow:hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
      }

      .time {
        text-align: right;
      }
    }
  }

  .message-item:nth-last-child(1) {
    margin-bottom: 0;
  }

  .ant-empty {
    margin-top: 60px;
  }
}

.white-message-theme {
  .message-item {
    color: #666666;

    &:hover {
      color: #333333;
    }
  }
  .message-item:nth-child(even) {
    background-color: #F8F8F8;
    color: #666666;
  }

  .message-more,
  .message-nomore {
    color: #666666;
  }

}

.dark-message-theme {
  .message-item {
    color: #ADB8F2;
  }

  .message-item:nth-child(even) {
    background-color: #4E6EDF;
    color: #ADB8F2;
  }

  .message-item:hover,
  .message-item:nth-child(even):hover {
    color: #fff;
  }
  .message-more,
  .message-nomore {
    color: #ADB8F2;
  }

}
</style>
