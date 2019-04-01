// import React from 'react'
import css from './layout.less'
import { Icon, Badge, message } from 'antd'
import {connect} from 'react-redux'
import { getUser, removeUser } from '../../utils/storageHelper.js'

import Link from 'next/link'
import fetchHelper from '../../utils/fetch.js'
const mapStateToProps = (state) => {
    return {
        ...state
    }
}
class Top extends React.Component{
    // 点击退出登录
    logOut = () =>{
        // 调用退出登录的API 清除服务器的session
        fetchHelper.get('/nc/common/account/logout').then(res => {
            if(res.status == 1){
                message(res.message)
            } else {
                removeUser()
                window.location.href = '/account/login'
            }
        })
    }
    render(){
        const user = getUser()
        // console.log(user);
        return <header className={css.headtop + " w"}>
        <a href="/" className="fl"><img src="/static/img/asset-logoIco.png" alt="" /></a>
        <div className={css.left + " fl"}>
            <a className={css.a} href="/">首页</a>
            <a className={css.a} href="">课程</a>
            <a className={css.a}  href="">职业规划</a>
        </div>
        <div className={css.input + " fl"}>
            <input type="text" className="fl" placeholder="输入查询关键字" />
            <button className="fr">搜索</button>
        </div>
        <div className={css.right + " fr"}>
         <div className={css.signin}>
                {/* <!-- 未登录 -->*/}
                {
                    !user.uid ? 
                    <span><Link href="/account/login"><a>登录 </a></Link> <span> |</span> <a href="#"> 注册</a></span>
                    : <span>
                    {/* <!-- 登录 --> */}
                    {/* 购物车 */}
                    <Link href='/shopcar/shopcar'>
                        <a href="javascript:;" ><Badge count={this.props.getShopcarCount.count}><Icon type="shopping-cart" style={{fontSize: 24}} /></Badge></a>
                    </Link> 
                    <Link href={{pathname: '/mycenter/mycourse'}}>
                        <a href="#" ><Icon type="bell" theme="twoTone" />个人中心</a> 
                    </Link>
                    <a href="#" ><img src="/static/img/asset-myImg.jpg" alt="" style={{width: '40px', height: '40px'}} />{user.nick_name}</a>
                    <a href="#" onClick={ this.logOut }>退出</a> 
                    </span>
                }
            </div>        
        </div>
    </header> 
    }
}
// 高阶函数 用来获取_app.js组件对象中的store,第一个参数是属性，
// 第二个参数是action方法，这个页面只是用属性，第二个参数可不传
export default connect(mapStateToProps, null)(Top)