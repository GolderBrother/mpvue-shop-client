// 判断对象是否为空
export const isEmptyObj = obj => {
    if(JSON.stringify(obj) === "{}"){
        return true;
    }
    return false;
}