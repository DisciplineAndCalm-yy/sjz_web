import type { Menu } from '/@/router/types';
import type { Ref } from 'vue';
import { watch, unref, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { MenuSplitTyeEnum } from '/@/enums/menuEnum';
import { useThrottleFn } from '@vueuse/core';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { getChildrenMenus, getCurrentParentPath, getMenus, getShallowMenus } from '/@/router/menus';
import { usePermissionStore } from '/@/store/modules/permission';
import { useAppInject } from '/@/hooks/web/useAppInject';

export function useSplitMenu(splitType: Ref<MenuSplitTyeEnum>) {
  // Menu array
  const menusRef = ref<Menu[]>([]);
  const { currentRoute } = useRouter();
  const { getIsMobile } = useAppInject();
  const permissionStore = usePermissionStore();
  const { setMenuSetting, getIsHorizontal, getSplit } = useMenuSetting();

  const throttleHandleSplitLeftMenu = useThrottleFn(handleSplitLeftMenu, 50);

  const splitNotLeft = computed(() => unref(splitType) !== MenuSplitTyeEnum.LEFT && !unref(getIsHorizontal));

  const getSplitLeft = computed(() => !unref(getSplit) || unref(splitType) !== MenuSplitTyeEnum.LEFT);

  const getSpiltTop = computed(() => unref(splitType) === MenuSplitTyeEnum.TOP);

  const normalType = computed(() => {
    return unref(splitType) === MenuSplitTyeEnum.NONE || !unref(getSplit);
  });

  watch(
    [() => unref(currentRoute).path, () => unref(splitType)],
    async ([path]: [string, MenuSplitTyeEnum]) => {
      if (unref(splitNotLeft) || unref(getIsMobile)) return;

      const { meta } = unref(currentRoute);
      const currentActiveMenu = meta.currentActiveMenu as string;
      let parentPath = await getCurrentParentPath(path);
      if (!parentPath) {
        parentPath = await getCurrentParentPath(currentActiveMenu);
      }
      parentPath && throttleHandleSplitLeftMenu(parentPath);
    },
    {
      immediate: true,
    }
  );

  // Menu changes
  watch(
    [() => permissionStore.getLastBuildMenuTime, () => permissionStore.getBackMenuList],
    () => {
      genMenus();
    },
    {
      immediate: true,
    }
  );

  // split Menu changes
  watch(
    () => getSplit.value,
    () => {
      if (unref(splitNotLeft)) return;
      genMenus();
    }
  );

  const findFirstPath = (children) => {
    for (let i = 0; i < children.length; i++) {
      const route = children[i];
      if (route.componentName === 'RouteView') {
        return findFirstPath(route.children || [])
      } else {
        return route.path
      }
    }
  }

  const setRouteRedirects = (routes) => {
    routes.forEach(route => {
      if (route.componentName === 'RouteView' && route.children) {
        const firstPath = findFirstPath(route.children);
        if (firstPath) {
          route.redirect = firstPath;
        }
      }
    });
    return routes;
  };

  // Handle left menu split
  async function handleSplitLeftMenu(parentPath: string) {
    if (unref(getSplitLeft) || unref(getIsMobile)) return;

    // spilt mode left
    const children = await getChildrenMenus(parentPath);

    if (!children || !children.length) {
      setMenuSetting({ hidden: true });
      menusRef.value = [];
      return;
    }

    setMenuSetting({ hidden: false });
    menusRef.value = setRouteRedirects(children);
  }

  // get menus
  async function genMenus() {
    // normal mode
    if (unref(normalType) || unref(getIsMobile)) {
      const menus = await getMenus()
      menusRef.value = setRouteRedirects(menus);
      return;
    }

    // split-top
    if (unref(getSpiltTop)) {
      const shallowMenus = await getShallowMenus();

      menusRef.value = shallowMenus;
      return;
    }
  }

  return { menusRef };
}
