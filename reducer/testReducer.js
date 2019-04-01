// 这是一个颜色更改测试reducer，具体如何创建其他reducer请根据具体业务实现

export default function testReducer(state={color: 'pink'},action) {
    // 判断当前dispatch的类型，如果是CHANGE_COLOR则改变颜色
    switch(action.type){
        case 'CHANGE_COLOR':
            return {
                ...state,
                color:action.color  //改变state中的color属性颜色为action.color的值
            }
        default:
        return state;
    }
}