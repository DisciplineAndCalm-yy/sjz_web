import { defHttp } from '/@/utils/http/axios';

export const getDict = (params) => defHttp.get({ url: `/sys/dict/getDictItems/${params.dictCode}` });
