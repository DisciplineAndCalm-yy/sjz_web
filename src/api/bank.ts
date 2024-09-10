import { defHttp } from '/@/utils/http/axios';
enum Api {
    list = '/consul/list',
    dels = '/consul/deleteBatch',
    del = '/consul/delete',
    edit = '/consul/edit',
    withdraw = '/consul/edits',
    releasesAll = '/consul/updateIds',
    add = '/consul/add',
    update = '/consul/update',
    upload = '/consul/ImportIndicators',
    download = '/consul/DownloadTemplate'
}
export const getconsullist = (params) => {
    return defHttp.get({
        url: Api.list,
        params
    })
}

export const dels = (ids) => {
    return defHttp.get({
        url: Api.dels + '?ids=' + ids
    })
}

export const del = (id) => {
    return defHttp.get({
        url: Api.del + '?' + id
    })
}

//发布
export const edit = (params) => {
    return defHttp.post({
        url: Api.edit,
        params
    })
}

//撤回
export const withdraw = (params) => {
    return defHttp.post({
        url: Api.withdraw,
        params
    })
}

//添加
export const addList = (params) => {
    return defHttp.post({
        url: Api.add,
        params
    })
}

//编辑
export const update = (params) => {
    return defHttp.post({
        url: Api.update,
        params
    })
}

//上传
export const upload = (params) => {
    return defHttp.post({
        url: Api.upload,
        params
    })
}

//下载模板
export const download = () => {
    return defHttp.get(
        {
            url: Api.download,
            responseType: 'blob',
        },
        { isTransformResponse: false }
    ).then(data => {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', '问答库模板.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link) //下载完成移除元素
        window.URL.revokeObjectURL(url) //释放掉blob对象
    });
}

export const releasesAll = (params)=>{
    return defHttp.get({
        url: Api.releasesAll,
        params
    })
}
