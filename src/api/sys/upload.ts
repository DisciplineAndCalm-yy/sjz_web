/*
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-07-06 14:22:14
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2023-07-13 17:24:07
 * @FilePath: \yst-city-xixian-enterpriseServiceSystem-web\src\api\sys\upload.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { UploadApiResult } from './model/uploadModel';
import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';

const { apiUrl = '' } = useGlobSetting();

/**
 * @description: Upload interface
 */
export function uploadApi(params: UploadFileParams, onUploadProgress: (progressEvent: ProgressEvent) => void) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: apiUrl,
      onUploadProgress,
    },
    params
  );
}
/**
 * @description: Upload interface
 */
export function uploadImg(params: UploadFileParams, onUploadProgress: (progressEvent: ProgressEvent) => void) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: `${apiUrl}/sys/common/upload`,
      onUploadProgress,
    },
    params,
    { isReturnResponse: true }
  );
}
