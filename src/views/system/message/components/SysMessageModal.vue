<template>
  <BasicModal :canFullscreen="false" :draggable="true" :closable="false" @register="registerModal"
  :wrapClassName="`msg-modal ${mode === 'white' ? 'white-theme' : 'dark-theme'}`"  :width="800" title="12" :footer="null" destroyOnClose>
    <div class="message-content">
      <div class="title">消息</div>
      <div class="close" @click="closeModal"><CloseOutlined /></div>
      <div class="message-list">
        <sys-message-list :mode="mode" ref="allMessageRef" @close="hrefThenClose" @detail="showDetailModal" />
      </div>
    </div>
  </BasicModal>

  <user-select-modal isRadioSelection :showButton="false" labelKey="realname" rowKey="username" @register="regModal"
    @getSelectResult="getSelectedUser"></user-select-modal>

  <DetailModal @register="registerDetail" />
</template>

<script>
import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
import { FilterOutlined, CloseOutlined, BellFilled, ExclamationOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { JSelectUser } from '/@/components/Form';
import { ref, unref, reactive, computed, provide } from 'vue';
import SysMessageList from './SysMessageList.vue'
import UserSelectModal from '/@/components/Form/src/jeecg/components/modal/UserSelectModal.vue'
import DetailModal from '/@/views/monitor/mynews/DetailModal.vue';

export default {
  name: 'SysMessageModal',
  components: {
    BasicModal,
    FilterOutlined,
    CloseOutlined,
    BellFilled,
    ExclamationOutlined,
    JSelectUser,
    SysMessageList,
    UserSelectModal,
    PlusOutlined,
    DetailModal
  },
  props: {
    mode: {
      tppe: String,
      default: 'white'
    }
  },
  emits: ['register', 'refresh'],
  setup(_p, { emit }) {
    const allMessageRef = ref();
    const starMessageRef = ref();
    const activeKey = ref('all');



    function handleChangeTab(e, key) {
      activeKey.value = key;
      loadData();
    }
    function handleChangePanel(key) {
      activeKey.value = key;
    }

    // 查询区域存储值
    const searchParams = reactive({
      fromUser: '',
      realname: '',
      rangeDateKey: '',
      rangeDate: [],
    });

    function loadData() {
      let params = {
        fromUser: searchParams.fromUser,
        rangeDateKey: searchParams.rangeDateKey,
        rangeDate: searchParams.rangeDate,
      }
      if (activeKey.value == 'all') {
        allMessageRef.value.reload(params);
      } else {
        starMessageRef.value.reload(params);
      }
    }

    //useModalInner
    const [registerModal, { closeModal }] = useModalInner(async () => {
      //每次弹窗打开 加载最新的数据
      loadData();
    });

    const showSearch = ref(false);

    function handleChangeSearchPerson(value, a) {
      console.log('选择改变', value, a);
      showSearch.value = true;
    }

    const dateTags = reactive([
      { key: 'jt', text: '今天', active: false },
      { key: 'zt', text: '昨天', active: false },
      { key: 'qt', text: '前天', active: false },
      { key: 'bz', text: '本周', active: false },
      { key: 'sz', text: '上周', active: false },
      { key: 'by', text: '本月', active: false },
      { key: 'sy', text: '上月', active: false },
      { key: 'zdy', text: '自定义', active: false },
    ]);
    function handleClickDateTag(item) {
      for (let a of dateTags) {
        if (a.key != item.key) {
          a.active = false;
        }
      }
      item.active = !item.active;
      if (item.active == false) {
        searchParams.rangeDateKey = ''
      } else {
        searchParams.rangeDateKey = item.key;
      }
      if (item.key == 'zdy') {
        // 自定义日期查询走的是 handleChangeSearchDate
        if (item.active == false) {
          searchParams.rangeDate = []
          loadData();
        }
      } else {
        loadData();
      }
    }
    const showRangeDate = computed(() => {
      let temp = dateTags.filter((i) => i.active == true);
      if (temp && temp.length > 0) {
        if (temp[0].text == '自定义') {
          return true;
        }
      }
      return false;
    });
    const searchRangeDate = ref([]);
    function handleChangeSearchDate(_value, dateStringArray) {
      searchParams.rangeDate = [...dateStringArray]
      loadData();
    }

    function hrefThenClose(id) {
      emit('refresh', id)
      closeModal();
    }

    // 有查询条件值的时候显示该字符串
    const conditionStr = computed(() => {
      const { fromUser, rangeDateKey, realname } = searchParams;
      if (!fromUser && !rangeDateKey) {
        return ''
      }
      let arr = [];
      if (fromUser) {
        arr.push(realname)
      }
      if (rangeDateKey) {
        let rangDates = dateTags.filter(item => item.key == rangeDateKey);
        if (rangDates && rangDates.length > 0) {
          arr.push(rangDates[0].text)
        }
      }
      return arr.join('、')
    });

    //注册model
    const [regModal, { openModal }] = useModal();

    function getSelectedUser(options, value) {
      if (options && options.length > 0) {
        searchParams.fromUser = value
        searchParams.realname = options[0].label;
      }
    }

    function openSelectPerson() {
      openModal(true, {})
    }

    function clearSearchParamsUser() {
      searchParams.fromUser = ''
      searchParams.realname = ''
    }

    function clearAll() {
      searchParams.fromUser = '';
      searchParams.realname = '';
      searchParams.rangeDateKey = '';
      searchParams.rangeDate = [];
      for (let a of dateTags) {
        a.active = false;
      }
    }

    const [registerDetail, { openModal: openDetailModal }] = useModal();
    function showDetailModal(record) {
      console.error(123, record)
      openDetailModal(true, { record: unref(record), isUpdate: true })
    }

    //关闭弹窗,provide用
    const closeFn =()=>{
      closeModal()
    }

    provide('provideObj', {
      "closeFn": closeFn
    });

    return {
      conditionStr,
      regModal,
      getSelectedUser,
      openSelectPerson,
      clearSearchParamsUser,
      clearAll,

      registerModal,
      activeKey,
      handleChangePanel,
      handleChangeTab,

      showSearch,
      searchParams,
      handleChangeSearchPerson,
      dateTags,
      handleClickDateTag,
      showRangeDate,
      searchRangeDate,
      handleChangeSearchDate,
      closeModal,
      hrefThenClose,

      allMessageRef,
      starMessageRef,
      registerDetail,
      showDetailModal,
      closeFn
    };


  },
};
</script>

<style lang="less">
.msg-modal {
  .ant-modal-header {
    display: none;
  }
  .title {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 700;
    line-height: 22px;
    letter-spacing: 0em;
  }

  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    line-height: 22px;
    text-align: center;
    cursor: pointer;
  }

  .ant-modal-content {
    border-radius: 8px;
    overflow: hidden;

    .scroll-container {
      padding: 15px 12px 15px 23px;
    }
  }

  .scrollbar__wrap {
    margin-bottom: 0px !important;
  }

  ::-webkit-scrollbar {
    width: 5px;
  }


  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
  }
}


.white-theme {
  color: #666666;
  .close {
    background-color: #fff;
    color: #666666;
  }
  .ant-modal-content {
    background-color: #fff;
  }
  .title {
    color: #333333;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #e2e2e2;
  }

  ::-webkit-scrollbar-track {
    background-color: #fff;
  }
}

.dark-theme {
  color: #ADB8F2;
  .close {
    background-color: #B8C8FF;
    color: #fff;
  }
  .ant-modal-content {
    background-color: #3c5fd8;
    border: 1px solid #849FFF;
  }
  .title {
    color: #fff;
  }
  .ant-empty {
    color: #fff;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #8f8f8f;
  }

  ::-webkit-scrollbar-track {
    background-color: #3c5fd9;
  }
}

</style>
