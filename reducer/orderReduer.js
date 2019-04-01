export default function orderReducer(state=[
    {
        "order_id": 0,
        "order_no": "",
        "amount": "",
        "remark": ""
    }
],action) {
    // 判断当前dispatch的类型，如果是CHANGE_COLOR则改变颜色
    switch(action.type){
        case 'SET_ORDER':
            return {
                state:action.orders  //改变state中的color属性颜色为action.color的值
            }
        default:
        return state;
    }
}