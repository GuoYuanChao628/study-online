import css from './play.less'
import Head from 'next/head'
import {withRouter} from 'next/router'
import Router from 'next/router'
import { Row, Col, Collapse, Icon, Tabs, Button, Modal, Badge,message,Pagination  } from 'antd'
const Panel = Collapse.Panel
const TabPane = Tabs.TabPane
import fetchHelper from '../../utils/fetch.js'
import localTime from '../../utils/date.js'
class show extends React.Component {
    constructor(props){
        super(props)
        this.state= {
            visible: false,
            courseList: null,
            sectionInfo: null,
            isBuy: false,
            pageIndex: 1,
            pageSize: 2,
            questions: null,
            total: 0
        }
    }
    componentWillMount(){
        // 权限设置，查看当前用户有没有购买课程
        this.getMyCourse()
        // 根据课程id把小节信息渲染
        // 课程id this.props.router.query.cid 小节id :this.props.router.query.sid
        // console.log(this.props.router.query);
        this.getCourseList()
        this.getSectionInfo(this.props.router.query.sid)
        // 获取当前小节的问题信息
        this.getQuestionAll()

    }
    // 获取当前用户的已购买课程
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
    // 根据课程id获取课程大纲
    getCourseList(){
        var cid = this.props.router.query.cid
        fetchHelper.get(`/nc/course/courseDetial/getOutline/${cid}`)
        .then(res => {
            // console.log(res);
            if (res.status == 0) {
                this.setState({
                    courseList: res.message
                })
            }
        })
    }
    // 根据 sid获取视频信息
    getSectionInfo(sid){
        // var sid = this.props.router.query.sid
        fetchHelper.get(`/nc/course/courseDetial/getSectionInfo/${sid}`).then(res=> {
            // console.log(res);
            if (res.status == 0) { 
                this.setState({
                    sectionInfo: res.message
                })
            }
        })
    }
    reload(sid){
        // 点击不同小节 跳转路由
        Router.push({pathname: '/course/play', query:{cid:this.props.router.query.cid, sid: sid}})
        // 重新加载视频资源
        this.setState({
            sectionInfo: null
        },() => {
            this.getSectionInfo(sid)
        }) 
    }
    // 提问题模块
    postQuestion = () => {
        // 参数1 小节id this.props.router.query.sid
        var url = "/ch/course/courseDetial/PostSectionQuestion"
        // 获取文本域的内容
        var content = this.refs.questionContent.value 
        var body = {
            section_id: this.props.router.query.sid,
            content: content
        }
        fetchHelper.post(url, body).then(res => {
            // console.log(res);
            if (res.status == 0) {
                message.success("问题提交成功", 1,()=>{
                    this.getQuestionAll()
                    this.refs.questionContent.value = ""
                })
            } else {
                message.warn(res.message)
            }
        })
    }
    // 回答问题模块
    answerQuestion = () => {
        this.setState({
            visible: true
        })
    }
    handleCancel(){
        this.setState({
            visible: false
        })
    }
    // 提交问题
    handleOk(id){
        // 内容
        var txt = this.refs.rpContent.value
        // console.log(id, txt);
        var url = '/ch/course/courseDetial/PostSectionResult'
        var body = {
            section_id: this.props.router.query.sid,
            parent_id: id,
            content: txt
        }
        if(txt && txt.length >1) {
            fetchHelper.post(url, body).then(res => {
                // console.log(res);
                if(res.status ==0) {
                    message.success(res.message,1,() => {
                        this.setState({
                            visible: false
                        })
                    })
    
                }
            })
        } else {
            message.warn("回复内容不能为空")
        }
       
    }
    // 获取当前小节的所有问题列表
    getQuestionAll(){
        // 参数1：  小节id:  this.props.router.query.sid
        var pageIndex = this.state.pageIndex
        var pageSize = this.state.pageSize
        var url = `/nc/course/courseDetial/getSectionQAByPage/${this.props.router.query.sid}?pageIndex=${pageIndex}&pageSize=${pageSize}`
        fetchHelper.get(url).then(res => {
            // console.log(res);
            if (res.status == 0) {
                this.setState({
                    questions: res.message,
                    total: res.totalCount
                })
            }
        })
    }
    // 问题的分页显示
    pageChange = (page) => {
        // console.log(page);
        this.setState({
            pageIndex: page
        }, () => {
            this.getQuestionAll()
        })
        
    }
render() {
    return (<div style={{ minHeight: 800 }}>
        <Head>
            <title>学成在线-课程播放</title>
        </Head>

            {/* 1.0 视频播放区-begin */}
            <div className={css.article_banner}>
            <Row>
                <Col span="19">
                <div className={css.video_box}>
                    { this.state.sectionInfo && this.state.sectionInfo.is_free == 1 || this.state.isBuy ?
                    <video src={this.state.sectionInfo && this.state.sectionInfo.video_path }
                    controls="controls" 
                    ></video> : 
                    <div className={css.isShow}>你还没有购买课程</div>
                    }
                    
                    
                </div>
                </Col>
                <Col span="5">
                <div className={css.section + " section"}>
                    {/* 折叠面板 */}
                    
                    <Collapse defaultActiveKey={["0"]} >
                        { this.state.courseList && this.state.courseList.filter(item => item.parent_id == 0).map((item2, index) => (
                        <Panel header={item2.section_name } key={index}>
                            <Row className={css.sesionUl} type="flex">                                
                                
                                    { this.state.courseList && this.state.courseList.filter(item3 => item3.parent_id == item2.id).map((item4, index) => (
                                    <Col span="24" key={item4.id}>  
                                        <a onClick={() => {this.reload(item4.id)}} className={item4.id == this.props.router.query.sid ? css.active : ""}>
                                        <Icon type="play-circle" /> {item4.section_name}
                                        { item4.is_free == 1 ?
                                        <span style={{color:'red'}}> 免费</span>: ""
                                        }                                        
                                        </a>
                                    </Col>   
                                    )) }
                                                           
                            </Row>
                        </Panel>
                        )) }
                        
                    </Collapse>
                    {/* 折叠面板 */}
                </div>
                </Col>
            </Row>
            </div>
            {/* 1.0 视频播放区-end */}
	
            {/* 2.0 章节问答，章节资源-begin */}
            <div className={css.article_cont}>
            <Row>
                <Col span="20">
                    <div className={css.tit_list}>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab={<span><Icon type="file-text" />章节问答</span>} key="1">
                                    <div className={css.tabp}>
                                    {/* 问题发布区域-being */}
                                        <div className={css.content_title}>
                                            <textarea ref="questionContent" placeholder="请输入你的问题" style={{ height: 100, width: 600, padding: 5 }}></textarea>
                                            <br /> <Button type="primary" onClick={this.postQuestion}>提交</Button> 
                                            <Button type="primary" onClick={() => {this.refs.questionContent.value = ""}} style={{marginLeft: 20}}>重置</Button>
                                        </div>
                                    {/* 问题发布区域-end */}
                                        { this.state.questions && this.state.questions.map((item, index) => (
                                        <div className={css.item} key={item.id}>
                                             <div className={css.item_left}>
                                                 <p>{item.user_name}</p>
                                             </div>
                                             <div className={css.item_right}>
                                                 <div dangerouslySetInnerHTML = {{ __html: item.content }} className={css.title}></div>
                                                 {/* 问题回答区域 */}
                                                 <Button type="primary" ghost onClick={this.answerQuestion} >我来回答</Button>
                                                 <Modal
                                                     title="问题回复"
                                                     cancelText = "取消"
                                                     okText="提交"
                                                     visible={this.state.visible}
                                                     onOk={()=>{this.handleOk(item.id)}}
                                                     onCancel={()=>{this.handleCancel()}}
                                                 >
                                                     <textarea ref="rpContent" placeholder="请输入你的答案" style={{ height: 100, width: 480, padding: 5 }}></textarea>
 
                                                 </Modal>
                                                 {/* 问题回答区域 */}
                                                 <Collapse className={css.replay} bordered={false}>
                                                 <Panel showArrow={true} header={<Row><Col span="20">{ localTime(item.add_time) }</Col><Col className={css.action_box} span="4"><Icon type="message" /> 回答 {item.replyList.length}</Col></Row>}>
                                                    { item.replyList.length > 0 ?
                                                         item.replyList &&  item.replyList.length>=1 && item.replyList.map((item2, index) => (
                                                            <div key = {item2.id}> 
                                                            <div className={css.title}> 
                                                                <Badge count={index + 1} style={{ backgroundColor: '#52c41a', boxShadow: '0 0 0 1px #d9d9d9 inset' }}/>
                                                                <span>{ item2.user_name }</span><span >{ localTime(item2.add_time) }</span>
                                                            </div>
                                                            <div dangerouslySetInnerHTML = {{ __html: item2.content }} className={css.content}></div>
                                                            </div>
                                                       )):
                                                       <div>还没有人回答问题，来占一个板凳呀</div>
                                                    }
                                                    
                                                    
                                                   
                                                  </Panel>
                                                    
                                                 </Collapse>
                                             </div>
                                        </div>
                                        ))}
                                       
                                        

                                        <Pagination defaultCurrent={1} 
                                        defaultPageSize= {this.state.pageSize} 
                                        total={this.state.total} 
                                        onChange = {this.pageChange}
                                         /> 

                                    </div>

                                </TabPane>

                                <TabPane tab={<span><Icon type="usergroup-add" />章节资源</span>} key="2">
                                    <div className={css.tabp}>
                                        <a href={this.state.sectionInfo && this.state.sectionInfo.code_path}>章节代码下载</a> |
                                        <a href={this.state.sectionInfo && this.state.sectionInfo.notes_path}>章节文档下载</a>
                                    </div>
                                </TabPane>

                            </Tabs>
                        </div>
                </Col>

                <Col span="4">
                    <div className={css.tit_list}>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab={<span><Icon type="book" />学成在线云课堂</span>} key="1">
                                <p className={css.tabp}>学成在线整合线下优质课程和纯熟的教学经验，开展在线教育，突破空间、地域、时间、费用的限制，让优质教育资源平等化。</p>
                            </TabPane>
                        </Tabs>
                    </div>
                    </Col>
            </Row>
            </div>
            {/* 2.0 章节问答，章节资源-end */}
            <style>{`
               .section .ant-collapse,.section .ant-collapse-content {
                    background-color:#000;
                    color:#fff;
                    border:none;
                }
                .section .ant-collapse > .ant-collapse-item > .ant-collapse-header,.section .ant-collapse-content {
                    color:#fff;
                }    
                .section .ant-collapse > .ant-collapse-item{
                    border-bottom:none;
                }     
                .section .ant-collapse-content > .ant-collapse-content-box {
                    padding:0 0 0 26px;
                }
                `}       
            </style>
        </div>)
    }
}

// this.props.router.query.key名称获取url参数值
export default withRouter(show)