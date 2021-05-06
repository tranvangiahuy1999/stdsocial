import React from 'react'

import { BsThreeDots } from "react-icons/bs";
import { Image } from 'antd';
import { AiFillClockCircle, AiFillLike, AiOutlineLike} from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { ImBin } from "react-icons/im";

import { BiComment } from "react-icons/bi";
import ReactPlayer from 'react-player/youtube'
import { Menu, Dropdown, Modal } from 'antd';

import CommentPost from './comment-post.component'
import CommentChild from './comment-child.component'
import axios from 'axios'

export default class StatusCard extends React.Component {
    constructor(){
        super()
        this.state = {
            text: false,
            pic: false,
            linkyt: false,
            like: false,
            cmtState: false,
            deleteStatusState: false,
            editStatusState: false,
            modalshow: false,
            edittext: '',
            likecount: 0,
            commentcount: 0,
            cmtlist: []
        }
        this.likeHandle = this.likeHandle.bind(this)   
        this.cmtHandle = this.cmtHandle.bind(this)                    
        this.deleteHandle = this.deleteHandle.bind(this)
        this.editHandle = this.editHandle.bind(this)
        this.showModal = this.showModal.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.handleCancel = this.handleCancel.bind(this)        
    }

    componentDidMount(){
        if(this.props.imgcontent){
            this.setState({pic: true})
        }
        if(this.props.textcontent){
            this.setState({text: true})
        }
        if(this.props.linkyoutube){
            this.setState({linkyt: true})
        }
        
        this.setState({
            cmtlist: this.props.commentlist
        })        
               
        if (this.props.likelist.some(e => e.id_user === this.props.user_id)) {
            this.setState({
                like: true
            })
        }        
        
        this.setState({
            likecount: this.props.likecount,
            commentcount: this.props.commentcount
        })        
    }    

    showModal = () => {
        this.setState({
            modalshow: true
        })        
    };

    handleOk = () => {
        this.setState({
            modalshow: false
        })
        this.deleteHandle()
    };

    handleCancel = () => {
        this.setState({
            modalshow: false
        })        
    };

    likeHandle(){
        // if(this.props.post_id){
            axios.put(`https://${process.env.REACT_APP_IP}/newfeed/like/${this.props.post_id}`, {},{
                headers: {
                    'Authorization' : 'Bearer ' + this.props.token
                }
            })
            .then((res) => {
                if(res.data.code === 0){
                    if(this.state.like){
                        this.setState({
                            likecount: this.state.likecount -= 1
                        })
                    } else {
                        this.setState({
                            likecount: this.state.likecount += 1
                        })
                    }        
                    this.setState({
                        like: !this.state.like
                    })
                }
            })
            .catch(e => {
                console.error(e)
            })
        // }                       
    }

    cmtHandle(){        
        this.setState({
            cmtState: !this.state.cmtState
        })        
    }  

    deleteHandle(){        
        if(this.props.post_id && this.props.token){
            axios.delete(`https://${process.env.REACT_APP_IP}/newfeed/delete/${this.props.post_id}`, {
                headers: {
                    'Authorization' : 'Bearer ' + this.props.token
                }
            })
            .then(res => {                
                if(res.data.code === 0){
                    this.setState({
                        deleteStatusState: true
                    })
                    this.props.alertshow()
                }
            })
            .catch(e => {
                console.error(e)
            })
        }
    }

    pageLoadMore(){
        
    }

    editHandle(){
        this.setState({editStatusState: true, edittext: this.props.textcontent})
    }

    submitEditText(){

    }

    render(){
        const menu = (
            <Menu>
                {
                    (this.props.user_id && this.props.user_post_id && this.props.role && (this.props.user_id === this.props.user_post_id || this.props.role !== 'admin')) && (
                        <Menu.Item>
                            <div style={{color:'gray'}} onClick={this.editHandle}><FaRegEdit className='mr-1' style={{margin:'auto'}} color='gray' size='16px'></FaRegEdit> Edit</div>        
                        </Menu.Item>
                    )
                }              
              <Menu.Item>
                <div style={{color:'gray'}} onClick={this.showModal}><ImBin className='mr-1' style={{margin:'auto'}} color='gray' size='16px'></ImBin> Delete</div> 
              </Menu.Item>      
            </Menu>
        );
        return(            
                (this.state.deleteStatusState)?(
                    <div className='empty-data'>
                        <div className='empty-text'>Post has been deleted</div>
                    </div>
                ):(
                    <div className='stc-container bg-white col-12 mt-3 mb-2'>
                        <Modal title="Confirm" visible={this.state.modalshow} onOk={this.handleOk} onCancel={this.handleCancel}>
                            <div>Are you sure to delete this post?</div>
                        </Modal>
                        <div className='stc-header row col-14 pt-2'>
                            <div className='col-1' style={{margin:'auto'}}>
                                <img src={this.props.avatar} width='30px' height='30px'></img>
                            </div>
                            <div className='col-9' style={{margin:'auto'}}>
                                <div className='text-primary ml-1' style={{fontWeight:'bold', padding:'2px'}}>{this.props.username}</div>
                                <div className='row ml-0 ml-1'>
                                    <div style={{color:'gray', marginRight:'2px', fontSize:'14px'}}>{this.props.date}</div>
                                    <AiFillClockCircle style={{margin:'auto', marginLeft:'2px'}} size='13px' color='gray'></AiFillClockCircle>
                                </div>
                            </div>
                            <div className='col-2' style={{margin:'auto'}}>
                                {
                                    (this.props.user_id === this.props.user_post_id || this.props.role === 'admin') && (
                                        <Dropdown overlay={menu} placement="bottomRight" arrow>
                                            <BsThreeDots className='clickable-icon-dark ml-2' size='22px' color='gray'></BsThreeDots>
                                        </Dropdown>
                                    )
                                }                        
                            </div>
                        </div>
                        <div className='stc-contain p-1 mt-1' style={{paddingTop: '4px'}}>
                            {                                                            
                                (this.state.text) && (                                    
                                    <div className='mb-2'>
                                        <div className='stc-text'>{this.props.textcontent}</div>
                                    </div>
                                )                                
                            }

                            {
                                (this.state.linkyt) && (
                                    <div>
                                        <ReactPlayer width='100%' controls={true} url={this.props.linkyoutube}/>
                                    </div>
                                )
                            }

                            {
                                (this.state.pic) && (
                                <div className='p-0 img-frame'>
                                    {/* <Slideshow
                                        input={this.props.imgcontent}
                                        ratio={`4:2`}
                                        mode={`manual`}></Slideshow> */}
                                        <Image
                                            className='stc-img'
                                            width={380}
                                            src={this.props.imgcontent}
                                        />                                
                                </div>)
                            }
                            <div className='row m-2 pt-2'>
                                <div style={{width:'50%'}}>
                                    <div style={{textAlign:'start', color:'gray', fontSize:'15px'}}>{this.state.likecount}<AiFillLike className="ml-2" style={{alignSelf:'center',padding:'2px', marginRight:'10px', backgroundColor:'rgb(0,138,216)', borderRadius:'50%'}} color='white' size='16px'></AiFillLike></div>
                                </div>
                                <div style={{width:'50%'}}>
                                    <div className='cmttab' onClick={this.cmtHandle} style={{textAlign:'end', color:'gray', cursor:'pointer', fontSize:'15px'}}>{this.state.commentcount} Comments</div>
                                </div>
                            </div>
                        </div>
                        <div className='stc-interact'>
                            <div className='ml-2 mr-2 row'>
                                <button onClick={this.likeHandle} style={{color: (this.state.like)?"rgb(0,138,216)":"gray"}}>{(this.state.like)?<AiFillLike style={{margin:'auto', marginRight:'10px'}} color='rgb(0,138,216)' size='20px'></AiFillLike>:<AiOutlineLike style={{margin:'auto', marginRight:'10px'}} color='gray' size='20px'></AiOutlineLike>}Like</button>
                                <button onClick={this.cmtHandle} style={{color: "gray"}}><BiComment style={{margin:'auto', marginRight:'10px'}} color='gray' size='20px'></BiComment>Comment</button>
                            </div>
                            {
                                (this.state.cmtState)&&(
                                    <div>
                                        {
                                            (this.props.commentlist.length > 0)?(
                                                this.props.commentlist.map((value, index) => (                                            
                                                    <CommentChild
                                                        key={value._id}
                                                        user_name={value.user_name}
                                                        avatar={value.avatar}
                                                        content={value.comment}
                                                        datetime={value.time.split('T')[0]}
                                                        cmt_id={value._id}
                                                        user_cmt_id={value.id_user}
                                                        user_id={this.props.user_id}
                                                        user_role={this.props.role}
                                                    >                                            
                                                    </CommentChild>
                                                ))
                                            ):(
                                                <div className='empty-data'>
                                                    <div className='empty-text'>No comment to show</div>
                                                </div>
                                            )
                                        }                                
                                        <a className='ml-5'>Load more...</a>
                                        <CommentPost avatar={this.props.current_avatar} postid={this.props.post_id}></CommentPost>                         
                                    </div>
                                )
                            }             
                        </div>
                    </div>
                )                    
        )
    }
}