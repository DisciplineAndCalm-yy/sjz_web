/*
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-04-17 14:29:22
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-03-18 10:55:08
 * @FilePath: \yst-city-qixian-PolicyRecommendationSystem-web\src\router\routes\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';

import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';

const modules = import.meta.glob('./modules/**/*.ts', { eager: true });

const routeModuleList: AppRouteModule[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = (modules as Recordable)[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  //新版后台登录，如果想要使用旧版登录放开即可
  // component: () => import('/@/views/sys/login/Login.vue'),
  component: () => import('/@/views/system/loginmini/MiniLogin.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};

//入口页面路由-perry加
export const EntranceRoute: AppRouteRecordRaw = {
  path: '/entrance',
  name: 'entrance',
  component: () => import('/@/views/entrance/index.vue'),
  meta: {
    title: t('routes.basic.entrance'),
    hideTab: true,
  },
};

//大屏页面路由
export const BusinessScreenRoute: AppRouteRecordRaw = {
  path: '/businessScreen',
  name: 'businessScreen',
  component: () => import('/@/views/businessScreen/index.vue'),
  meta: {
    title: '营商洞察可视呈现',
    hideTab: true,
  },
};

//大屏营商任务督办页面
export const BusinessScreen2Route: AppRouteRecordRaw = {
  path: '/businessScreen/index2',
  name: 'businessScreenIndex2',
  component: () => import('/@/views/businessScreen/index2.vue'),
  meta: {
    title: '营商任务督办',
    hideTab: true,
  },
};

// 临时添加政策智库路由
export const PolicyThinkTanksRoute: AppRouteRecordRaw = {
  path: '/thinkTank/policy',
  name: 'thinkTankPolicy',
  component: () => import('/@/views/thinkTank/Policy/index.vue'),
  meta: {
    title: '政策智库',
    hideTab: true,
  },
};
// 临时添加标杆智库路由
export const BenchmarkThinkTanksRoute: AppRouteRecordRaw = {
  path: '/thinkTank/benchmark',
  name: 'thinkTankBenchmark',
  component: () => import('/@/views/thinkTank/benchmark/index.vue'),
  meta: {
    title: '标杆智库',
    hideTab: true,
  },
};

// 临时添加标杆智库路由
export const EpicRoute: AppRouteRecordRaw = {
  path: '/epic',
  name: 'epic',
  component: () => import('../../views/demo/epic/epic.vue'),
  meta: {
    title: 'epic',
    hideTab: true,
  },
};
export const EpicGeneratorRoute: AppRouteRecordRaw = {
  path: '/epicGenerator',
  name: 'epicGenerator',
  component: () => import('../../views/demo/epicGenerator/epic.vue'),
  meta: {
    title: 'epic',
    hideTab: true,
  },
};

//update-begin---author:wangshuai ---date:20220629  for：auth2登录页面路由------------
export const Oauth2LoginRoute: AppRouteRecordRaw = {
  path: '/oauth2-app/login',
  name: 'oauth2-app-login',
  //新版钉钉免登录，如果想要使用旧版放开即可
  // component: () => import('/@/views/sys/login/OAuth2Login.vue'),
  component: () => import('/@/views/system/loginmini/OAuth2Login.vue'),
  meta: {
    title: t('routes.oauth2.login'),
  },
};
//update-end---author:wangshuai ---date:20220629  for：auth2登录页面路由------------

/**
 * 【通过token直接静默登录】流程办理登录页面 中转跳转
 */
export const TokenLoginRoute: AppRouteRecordRaw = {
  path: '/tokenLogin',
  name: 'TokenLoginRoute',
  component: () => import('/@/views/sys/login/TokenLoginPage.vue'),
  meta: {
    title: '带token登录页面',
    ignoreAuth: true,
  },
};

// Basic routing without permission
export const basicRoutes = [
  LoginRoute,
  EntranceRoute,
  PolicyThinkTanksRoute,
  BenchmarkThinkTanksRoute,
  EpicRoute,
  EpicGeneratorRoute,
  RootRoute,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
  TokenLoginRoute,
  Oauth2LoginRoute,
  BusinessScreenRoute,
  BusinessScreen2Route,
];
