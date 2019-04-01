import React from 'react'
import css from './left.less'
import { Menu, Icon } from 'antd'
import Link  from 'next/link'
import {getUser} from '../../utils/storageHelper.js'
export default class mycenterleft extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentWillMount(){
        // console.log(window.location.pathname);
    }
    render() {
        var user = getUser()
        return (
            <div className={css.personal_nav + " " + css.pull_left}>
                <div className={css.nav + " " + css.text_left}>
                    <div className={css.title}>个人中心</div>
                    <div className={css.my_ico}>
                        <img src="/static/img/asset-myimg.jpg" alt="" />
                        <p>{user.nick_name}</p>
                    </div>
                    <div className={css.item}>
                        <Menu
                            style={{ width: 200 }}
                            defaultSelectedKeys={[window.location.pathname]}
                            mode="vertical"
                        >
                            <Menu.Item key="/mycenter/mycourse">
                                <Link href={{ pathname: '/mycenter/mycourse' }}>
                                    <span><Icon type="mail" />我的课程</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/mycenter/myorder">
                                <Link href={{ pathname: '/mycenter/myorder' }}>
                                    <span><Icon type="calendar" />我的订单</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Icon type="message" />我的消息
                            </Menu.Item>
                            <Menu.Item key="4">
                                <Icon type="heart" />我的收藏
                            </Menu.Item>
                            <Menu.Item key="5">
                                <Icon type="setting" />个人设置
                            </Menu.Item>
                            <Menu.Item key="6">
                                <Icon type="appstore" />退出系统
                            </Menu.Item>
                        </Menu>
                    </div>
                </div>
                <style>{
                    `
                body{
                    background: #f3f5f7;
                }
                
                `
                }</style>
            </div>

        )
    }
}