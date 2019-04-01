import React from 'react'
import css from './pay.less'
import {connect} from 'react-redux'
import fetchHelper from '../../utils/fetch.js'
import { message } from 'antd'
import QRCode from 'qrcode.react'
import Router from 'next/router'
const mapStateToProps = (state) => {
    return {
        ...state
    }
}
var checkOrderInterval = null

class Pay extends React.Component{
    constructor(props) {
        super(props)
        this.state={
            payUrl: ''
        }
    }
    componentWillMount(){
        // 发起一个订单支付请求
        var url = "/ch/shop/wxpay"
        var order_id = this.props.orderReducer.state.order_id
        var out_trade_no = this.props.orderReducer.state.order_no
        var nonce_str = this.props.orderReducer.state.amount
        fetchHelper.post(url,{order_id, out_trade_no, nonce_str})
        .then(res => {
            // console.log(res);
            if (res.status == 1) {
                message.error("支付故障" + res.message)
            } else {
                this.setState({
                    payUrl: res.message.code_url
                })
            }

            // 定一个定时 3s 每次请求后台 订单有没有支付成功
            // checkOrderInterval = setInterval(() => {
            //     fetchHelper.post('/ch/shop/checkpay', {order_id, out_trade_no, nonce_str})
            //     .then(res => {
            //         console.log(res);
            //         if (res.status == 0 && res.message.trade_state == "SUCCESS") {
            //             // 跳转成功
            //             message.success(res.message.statusTxt, 1, () => {
            //                 // 清除这个定时器
            //                 if(checkOrderInterval){
            //                     clearInterval(checkOrderInterval)
            //                 }
            //                 Router.push({pathname: '/mycenter/myorders'})
            //             })

            //         }
            //     })
            // }, 3000)
        })

    }
    componentWillUnmount() {
        if(checkOrderInterval){
            clearInterval(checkOrderInterval)
        }
    }
    render(){
        return <div>
            <div className={css.CashierBodyTop}>
                <div className={css.CashierLeft}>
                    <p className={css.cashierTitle}>
                        产品名称： <span id="bookName" dangerouslySetInnerHTML={{ __html: this.props.orderReducer.state.remark}}></span>
                    </p>
                    <p>业务订单：<span>{this.props.orderReducer.state.order_no}</span></p>
                </div>
                <div className={css.CashierRight}>
                    <p className={css.org}>应付金额：<span>￥{this.props.orderReducer.state.amount}</span></p>
                </div>
            </div>
            <div className={css.CashierBodyTop}>
                 <span style={{fontSize: 20}}>
                    <h4>请使用手机微信扫码支付</h4>
                    <QRCode value={this.state.payUrl ? this.state.payUrl : "http://www.baidu.com"} />
                 </span>
            </div>
        </div>
    }
}
export default connect(mapStateToProps, null)(Pay)