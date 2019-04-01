import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Button } from 'antd'
import {connect} from 'react-redux'
import testReducer from '../reducer/testReducer';
import fetchHelper from '../utils/fetch';
const mapStateToProps = (state) =>{
  return {
      ...state
  }
}
class Index extends React.Component{
  // 把数据请求放在组件的props中，服务器端渲染  next.js 特有的方法
  static async getInitialProps(){
    let res = await fetchHelper.get('/nc/course/courseDetial/getCourseDetial/102')
    return {
      courseDetial: res.message.CourseDetial
    }
  }
  render(){
    return <div>
    {/* <Head title="Home"/> */}
    <Head>
      <title>首页</title>
    </Head>
    {this.props.courseDetial.title}
    <Link href="/home">
      <Button type="primary">跳转到Home页面</Button>
    </Link>
    <div className="hero">
      <h1 className="title" style={{color: this.props.testReducer.color}}>Welcome to Next777!</h1>
      <p className="description">
        To get started, edit <code>pages/index.js</code> and save to reload.
      </p>
    </div>
    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
      .row {
        max-width: 880px;
        margin: 80px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 220px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #067df7;
        font-size: 18px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #333;
      }
    `}</style>
  </div>
  }
}
// 高阶函数 用来获取_app.js组件对象中的store,第一个参数是属性，
// 第二个参数是action方法，这个页面只是用属性，第二个参数可不传
export default connect(mapStateToProps,null)(Index)
