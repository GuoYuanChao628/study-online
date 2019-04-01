import React from 'react'
import { Row, Col, Button, Table, message  } from 'antd'
import css from './shopcar.less'
import fetchHelper from '../../utils/fetch.js'
import {connect} from 'react-redux'
import Router from 'next/router'
const mapDispatchToProps = (dispatch)=>{
    return {
        onChangeShopCartCount: (count) => {
            dispatch({ type: 'CHANGE_SHOPCART_COUNT', count: count })
        },
        // 把用户勾选的商品用redux管理起来,在订单确认页面获取
        onChangeSelected: (courses) => {
            dispatch({type: "SELECTED_COURSE", courses: courses})
        }
    }
  }
class Shopcar extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            totalAmount: 0,
            disabled: true,
            columns: [{
                title: '课程图片',
                dataIndex: 'img_url',
                render: text => <img src={text} style={{width: 180, height: 100}}/>
              }, {
                title: '课程名称',
                dataIndex: 'title',
              }, {
                title: '服务周期',
                dataIndex: 'timeout',
                render: text => <span>{text}个月</span>
              }, {
                title: '销售价格',
                dataIndex: 'sell_price',
                render: text => <span style={{color: 'red'}}>￥{text}</span>
              }, {
                title: '操作',
                dataIndex: 'shop_car_id',
                render: text => <a href="javascript:;" onClick={this.delGoods.bind(this, text)}>删除</a>
              }],
            data: []
        }
    }
    // 删除购物车中的商品
    delGoods(id){
        // 要删除的商品ID
        // console.log(id);
        let url = `/ch/shop/deleteshopcar/${id}`
        fetchHelper.get(url).then(res => {
            if (res.status == 0) {
                message.success('成功移除商品')
                this.getShopCartList()
                this.props.onChangeShopCartCount(res.message.length)
            } else {
                message.error(res.message)
            }
        })
    }
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
        //   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        //   console.log(this.props);
          this.props.onChangeSelected(selectedRows)
        if (selectedRows && selectedRows.length > 0) {
            // 选中商品的总价
            let totalAmount = 0
            selectedRows.map(item => {
                totalAmount += item.sell_price
            })
            this.setState({
                totalAmount: totalAmount,
                disabled: false
            })
        } else {
            this.setState({
                totalAmount: 0,
                disabled: true
            }) 
        }
        }
    }
    // 获取购物车的信息
    componentWillMount(){
       this.getShopCartList()
    }
    // 获取购物车商品列表
    getShopCartList(){
        let url = '/ch/shop/getshopcarlist'
        fetchHelper.get(url).then(res => {
            console.log(res)
            if (res.status == 0) {
                // 信息获取成功
                this.setState({
                    data: res.message
                })
                this.props.onChangeShopCartCount(res.message.length)
            }
        })
    }
    render(){
        return <div style={{minHeight: 800}}>
            <div className={css.shoppingCart}>
                <div className={css.shoppingTitle}>
                    <span className={css.cartitle}>我的购物车</span>
                    <span className='nummber'>共<span className='shoppingNumber'>{this.state.data.length}个课程</span></span>
                </div>
                {/* 购物车详情 */}
                <div className={css.shoppingTableTitle}>
                 <Table rowSelection={this.rowSelection} columns={this.state.columns} dataSource={this.state.data} />
                </div>
                <div className={css.shoppingTitle}>
                    <Row>
                        <Col offset={11} span={8}>若购买享有满减等优惠，相应金额将在订单结算页面减扣</Col>
                        <Col span={3}>合计：<span style={{color: 'red', fontSize: 20}}>￥{this.state.totalAmount}</span></Col>
                        <Col span={2}>
                            <Button type='primary' size='large' disabled = {this.state.disabled} onClick={()=>{Router.push({pathname: "/shopcar/order"})}}>结算</Button>
                        </Col>
                    </Row>
                </div>
            </div>
            <style>
                {
                    `
                    .ant-pagination.ant-table-pagination {
                        display: none;
                    }
                    `
                }
            </style>
        </div>
    }
}
export default connect(null,mapDispatchToProps)(Shopcar)