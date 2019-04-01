
const baseUrl = 'http://157.122.54.189:9092'
function fetchHelper(url, options){
    return fetch(baseUrl + url, options)
}
fetchHelper.get = async (url) => {
    return fetch(baseUrl+url, {
        method: 'GET',
        credentials: 'include'  //允许跨域携带cookies
    }).then(res => {
        if (res.status === 200){
            return res.json()
        } else {
            throw new Error('get请求异常')
        }
    }).catch(error => {
        console.log('请求失败')
    })
}
fetchHelper.post = async (url, body) => {
    return fetch(baseUrl+url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type' : 'application/json;charset=UTF-8'
        },
        credentials: 'include', //允许跨域携带cookies
    }).then(res => {
        if (res.status === 200){
            return res.json()
        } else {
            throw new Error('post请求异常')
        }
    }).catch(error => {
        console.log('请求失败')
    })
}
export default fetchHelper