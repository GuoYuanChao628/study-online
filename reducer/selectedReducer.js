// 这是一个颜色更改测试reducer，具体如何创建其他reducer请根据具体业务实现

export default function selectedReducer(state=[
    {
        "goods_id": 0,
        "img_url": "",
        "sell_price": 0,
        "shop_car_id": 0,
        "timeout": 0,
        "title": ""
    }
],action) {
    // 判断当前dispatch的类型，如果是CHANGE_COLOR则改变颜色
    switch(action.type){
        case 'SELECTED_COURSE':
            return {
                state:action.courses  //改变state中的color属性颜色为action.color的值
            }
        default:
        return state;
    }
}