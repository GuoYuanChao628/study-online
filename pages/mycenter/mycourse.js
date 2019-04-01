import React from 'react'
import css from './mycourse.less'
import { Row, Col, message, Affix, Menu, Icon } from 'antd'
import Head from 'next/head'
import MyLeft from './left.js'
import fetchHelper from '../../utils/fetch.js'
import Router from 'next/router'
import Link from 'next/link'
import localTime from '../../utils/date.js'
export default class Mycourse extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            top: 80,
            CourseList: null,
            currentCourse: null
        }
    }
    componentWillMount(){
        var url = '/ch/mycenter/getMyCourseList'
        fetchHelper.get(url).then(res => {
            console.log(res);
            if(res.status == 0) {
                this.setState({
                    CourseList: res.message.CourseList,
                    currentCourse: res.message.currentCourse
                })
            }
        })
    }
    render(){
        return <div>
            <Head>
                <title>学成在线-我的课程</title>
            </Head>
            {/* 顶部banner */}
            <div className={css.personal_header}></div>
            {/* 顶部banner */}
            {/* 内容布局 */}
            <div className={css.container}>
                {/* 左边菜单 */}
                <Row>
                    <Col span="6">
                        <Affix offsetTop={this.state.top}>
                            <MyLeft></MyLeft>
                        </Affix>
                    </Col>
                    {/* 左边菜单 */}

                    {/* 右边内容 */}
                    <Col span="18">
                        <div className={css.personal_content + " " + css.pull_right}>
                            <div className={css.personal_cont}>
                                <div className="top">
                                    <div className={css.tit}><span>当前课程</span></div>
                                    <div className={css.top_cont}>
                                        <div className={css.col_lg_8}>
                                            <div className={css.imgIco}><img src="/static/img/asset-timg.png" width="60" height="28" alt="" /></div>
                                            <div className={css.title}><span className={css.lab}>继续学习</span> { this.state.currentCourse && this.state.currentCourse.goods_title} <span className={css.status}>学习中</span></div>
                                            <div className={css.about}><span className={css.lab}>正在学习</span> { this.state.currentCourse && this.state.currentCourse.last_section_name} </div>
                                            <div className={css.about}> <span className={css.status}>有效日期: { localTime(this.state.currentCourse && this.state.currentCourse.end_time)}</span></div>
                                        </div>
                                        <div className={css.division}></div>
                                        <div className={css.col_lg_4}>
                                            <Link href={{pathname: '/course/play', query:{cid: this.state.currentCourse && this.state.currentCourse.goods_id, sid: this.state.currentCourse && this.state.currentCourse.last_section}}}>
                                                <a className={css.goLear}> 继续学习</a>
                                            </Link>
                                           
                                            {/* <a href="#" className={css.evalu}> 课程评价</a> */}
                                            <div className={css.aft}>● ● ●</div>
                                        </div>
                                        <div className={css.clearfix}></div>
                                    </div>

                                    <div className={css.tit}><span>我的课程</span></div>
                                        { this.state.CourseList && this.state.CourseList.map((item, index) => (
                                         <div className={css.top_cont} key={item.order_id}>
                                            <div className={css.col_lg_8}>
                                                <div className={css.imgIco}><img src="/static/img/asset-timg.png" width="60" height="28" alt="" /></div>
                                                <div className={css.title}><span className={css.lab}>继续学习</span> {item.goods_title} <span className={css.status}>学习中</span></div>
                                                <div className={css.about}><span className={css.lab}>正在学习</span> {item.last_section_name} </div>
                                                <div className={css.about}> <span className={css.status}>有效日期: {localTime(item.end_time)}</span></div>
                                            </div>
                                            <div className={css.division}></div>
                                            <div className={css.col_lg_4}>
                                                <a href="#" className={css.goLear}> 继续学习</a>
                                                {/* <a href="#" className={css.evalu}> 课程评价</a> */}
                                                <div className={css.aft}>● ● ●</div>
                                            </div>
                                            <div className={css.clearfix}></div>
                                        </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </Col>
                    {/* 右边内容 */}
                </Row>
            </div>
            {/* 内容布局 */}
        </div>
    }
}