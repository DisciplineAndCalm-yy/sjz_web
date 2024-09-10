<template>
  <div class="entrance">
    <div class="header">
      <div class="title">营商环境监测督导系统</div>
    </div>
    <div class="back" @click="handleLogoutClick">
      <img src="../../assets/images/entrance/entrance_loginout_icon.png" alt="">
      退出
    </div>
    <div class="notice" v-if="noticeInfo.msgTxt">
      <div class="icon">
        <AlertOutlined />
      </div>
      <div class="content" @click="handleMsgClick">
        {{ noticeInfo.msgTxt }}
      </div>
      <div class="more" @click="handleMsgClick">更多</div>
    </div>
    <div class="entrance-list">
      <div v-for="(entrance, index) in getMenus" :key="index" @click="() => handleRouteChange(entrance)">
        <div class="entrance-box">
          <img class="logo" :src="entrance.icon" />
          <div class="desc">
            <div class="sign"></div>
            <div class="title">{{ entrance.title }}</div>
          </div>
        </div>
        <div class="entrance-box reverse-box">
          <div class="desc">
            <div class="title">{{ entrance.title }}</div>
            <div class="sign"></div>
          </div>
        </div>
      </div>
    </div>
    <sys-message-modal mode="dark" @register="registerMessageModal"></sys-message-modal>
  </div>
</template>

<script lang="ts" setup>
  import { unref, computed, ref, watchEffect } from 'vue';
  import { LogoutOutlined, AlertOutlined } from '@ant-design/icons-vue';
  import { MenuSplitTyeEnum } from '/@/enums/menuEnum';
  import { useUserStore } from '/@/store/modules/user';
  import { useSplitMenu } from '/@/layouts/default/menu/useLayoutMenu';
  import { NoticeInfo, menuIconInsinuate } from './data';
  import SysMessageModal from '/@/views/system/message/components/SysMessageModal.vue'
  import { useModal } from '/@/components/Modal'
import { useGlobSetting } from '/@/hooks/setting'
import { useSysMessage } from '../system/message/components/useSysMessage'
import { getToken } from '/@/utils/auth'
import { connectWebSocket, onWebSocket } from '/@/hooks/web/useWebSocket'
import md5 from 'crypto-js/md5'

  const splitRef = ref(MenuSplitTyeEnum.TOP);
  const { menusRef } = useSplitMenu(splitRef);
  const userStore = useUserStore();

  const noticeInfo = ref<NoticeInfo>({
    cmd: '',
    msgId: '',
    msgTxt: '',
    type: '',
    userId: '',
  });

  const glob = useGlobSetting();

  // 历史未读消息
  const { messageList, loadData } = useSysMessage();
  let stop;
  stop = watchEffect(() => {
    const noReadMessageList = messageList.value.filter((i) => i.readFlag === '0');
    if (noReadMessageList.length) {
      const { msgContent, cmd, msgId, type, userId } = noReadMessageList[0];
      noticeInfo.value = {
        cmd,
        msgId,
        msgTxt: msgContent,
        type,
        userId,
      };
    }
    stop && stop();
  });

  loadData();

  // websocket 接口消息推送
  const initWebSocket = () => {
    let token = getToken();
    let wsClientId = md5(token);
    let userId = unref(userStore.getUserInfo).id + '_' + wsClientId;
    let url = location.protocol.replace('http', 'ws') + '//' + location.host + glob.domainUrl + '/websocket/' + userId;
    connectWebSocket(url);
    onWebSocket(onWebSocketMessage);
  };
  const onWebSocketMessage = (data) => {
    if (data.cmd === 'topic' || data.cmd === 'user') {
      noticeInfo.value = data;
    }
  };
  initWebSocket();

  const [registerMessageModal, { openModal: openMessageModal }] = useModal();

  const getMenus = computed(() => {
    const menus = unref(menusRef);

    const getShowMenus = menus.filter((i) => !['首页', '消息中心'].includes(i.name) || i.hideMenu);

    return [
      ...getShowMenus.map((i) => {
        return {
          title: i.name,
          path: i.path,
          redirect: i.redirect,
          ...(menuIconInsinuate[i.path.slice(1)] || menuIconInsinuate['knowledge/']),
        };
      }),
    ];
  });

  const handleLogoutClick = () => {
    userStore.confirmLoginOut();
  };

  const handleRouteChange = (entrance) => {
    console.log('entrance', entrance)
    if (entrance.path.includes('/knowledge/')) {
      window.open('/knowledge'+ (entrance.redirect || entrance.path))
    } else {
      window.open(entrance.redirect || entrance.path)
    }
  };


  const handleMsgClick = () => {
    noticeInfo.value = {
      cmd: '',
      msgId: '',
      msgTxt: '',
      type: '',
      userId: '',
    };
    openMessageModal(true, {})
    // handleRouteChange('monitor/mynews');
  };
</script>

<style lang="less" scoped>
  .entrance {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 111px;
    background-image: url(/resource/img/jeecg_bg_2.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    .header {
      color: #FFFEFE;
      text-align: center;
      .title {
        margin-bottom: 34px;
        height: 42px;
        font-size: 32px;
        font-weight: bold;
        background: linear-gradient(180deg, #fff, #5ab7ff);
        -webkit-background-clip: text; /* 背景裁剪到文字 */
        --moz-background-clip: text; /* 背景裁剪到文字 */
        background-clip: text;
        color: transparent; /* 设置文字颜色为透明 */
      }

      .desc {
        height: 13px;
        font-size: 17px;
        font-weight: 400;
      }
    }

    .exit {
      position: absolute;
      right: 30px;
      top: 30px;
      font-size: 14px;
      color: #fff;
      cursor: pointer;
    }

    .notice {
      position: absolute;
      top: 46px;
      left: 129px;
      right: 129px;
      display: flex;
      padding: 14px 50px;
      background: #3563ff;
      color: #82b1ff;
      border-radius: 10px;
      border: 1px solid #849fff;
      .icon {
        margin-right: 10px;
      }

      .content {
        flex: 1;
        cursor: pointer;
      }
      .more {
        color: #ffce20;
        cursor: pointer;
      }
    }

    .entrance-list {
      flex: 1;
      width: 100%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0;
      box-sizing: border-box;
      position: relative;

      .entrance-box {
        display: block;
        text-align: center;
        width: 12.8rem;
        height: 20.8rem;
        transition: 0.8s;
        border-radius: 4px;
        background: url(/@/assets/images/entrance/entrance_app_bg.png) no-repeat;
        background-size: 100% 100%;
        position: relative;
        cursor: pointer;

        .logo {
          width: 60%;
          position: absolute;
          left: 0;
          top: 11%;
          right: 0;
          margin: auto;
        }

        .desc {
          position: absolute;
          width: 100%;
          bottom: 0;
          display: flex;
          justify-content: center;
          flex-direction: column-reverse;
          .title {
            font-size: 18px;
            font-weight: bold;
            color: #FFFEFE;
            text-shadow: 0px 1px 1px rgba(18,77,171,0.63);
          }
          .sign {
            margin: 21px auto 40px;
            width: 32px;
            height: 2px;
            background: #FFFFFF;
          }
        }

        .reverse {
          transform: scale(180deg);
        }

        &:hover {
          background: url(/@/assets/images/entrance/entrance_app_bg_hover.png) no-repeat;
          background-size: 100% 100%;
          transform: translateY(-10%);

          & + .reverse-box {
            opacity: 0.6;
            transform: translateY(-20%) rotateY(180deg) rotate(180deg);
          }
        }
      }

      .reverse-box {
        opacity: 0.4;
        height: 10.4rem;
        margin-top: 10px;
        transform:  rotateY(180deg) rotate(180deg);
        background: url(/@/assets/images/entrance/entrance_app_reverse_bg.png) no-repeat;
        background-size: 100% 100%;

        .desc {
          flex-direction: column;
        }

        &:hover {
          opacity: 0.4;
          height: 10.4rem;
          margin-top: 10px;
          transform:  rotateY(180deg) rotate(180deg);
          background: url(/@/assets/images/entrance/entrance_app_reverse_bg.png) no-repeat;
          background-size: 100% 100%;
        }
      }
    }

    .back {
      position: absolute;
      right: 30px;
      top: 30px;
      display: flex;
      align-items: center;
      height: 15px;
      font-size: 16px;
      font-weight: 400;
      color: #FFFEFE;
      cursor: pointer;
      img {
        display: block;
        width: 19px;
        height: 19px;
        margin-right: 9px;
      }
    }
  }
</style>
