/*
 * @Author: zxc ff5fly@163.com
 * @Date: 2023-12-05 17:06:52
 * @LastEditors: zxc ff5fly@163.com
 * @LastEditTime: 2024-01-25 14:26:44
 * @FilePath: \yst-province-hebei-web\src\utils\perry.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function downloadFn(ossUrl) {
    window.open(`${import.meta.env.VITE_IMAGEPREVIEW_PREFIX}${ossUrl}`);
}

/**
 * 匹配颜色
 * 
*/
export const setColor = (key, val) => {
    const obj = {
        "activateStatus": {//数据采集
            "1": "#FC8F0F",
            "2": "#4476F7",
            "3": "#A3A3A3"
        },
        "checkStatus": {//核验
            "0": "#0CAD2F",
            "1": "#FF5D5D",
        },
        "projectSendStatus": {//状态 | 采集状态
            "0": "#FF5D5D",
            "1": "#4476F7",
        }
    }
    return obj[key][val]
}


//判断数组对象是否存在为空的value值
export const checkObjectArray = (arr) => {
    alert(1)
    for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                console.log('deadlineType', obj['deadlineType'])
                if (obj['deadlineType'] == 1 && obj['requireEndTime'] == '') {
                    return `错误：对象${i}的${key}属性值为空字符串`;
                } else if (obj['deadlineType'] == 0 && obj['requireEndTime'] == '') {
                    return true
                }

                else {
                    alert(3)
                    if (typeof value === 'string' && value === '') {
                        alert(31)
                        return `错误：对象${i}的${key}属性值为空字符串`;
                    } else if (Array.isArray(value) && value.length === 0) {
                        alert(32)
                        return `错误：对象${i}的${key}属性值为空数组`;
                    } else if (value === undefined) {
                        alert(33)
                        return `错误：对象${i}的${key}属性值为undefined`;
                    }
                }

            }
        }
    }
    return true
}