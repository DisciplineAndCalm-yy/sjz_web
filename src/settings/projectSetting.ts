import type { ProjectConfig } from '/#/config';
import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '/@/enums/menuEnum';
import { CacheTypeEnum } from '/@/enums/cacheEnum';
import {
  ContentEnum,
  PermissionModeEnum,
  ThemeEnum,
  RouterTransitionEnum,
  SettingButtonPositionEnum,
  SessionTimeoutProcessingEnum,
  TabsThemeEnum,
} from '/@/enums/appEnum';
import { SIDE_BAR_BG_COLOR_LIST, HEADER_PRESET_BG_COLOR_LIST } from './designSetting';
import { primaryColor } from '../../build/config/themeConfig';

// ! 改动后需要清空浏览器缓存
const setting: ProjectConfig = {
  "showSettingButton": false,
  "showDarkModeToggle": true,
  "settingButtonPosition": "auto",
  "permissionMode": "BACK",
  "permissionCacheType": 1,
  "sessionTimeoutProcessing": 0,
  "themeColor":  "#4476F7",
  "grayMode": false,
  "colorWeak": false,
  "fullContent": false,
  "contentMode": "full",
  "showLogo": true,
  "showFooter": false,
  "headerSetting": {
    "bgColor": "#ffffff",
    "fixed": true,
    "show": true,
    "theme": "light",
    "useLockPage": false,
    "showFullScreen": true,
    "showDoc": false,
    "showNotice": true,
    "showSearch": true
  },
  "menuSetting": {
    "bgColor": "#3761D1",
    "fixed": true,
    "collapsed": false,
    "collapsedShowTitle": false,
    "canDrag": false,
    "show": true,
    "hidden": false,
    "menuWidth": 250,
    "mode": "inline",
    "type": "sidebar",
    "theme": "dark",
    "topMenuAlign": "center",
    "trigger": "HEADER",
    "accordion": true,
    "closeMixSidebarOnChange": false,
    "mixSideTrigger": "click",
    "mixSideFixed": false
  },
  "multiTabsSetting": {
    "cache": false,
    "show": true,
    "canDrag": true,
    "showQuick": true,
    "showRedo": true,
    "showFold": true,
    "theme": "card"
  },
  "transitionSetting": {
    "enable": true,
    "basicTransition": "fade-slide",
    "openPageLoading": true,
    "openNProgress": true
  },
  "openKeepAlive": true,
  "lockTime": 0,
  "showBreadCrumb": false,
  "showBreadCrumbIcon": true,
  "useErrorHandle": false,
  "useOpenBackTop": true,
  "canEmbedIFramePage": true,
  "closeMessageOnSwitch": true,
  "removeAllHttpPending": false
};

export default setting;
