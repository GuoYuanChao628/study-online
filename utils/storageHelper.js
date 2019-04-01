// 负责操作sessionStorage的操作
const KEY = 'USER_INFO'

// 1.0 添加到sessionStorage
export function setUser(userinfo) {
    sessionStorage.setItem(KEY, JSON.stringify(userinfo || {}))
}

// 2 查询sessionStorage数据 
export function getUser(){
    var userinfoJsonString = sessionStorage.getItem(KEY)
    return JSON.parse(userinfoJsonString || '{}')
}
// 删除sessionStorage中的数据
export function removeUser(){
    sessionStorage.removeItem(KEY)
}