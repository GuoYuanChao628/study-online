// 这是一个颜色更改测试reducer，具体如何创建其他reducer请根据具体业务实现

export default function getShopcarCount(state={count: 0},action) {
    // 判断当前dispatch的类型，如果是CHANGE_COLOR则改变颜色
    switch(action.type){
        case 'CHANGE_SHOPCART_COUNT':
            return {
                ...state,
                count:action.count  //改变state中的color属性颜色为action.color的值
            }
        default:
        return state;
    }
}