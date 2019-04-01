import React from 'react'
import { Button } from 'antd'
import Link from 'next/link'
import { connect } from 'react-redux';
import testReducer from './../reducer/testReducer';
import fetchHelper from '../utils/fetch.js';
const mapStateToProps = (state) =>{
    return {
        ...state
    }
  }
class Home extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            blist: []
        }
    }
    componentWillMount(){
        let url = '/nc/course/courseDetial/getCourseDetial/102'
        fetchHelper.get(url)
        .then(json => {
            // console.log(res);
            this.setState({
                blist: json.message.BreadCrumbs
            })
        })
    }
    render (){
        return <div>
            <h1 style={{color: this.props.testReducer.color}}>这是一个HOME页面</h1>
            <hr/>
            <Link href='/'>
                <Button type="primary">点击返回首页</Button>
            </Link>
            <ul>
                {this.state.blist && this.state.blist.map(item => {
                    return <li key={item.id}>{item.title}</li>
                })}
            </ul>
        </div>
    }
}
// 高阶函数 用来获取_app.js组件对象中的store,第一个参数是属性，
// 第二个参数是action方法，这个页面只是用属性，第二个参数可不传
export default connect(mapStateToProps,null)(Home)