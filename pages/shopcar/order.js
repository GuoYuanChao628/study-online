import React from 'react'
import {connect} from 'react-redux'
import css from  './order.less'
import { Row, Col, Button, Table, message } from 'antd'
import Link from 'next/link'
import formatDate from '../../utils/formatDate.js'
import fetchHelper from '../../utils/fetch.js'
import Router from 'next/router'
const mapStateToProps = (state) => {
    return {
        ...state
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        onSetOrder: (orders) => {
            dispatch({ type: 'SET_ORDER', orders: orders })
        }
    }
  }
class Order extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            totalMount: 0,
            columns:[
                {
                    title: '课程图片',
                    dataIndex: 'img_url',
                    render: text => <img src={text} width="150px" height="150px" />
                },
                {
                    title: "课程名称",
                    dataIndex: 'title'
                },
                {
                    title: '课程服务周期',
                    dataIndex: 'timeout',
                    render: text => <span>即日起至{ formatDate(text) }</span>
                },
                {
                    title: '小计',
                    dataIndex: 'sell_price',
                    render: text => <span style={{color: "red"}}>￥{text}</span>
                }
            ]
        }
    }
    componentWillMount(){
        // 用户勾选的商品
        console.log(this.props.selectedReducer.state);
        formatDate()
        var totalMount = 0
        this.props.selectedReducer.state.map(item => {
            totalMount += item.sell_price
        })
        this.setState({
            totalMount: totalMount
        })
    }
    // 下单的业务逻辑
    setOrder = () => {
        // console.log(1111);
        var amount = this.state.totalMount
        var goodsIds = this.props.selectedReducer.state.map(item => item.goods_id).join(',')
        var payment_id = 1
        // 下单请求
        var url = '/ch/shop/postOrder'
        fetchHelper.post(url, {
            amount,
            payment_id,
            goodsIds,
        })
        .then(res => {
            if(res.status == 0) {
                // 下单成功
                message.success('下单成功', 1)
                // 跳转到支付页面 同时把订单信息用redux管理起来
                Router.push({pathname: '/shopcar/pay'})
                this.props.onSetOrder({
                    "order_id": res.message.order_id,
                    "order_no": res.message.order_no,
                    "amount": res.message.amount,
                    "remark": res.message.remark
                })

            } else {
                message.error('下单失败', 1)
            }
        })
    }
    render(){
        return<div>
            <div className={css.shoppingCart}>
                <div className={css.shoppingTitle}>
                    <span className={css.cartitle}>订单确认</span>
                </div>
                <div className={css.shoppingTableTitlt}>
                    <Table pagination={false} columns={this.state.columns} dataSource={this.props.selectedReducer.state} />
                </div>
                <div className={css.shoppingTitle}>
                    <Row>
                        <Col offset={11} span={8}>
                            <Link href={{pathname: '/shopcar/shopcar'}}><a>返回购物车修改</a></Link>
                        </Col>
                        <Col span={3}>
                            <span style={{color: "red", fontSize: 20}}>￥{this.state.totalMount}</span>
                        </Col>
                        <Col span={2}>
                            <Button type="primary" onClick = {this.setOrder}>提交订单</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Order)