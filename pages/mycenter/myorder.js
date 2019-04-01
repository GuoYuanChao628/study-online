import React from 'react'
import MyLeft from './left.js'
import Head from 'next/head'
import css1 from './mycourse.less'
import { Row, Col, message, Affix, Menu, Icon, Collapse, Pagination  } from 'antd'
const Panel = Collapse.Panel;
import css from './myorder.less'
import fetchHelper from '../../utils/fetch.js'
import Router from 'next/router'
import localTime from '../../utils/date.js'
export default class Myorder extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            top: 80,
            orderType: -1,
            pageIndex: 1,
            pageSize: 3,
            orderList: null,
            totalPages: 0
        }
    }
    componentWillMount(){
        // 获取个人中心的订单列表
        this.getOrder()
    }
    getOrder(){
        var url = `/ch/mycenter/getMyOrderListByPage/${this.state.orderType}?pageIndex=${this.state.pageIndex}&pageSize=${this.state.pageSize}`
        fetchHelper.get(url)
        .then(res => {
            // 数据请求成功
            console.log(res);
            if(res.status == 0) {
                this.setState({
                    orderList: res.message.orderList,
                    totalPages: res.totalCount
                })
            }
        })
    }
    // 筛选订单
    filterOrder(type) {
        this.setState({
            orderList: null,
            orderType: type,
            totalPages: 0,
            pageIndex: 1,
        }, () => {
            // console.log(this.state.orderType)
            this.getOrder()
        })
    }
    // 翻页操作
    pageChange(page) {
        // console.log(page);
        this.setState({
            pageIndex: page
        }, () => {
            this.getOrder()
        })
    }
    render(){
        return <div style={{ minHeight: 800 }}>
        <Head>
            <title>学成在线-我的课程</title>
        </Head>
        {/* 顶部banner */}
        <div className={css1.personal_header}></div>
        {/* 顶部banner */}

        <div className={css.container}>
            {/* 左边菜单 */}
            <Row>
                <Col span="6">
                    <Affix offsetTop={this.state.top}>
                        <MyLeft mid="2"></MyLeft>
                    </Affix>
                </Col>
                {/* 左边菜单 */}

                {/* 右边内容 */}
                <Col span="18">
                    <div className={css.allclass_content}>
                        {/* 筛选条件 */}
                        <div className={css.top_title}>
                        <Row>
                            <Col span="15">
                                <span className={this.state.orderType == -1 ? css.active : ""} id="all" onClick={ this.filterOrder.bind(this, -1)}>全部课程</span>
                                <span className={this.state.orderType == 0 ? css.active : ""} id="wait" onClick={ this.filterOrder.bind(this, 0)}>待付款</span>
                                <span className={this.state.orderType == 1 ? css.active : ""} id="succ" onClick={ this.filterOrder.bind(this, 1)}>已完成</span>
                                <span className={this.state.orderType == 2 ? css.active : ""} id="outs" onClick={ this.filterOrder.bind(this, 2)}>已关闭</span>
                            </Col>
                            <Col span="9">
                                {/* 分页部分 */}
                                <Pagination defaultCurrent={1} pageSize={ this.state.pageSize } total={this.state.totalPages} onChange={this.pageChange.bind(this)} />
                            </Col>
                        </Row>
                            
                        </div>
                        {/* 筛选条件-end */}
                        {/* 表头 */}
                        <div className={css.nav}>
                            <div>
                                <span className={css.col_md_6 + " " + css.fleft}>课程信息</span>
                                <span className={css.col_md_4 + " " + css.fleft}><em>订单金额</em><em>实付款</em><em>交易状态</em></span>
                                <span className={css.col_md_2 + " " + css.fleft}>交易操作</span>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                        {/* 表头end */}

                        {/* 表内容 */}
                        <div className={css.allclass_cont}>
                        {this.state.orderList && this.state.orderList.map((item, index) => (                          
                            <div className={css.content} key={item.id}>
                                <div className={css.item}>
                                    <div className={css.time_orderid}><span>{ localTime(item.add_time) }</span> 订单号：{ item.order_no }</div>
                                        <div className={css.item_content}>
                                            <Row>
                                                <Col span="12">
                                                <Row>
                                                    {/* 订单详情 */}
                                                    <Col span="8">
                                                        <div className={css.col_md_2}>
                                                            <img src={ item.order_goods_list[0].img_url } width="100%" alt="" />
                                                        </div>
                                                    </Col>
                                                    <Col span="16">
                                                        <div className={css.item_cent + " " + css.col_md_6}>
                                                            <div className={css.title}>{ item.order_goods_list[0].goods_title }</div>
                                                            <div className={css.star_show}>
                                                                <div className={css.score}><i></i></div>
                                                            </div>
                                                            <div className={css.text}>课程打分 <em>{ item.order_goods_list[0].lesson_star }星</em></div>
                                                            <div className={css.cont}>有效截止日期：{ localTime(item.order_goods_list[0].timeout_time) }</div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Collapse bordered={false} defaultActiveKey={['0']}>
                                                    { item.order_goods_list.length > 1 ? 
                                                    <Panel header="查看此订单更多课程" key="1">
                                                    { item.order_goods_list.slice(1) && item.order_goods_list.slice(1).map((item2, key) => (
                                                        <Row key={item.id}>
                                                        <Col span="8">
                                                            <div className={css.col_md_2}>
                                                                <img src={item2.img_url} width="100%" alt="" />
                                                            </div>
                                                        </Col>
                                                        <Col span="15" offset="1">
                                                            <div className={css.item_cent + " " + css.col_md_6}>
                                                                <div className={css.title}>{item2.goods_title}</div>
                                                                <div className={css.star_show}>
                                                                    <div className={css.score}><i></i></div>
                                                                </div>
                                                                <div className={css.text}>课程打分 <em>{ item2.lesson_star }星</em></div>
                                                                <div className={css.cont}>有效截止日期：{ localTime(item2.timeout_time) }</div>
                                                            </div>
                                                        </Col>
                                                        </Row>
                                                    ))}     
                                                </Panel>: ''
                                                }
                                                    
                                                </Collapse>
                                                </Col>
                                                <Col span="7">
                                                    <div className={css.col_md_4 + " " + css.lab_info}>
                                                        <span>￥{ item.payable_amount }</span><span>￥{ item.real_amount }</span><span>{ item.statusName }</span>
                                                    </div>
                                                </Col>
                                                <Col span="5">
                                                    { item.status == 0 ?
                                                    <div className={css.item_rit + " " + css.col_md_2}>
                                                    <a href="javascript:;" className="">去 支 付 </a>
                                                    <a href="javascript:;">取消订单</a>
                                                    </div> : ""
                                                    }    
                                                </Col>
                                            </Row>
                                        </div>                                
                                </div>
                                
                            </div>
                        ))} 
                        </div>
                        {/* 表内容 */}
                    </div>
                </Col>
                {/* 右边内容 */}
            </Row>
        </div>
    </div>
    }
}