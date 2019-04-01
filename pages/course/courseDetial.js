import React from 'react'
import {withRouter} from 'next/router'
import Router from 'next/router'
import Link from 'next/link'
// 导入样式文件
import css from './detail.less'
import {Icon, Row, Col, Collapse, Tabs, message } from 'antd'
import fetchHelper from '../../utils/fetch.js'
import {connect} from 'react-redux'
const TabPane = Tabs.TabPane
const Panel = Collapse.Panel
let sectionArr = []
// mapDispatchToProps 在this.props中
const mapDispatchToProps = (dispatch)=>{
  return {
      onChangeShopCartCount: (count) => {
          dispatch({ type: 'CHANGE_SHOPCART_COUNT', count: count })
      }
  }
}
class CourseDetial extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          lessons: null,
          isBuy: false
        }
    }
     // 把数据请求放在组件的props中，服务器端渲染  next.js 特有的方法
    // 处理轮播图可分类科目
    // 在 getInitialProps 方法中 对象query 可以获取页面传递的url参数
    static async getInitialProps({query}){
        let cid = query.cid
        let url = `/nc/course/courseDetial/getCourseDetial/${cid}`
        let res = await fetchHelper.get(url)
        // console.log(cid);
        return {
            breadCrumbs: res.message.BreadCrumbs,
            courseDetial: res.message.CourseDetial
        }
    }
    // 把商品添加到购物车
    postToShopart = () => {
      // 商品id
      let goods_id = this.props.router.query.cid
      let url = '/ch/shop/postshopcar'
      fetchHelper.post(url, {goods_id: goods_id}).then(res => {
        // console.log(res);
        // 没有登录
        if (res.status === 2) {
          message.error('未登录，请登录帐号')
          Router.push({pathname: '/account/login'})
          return
        } else if (res.status === 0) {
          message.success('商品已成功添加到购物车')
          // 当前购物车中的商品数量查看 res.message.count
          console.log(res);
          // 点击添加商品，购物车的图标会及时显示数量的更改
          this.props.onChangeShopCartCount(res.message.count)
        } else {
          message.error(res.message)
        }
        
      })
    }
    componentWillMount(){
      // 获取当前课程的详细信息
      this.getCourseDetail()
      // 获取当前登录用户课程信息
      this.getMyCourse()
    }
    getCourseDetail(){
      // 获取当前url的传递参数
      // console.log(this.props.router.query.cid)
      let cid = this.props.router.query.cid
      let url = `/nc/course/courseDetial/getOutline/${cid}`
      fetchHelper.get(url).then(res => {
        console.log(res);
        if (res.status == 0) {
          this.setState({
            // 课程大纲
            lessons: res.message
          })
          // 默认把课程列表都展开
          if(this.state.lessons){
            let count = res.message.filter(item => item.parent_id == 0).length
            for (let i = 0; i < count; i++) {
              sectionArr.push(i.toString())
            }
          }
        }
      })	
    }
    getMyCourse(){
      var url = "/ch/mycenter/getMyCourseList"
      fetchHelper.get(url).then(res => {
        if (res.status == 0) {
          // 返回的数据课程里面有goods_id和当前课程的id 一样的话 说明用户买了课程
          
          if (res.message.CourseList.some(item => item.goods_id == this.props.router.query.cid)) {
            this.setState({
              isBuy: true
            })
          } 
        }
      })
    }
    render(){
        return <div style={{minHeight: 800}}>
            {/* 详情页面的banner图片 */}
            <div className={css.article_banner}>
              <div className={css.banner_bg}></div>
              <div className={css.banner_info}>
                  {/* 左部分 */}
                  <div className={css.banner_left}>
                      <p>
                          {this.props.breadCrumbs && this.props.breadCrumbs.map((item, index) => (
                              <span key={index}>{item.title}{ index < this.props.breadCrumbs.length - 1 ? ' / ' : ' ' }</span>
                          ))}
                      </p>
                      <p className={css.tit}>{this.props.courseDetial.title}</p>
                      <p className={css.pic}>
                        <span className={css.new_pic}>特惠价格￥{this.props.courseDetial.sell_price}</span>
                        <span className={css.old_pic}>原价￥{this.props.courseDetial.market_price}</span>
                      </p>
                      <p className={css.info}>
                        <a onClick={this.postToShopart} href="javascript:;">加入购物车</a>
                        <span><em>难度等级</em>{this.props.courseDetial.lesson_level}</span>
                        <span><em>课程时长</em>{this.props.courseDetial.lesson_time}</span>
                        <span><em>评分</em>{this.props.courseDetial.lesson_star}</span>
                        <span><em>授课模式</em>{this.props.courseDetial.leson_type}</span>
                      </p>
                  </div>
                  {/* 右部分 */}
                  <div className={css.banner_rit}>
                    <p><img src="/static/img/widget-video.png"></img></p>
                    <p className={css.vid_act}>
                      <span><Icon type="plus-square" theme="outlined"></Icon>收藏 23</span>
                      <span>分享 <Icon type="share-alt" theme="outlined"></Icon></span>
                    </p>
                  </div>
              </div>
            </div>
            {/* 课程详情 */}
            <div className={css.article_cont}>
              <Row>
                <Col span={20}>
									<div className={css.tit_list}>
										<Tabs defaultActiveKey='1'>
											<TabPane tab={<span><Icon type="file-text" />课程详情</span>} key="1">
												<div className={css.tabp} dangerouslySetInnerHTML={{__html: this.props.courseDetial.content}}></div>
											</TabPane>
											<TabPane tab={<span><Icon type="file-text" />课程大纲</span>} key="0">
												<Collapse defaultActiveKey={sectionArr}>
													{this.state.lessons && this.state.lessons.filter(item => item.parent_id == 0).map((item1, index) => (
															<Panel header={item1.section_name} key={index}>
																<Row className={css.sesionUl}>
																	{ this.state.lessons && this.state.lessons.filter(item2 => item2.parent_id == item1.id).map((item3, id) =>(
																		<Col key={item3.id} span={12}>
                                      {/* 如果免费的课程 显示 用a标签包裹，不是免费而且用户没有购买课程则用span包裹 */}
                                      { item3.is_free == 1 ? <Link href={{pathname: "/course/play", query:{sid: item3.id, cid: item3.goods_id}}}><a href="javascript:;">{item3.section_name} <span style={{color: "red", marginLeft: 8}}>免费</span></a></Link> : 
                                      this.state.isBuy ? <Link href={{pathname: "/course/play", query:{sid: item3.id, cid: item3.goods_id}}}><a href="javascript:;">{item3.section_name}</a></Link>:
                                      <span>{item3.section_name}</span>
                                      }
                                      
                                    </Col>
																	))}
																</Row>
															</Panel>
													))}
												</Collapse>
											</TabPane>
											<TabPane tab={<span><Icon type="apple" />授课老师</span>} key="3">
												<div className={css.tabp}>
													<Row>
														<Col span={3}>
															<img src={this.props.courseDetial.teacher_img} style={{width: 120, height: 120}}></img>
														</Col>
														<Col span={21}>
															<Row>
																<Col span={24} style={{fontWeight: 700}}>{this.props.courseDetial.teacher_name}</Col>
																<Col span={24}>{this.props.courseDetial.teacher_desc}</Col>
															</Row>
														</Col>
													</Row>
												</div>
											</TabPane>
											<TabPane tab={<span><Icon type="android" />常见问题</span>} key="4">
												<div className={css.tabp} dangerouslySetInnerHTML={{__html: this.props.courseDetial.common_question}}></div>
											</TabPane>
										</Tabs>
									</div>
                </Col>
                <Col span={4}>
									<div className={css.tit_list}>
										<Tabs defaultActiveKey="1">
												<TabPane tab={<span><Icon type="book" />学成在线云课堂</span>} key="1">
													这是一段描述文字
												</TabPane>
										</Tabs>
									</div>
								</Col>
              </Row>
            </div>
        </div>
    }
}
export default connect(null,mapDispatchToProps)(withRouter(CourseDetial))