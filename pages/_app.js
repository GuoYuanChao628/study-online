import App, {Container} from 'next/app'
import React from 'react'
import Layout from '../components/layout/layout'
// 导入withRedux
import withRedux from 'next-redux-wrapper'
// 导入store
import initStore from '../store'
// 导入Provider
import {Provider} from 'react-redux'
// import {persistor} from '../store'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from '../store/index'

import 'isomorphic-fetch'
require('es6-promise').polyfill() //保证低版本浏览器兼容promise
class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {}
    // 获取子组件中的props对象
     /*判断子组件是否有getInitialProps，如果有则调用子组件的getInitialProps，可以在子组件中getInitialProps返回同一个key
     的不同值，类实现是否加载局部组件*/    
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {pageProps}
  }

  render () {
    const {Component, pageProps, store} = this.props
    return  <Container>
           {/* 调用Layout布局组件并完成子组件Component内容的显示
            增加： <Provider store = {store}>
          */}
        <Provider store = {store}>
              {/* 调用Layout布局组件并完成子组件Component内容的显示 */}
              {/* 改造成利用Layout组件替换成Component，将Component组件提取到Layout组件中展示 */}
              <PersistGate persistor={persistor}>
                <Layout Component={Component}  {...pageProps}></Layout>
              </PersistGate>
        </Provider>
      </Container>
  }
}
export default withRedux(initStore)(MyApp)