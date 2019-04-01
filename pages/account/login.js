import React from 'react'
import { Form, Icon, Input, Button, Row, Col, Tabs, message} from 'antd'
import fetchHelper from '../../utils/fetch.js'
import { setUser } from '../../utils/storageHelper.js'
// 导入注册模版
import Register from '../../components/register/register.js'
// 导入css
import css from './login.less'
const TabPane = Tabs.TabPane;
class Login extends React.Component{
    constructor(props){
        super(props)
        this.state={

        }
    }
    login = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            // console.log('Received values of form: ', values)
            // 发起登录请求
            fetchHelper.post('/nc/common/account/login',values).then(res => {
                // console.log(res)
                // 登录结果
                if (res.status == 0) {
                    setUser(res.message.user)
                    message.success(res.message.text, 1 , () => {
                        window.location.href = '/index'
                    });
                } else {
                    message.error(res.message)
                }
            })
          }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form
        return <div style={{minHeight: '800px'}}>
            <Row>
        <Col span={8} offset={8}>
            <Tabs defaultActiveKey="1">
                <TabPane tab={<span><Icon type="apple" />登录</span>} key="1">
                    <Form onSubmit={this.login} className={css.login}>
                        <Form.Item>
                        {getFieldDecorator('user_name', {
                            rules: [{ required: true, message: '请输入用户名或者手机号!'},
                                    {pattern: /^[1][3,4,5,7,8][0-9]{9}$/,message: '请输入正确的手机号!'}
                                    ],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名或者手机号" />
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
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </TabPane>
                <TabPane tab={<span><Icon type="android" />注册</span>} key="2">
                    <Register></Register>
                </TabPane>
        </Tabs>
            </Col>
      </Row>
      <style>{
            `
            
            `
        }</style>                   
        </div>
    }
}
export default  Form.create({ name: 'normal' })(Login);