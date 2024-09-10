/*
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-12-28 16:27:46
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-04-01 10:26:24
 * @FilePath: \yst-city-shijiazhuang-web\src\enums\pageEnum.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export enum PageEnum {
  // basic login path
  BASE_LOGIN = '/login',
  // basic home path
  BASE_HOME = '/businessScreen',
  // error page path
  ERROR_PAGE = '/exception',
  // error log page path
  ERROR_LOG_PAGE = '/error-log/list',
  // auth2登录路由路径
  OAUTH2_LOGIN_PAGE_PATH = '/oauth2-app/login',
  //文件路由
  SYS_FILES_PATH = '/file/share',
}
