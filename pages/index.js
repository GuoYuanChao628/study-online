import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Button, Carousel, Menu, Row, Col } from 'antd'
import {connect} from 'react-redux'
import testReducer from './../reducer/testReducer';
import fetchHelper from '../utils/fetch';
import css from './index.less'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup
const mapStateToProps = (state) =>{
  return {
      ...state
  }
}
class Index extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      topCourseList: [],
       courselist: [],
       types: []
    }
  }
  componentWillMount(){
    // 请求精品课的数据
    fetchHelper.get('/nc/course/home/getTopCourseList')
    .then(res => {
      if (res.status == 0) {
        this.setState({
          topCourseList: res.message,
        })
      }
    })
    // 分类课程数据
    fetchHelper.get('/nc/course/home/getcourselist')
    .then(res => {
      if (res.status == 0) {
        this.setState({
          courselist: res.message.datas,
          types: res.message.types
        })
      }
    })
  }
  // 把数据请求放在组件的props中，服务器端渲染  next.js 特有的方法
  // 处理轮播图可分类科目
  static async getInitialProps(){
    let res = await fetchHelper.get('/nc/course/home/gettopdata')
    return {
      sliderlist: res.message.sliderlist,
      catelist: res.message.catelist
    }
  }
  render(){
    return <div>
    {/* <Head title="Home"/> */}
    <Head>
      <title>首页</title>
    </Head>
    {/* 轮播图和分类课程 */}
    <div>
      <Carousel autoplay className={css.banner_roll}>
        { this.props.sliderlist.map((item, key) => {
          return <div key={item.id}>
              <img style={{height: 410}} src={item.img_url}></img>
            </div>
        }) }
      </Carousel>
       {/* 分类课程 */}
      <div className={css.catelist}>
        <Menu style={{ width: 256 }} mode="vertical">
          {/* 一级分类 */}
          { this.props.catelist.map((item, key) => (
            <SubMenu key={item.id} title={<span><span>{item.title}</span></span>}>
              {/* 二级分类 */}
              {item.subcates.map((item2, key) => (
                <MenuItemGroup key={item2.id} title={item2.title}>
                  {/* 三级分类 */}
                  { item2.subcates.map((item3, key) => (
                     <Menu.Item key={item3.id}>{item3.title}</Menu.Item>
                  )) }
                </MenuItemGroup>
              ))}
            </SubMenu>
          )) }
          
        </Menu>
      </div>
      {/* 精品课程分类 */}
      <div className={css.toplesson}>
        <Row>
          <Col span={12}><h2>精品课程</h2></Col>
          <Col span={2} offset={10}><span>查看全部</span></Col>
        </Row>
        <ul>
          {this.state.topCourseList.map((item, key) => (
            <li className={css.recom_item} key={item.id}>
              <Link href={"/course/courseDetial?cid=" + item.id}>
                <a href="javascript:;">
                  <p>
                    <img width='100%' src={item.img_url} />
                    <span className={css.lab}>HOT</span>
                  </p>
                  <ul>
                    <li style={{height: 36}}>{item.title}</li>
                    <li className={css.li2}><span>{item.lesson_level}</span><em>·</em>{item.click}人在学习</li>
                  </ul>
                </a>
              </Link>
            </li>
          ))}
        </ul> 
      </div>           
      {/* 不同课程分组 */}
      {this.state.courselist.map((item, key) => (
        <div className={css.toplesson} key={item.id}>
        <Row>
          <Col span={8}><h2>{item.title}</h2></Col>
          <Col span={8} className={css.typesli}>
            <ul>
              {this.state.types.map((item3, key) => (
                <li key={item3.tid}>
                  <a href="javascript:;" className={key == 0 ? css.active : ''}>{item3.title}</a>
                </li>
              ))}
            </ul>
          </Col>
          <Col span={2} offset={6} className={css.typesli}><a href="javascript:;">查看全部</a></Col>
        </Row>
        <Row>
          <Col span={5}>
            <img src= {item.img_url} style={{width: 228, height: 392}} />
          </Col>
          <Col span={19}>
            <Row>
              <Col span={24}>
                <img src= {item.img1_url} style={{width: 957, height: 100}} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
              <ul>
                {item.courseList.map((item1, key) => (
                  <li className={css.recom_item} key={item1.id}>
                    <a href="javascript:;">
                      <p>
                        <img width='100%' height="160px" src={item1.img_url} />
                        <span className={css.lab}>HOT</span>
                      </p>
                      <ul>
                        <li style={{height: 36}}>{item1.title}</li>
                        <li className={css.li2}><span>{item1.lesson_level}</span><em>·</em>{item1.click}人在学习</li>
                      </ul>
                    </a>
                  </li>
                ))}
              </ul> 
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      ))}
    </div>
    <style>{
      `
      slick-dots {
        position: relative !important;
        bottom: 40px !important;
      }
      .ant-menu {
        background: rgba(0, 0, 0, 0.4) !important;
        color: #fff;
      }
      .ant-menu-submenu-arrow {
        color: #fff !important;
      }
      .ant-menu-submenu-arrow:before, .ant-menu-submenu-arrow:after {
        background-image: none !important;
      }
      .ant-menu-sub {
        background: #fff !important;
        color: #000;
      }
      .ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left {
        border-right: none !important;
      }
      .ant-menu-item-group-list {
        width: 500px;
      }
      .ant-menu-item-group-list .ant-menu-item{
        display: inline-block !important;
      }
      `         
    }
    </style>
  </div>
  }
}
// 高阶函数 用来获取_app.js组件对象中的store,第一个参数是属性，
// 第二个参数是action方法，这个页面只是用属性，第二个参数可不传
export default connect(mapStateToProps,null)(Index)
