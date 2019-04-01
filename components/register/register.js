import React from 'react'
import {Form, Input, Icon, Row, Col, Button, message} from 'antd'
import fetchHelper from '../../utils/fetch.js'
class Register extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          // 发送验证码的按钮 默认可以点击
          disabled: false,
          btnTxt: '获取验证码'
        }
    }
    // 帐号注册
    register = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          // 先进行手机号码的有没有注册的验证
          this.checkuser(() => {
            // console.log('发起注册请求')
            values.role = '0'
            values.nick_name = '郭源潮'
            console.log(values);
            fetchHelper.post('/nc/common/account/register', values)
            .then(res => {
              // console.log(res);
              if (res.status === 0) {
                message.success('用户注册成功', 1)
                // 注册成功，返回到登录页面
                window.location.href = '/account/login'
              } else {
                message.error('用户注册失败!'+ res.message, 2)
                // console.log(res);
              }
            })
          })
        }
      });
    }
    // 手机号码有没有被注册的验证
    checkuser = (callback) => {
      let tel = this.props.form.getFieldValue('user_name')
      // console.log(tel)
      // 手机号码不能为空
      if (tel) {
        fetchHelper.post('/nc/common/account/checkuser', {'username': tel})
        .then(res => {
          if(res.status == 0) {
            if (res.message.isRegister) {
              // 设置提示文本
              this.props.form.setFields({
                ['user_name']: {value: tel, errors: [new Error('手机号码已被注册！')] }
              })
              // console.log(res.message.text)
            } else {
              // 手机没有被注册，进行post提交注册 保证传进的回调函数是一个函数
              if (typeof callback === 'function') {
                callback()
              }
            }
          } else {
            message.error('服务器异常', 1)
          }
        })
      }
    }
    // 校验手机验证码
    checkSMSCode = () => {
      let time = 5
      // 获取手机号
      let tel = this.props.form.getFieldValue('user_name')
      // 发送一次请求，校验手机号码 手机号码不能为空
      if (tel && tel.length > 0) {
        // 校验请求
        fetchHelper.post('/nc/common/account/snscode', {username: tel})
        .then(res => {
          // console.log(res)
          // 发送成功
          if (res.status === 0) {
            message.success(res.message, 2)
          } else {
            message.error(res.message, 1)
          }
        })
        // 按钮禁用，同时显示倒计时 测试时间5S
        this.setState({
          disabled: true
        })
        let timerHandle = null
        timerHandle = setInterval(() => {
          time--
          if (time <= 0 ) {
            // 清除定时器
            clearInterval(timerHandle)
            this.setState({
              btnTxt: '获取验证码',
              disabled: false
            })
            // 退出执行
            return
          }
          this.setState({
            btnTxt: time+'后获取验证码'
          })
        },1000)
      }
    }
    // 检验两次密码的一致性
    confirmPassword = (rule, value, callback) => {
      // 获取第一次的密码
      let tel = this.props.form.getFieldValue('password')
      // 参数value 是当前的密码
      if (value && value != tel) {
        callback('两次输入的密码不一样')
      } else {
        callback()
      }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return  <Form onSubmit={this.register} className="register">
            <Form.Item>
              {getFieldDecorator('user_name', {
                  rules: [{ required: true, message: '请输入用户名或者手机号!'},
                          {pattern: /^[1][3,4,5,7,8][0-9]{9}$/,message: '请输入正确的手机号!'}
                          ],
              })(
                  <Row>
                    <Col span='12'>
                      <Input onBlur={this.checkuser} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名或者手机号" />
                    </Col>
                    <Col span='1' offset={3}>
                      <Button onClick={this.checkSMSCode} type="primary" disabled = {this.state.disabled}>{ this.state.btnTxt }</Button>
                    </Col>
                  </Row>   
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('sns_code', {
                  rules: [{ required: true, message: '请输入验证码!' }],
              })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder="验证码" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码!' }],
              })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('confirm_password', {
                  rules: [{ required: true, message: '再次输入密码!' },
                  // 检验两次密码是否一样  自定义检验 定义一个函数                                                                                                                                                                                   
                {validator: this.confirmPassword}],
              })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请确认您的密码" />
              )}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    注册
                </Button>
            </Form.Item>
          </Form>
                   
    }
}
export default Form.create({ name: 'register' })(Register)