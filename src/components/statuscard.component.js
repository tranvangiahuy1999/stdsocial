import React from 'react'

import { BsThreeDots } from "react-icons/bs";
import { Image } from 'antd';
import { AiFillClockCircle, AiFillLike, AiOutlineLike} from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { ImBin } from "react-icons/im";

import { BiComment } from "react-icons/bi";
import ReactPlayer from 'react-player/youtube'
import { Menu, Dropdown } from 'antd';

import CommentPost from './comment-post.component'
import CommentChild from './comment-child.component'

const menu = (
    <Menu>
      <Menu.Item>
        <div style={{color:'gray'}}><FaRegEdit className='mr-1' style={{margin:'auto'}} color='gray' size='16px'></FaRegEdit> Edit</div>        
      </Menu.Item>
      <Menu.Item>
        <div style={{color:'gray'}}><ImBin className='mr-1' style={{margin:'auto'}} color='gray' size='16px'></ImBin> Delete</div> 
      </Menu.Item>      
    </Menu>
  );

export default class StatusCard extends React.Component {
    constructor(){
        super()
        this.state = {
            text: false,
            pic: false,
            linkyt: false,
            like: false,
            cmtState: false
        }
        this.likeHandle = this.likeHandle.bind(this)   
        this.cmtHandle = this.cmtHandle.bind(this)              
    }

    componentDidMount(){
        if(this.props.imgcontent && this.props.imgcontent.length > 0){
            this.setState({pic: true})
        }
        if(this.props.textcontent && this.props.textcontent.length > 0){
            this.setState({text: true})
        }
        if(this.props.linkyoutube && this.props.linkyoutube.length > 0){
            this.setState({linkyt: true})
        }
    }

    likeHandle(){
        //post like +1 or -1 to server
        this.setState({
            like: !this.state.like
        })
        this.props.likeHandle()
    }

    cmtHandle(){        
        this.setState({
            cmtState: !this.state.cmtState
        })
        this.props.cmtHandle()
    }   

    render(){
        return(
            <div className='stc-container bg-white col-12 mt-3 mb-2'>
                <div className='stc-header row col-14 pt-2'>
                    <div className='col-1' style={{margin:'auto'}}>
                        <img src={this.props.avatar} width='30px' height='30px'></img>
                    </div>
                    <div className='col-9' style={{margin:'auto'}}>
                        <div className='text-primary ml-1' style={{fontWeight:'bold', padding:'2px'}}>{this.props.username}</div>
                        <div className='row ml-0 ml-1'>
                            <text style={{color:'gray', marginRight:'2px', fontSize:'14px'}}>{this.props.date}</text>
                            <AiFillClockCircle style={{margin:'auto', marginLeft:'2px'}} size='13px' color='gray'></AiFillClockCircle>
                        </div>
                    </div>
                    <div className='col-2' style={{margin:'auto'}}>
                    <Dropdown overlay={menu} placement="bottomRight" arrow>
                        <BsThreeDots className='clickable-icon-dark ml-2' size='22px' color='gray'></BsThreeDots>
                    </Dropdown>       
                    </div>
                </div>
                <div className='stc-contain p-1 mt-1' style={{paddingTop: '4px'}}>
                    {
                        (this.state.text) && (
                        <div className='mb-2'>
                            <div className='stc-text'>{this.props.textcontent}</div>
                        </div>)
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
                                mode={`manual`}></Slideshow>                             */}
                                <Image
                                    className='stc-img'
                                    width={380}
                                    src={this.props.imgcontent}
                                />                                
                        </div>)
                    }
                    <div className='row m-2 pt-2'>
                        <div style={{width:'50%'}}>
                            <div style={{textAlign:'start', color:'gray', fontSize:'15px'}}>{this.props.like}<AiFillLike className="ml-2" style={{alignSelf:'center',padding:'2px', marginRight:'10px', backgroundColor:'rgb(0,138,216)', borderRadius:'50%'}} color='white' size='16px'></AiFillLike></div>
                        </div>
                        <div style={{width:'50%'}}>
                            <div className='cmttab' onClick={this.cmtHandle} style={{textAlign:'end', color:'gray', cursor:'pointer', fontSize:'15px'}}>{this.props.cmt} Comments</div>
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
                                    (this.props.commentlist && this.props.commentlist.length > 0)?(
                                        this.props.commentlist.map((value, index) => (
                                            <CommentChild
                                                key={index}
                                                user_name={(value.user_name)?value.user_name:''}
                                                avatar={(value.avatar)?value.avatar:''}
                                                content={(value.comment)?value.comment:''}
                                                datetime={(value.time)?(value.time.split('T')[0]):''}
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
                                <CommentPost avatar={this.props.avatar} postid={this.props.postid}></CommentPost>                         
                            </div>
                        )
                    }             
                </div>
            </div>
        )
    }
}