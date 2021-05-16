import React from 'react'

import { BsThreeDots } from "react-icons/bs";
import { Image } from 'antd';
import { AiFillClockCircle, AiFillLike, AiOutlineLike} from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import { AiFillYoutube } from "react-icons/ai";
import { MdInsertPhoto } from "react-icons/md";

import { BiComment } from "react-icons/bi";
import ReactPlayer from 'react-player/youtube'
import { Menu, Dropdown, Modal, List, Skeleton } from 'antd';

import CommentPost from './comment-post.component'
import CommentChild from './comment-child.component'
import axios from 'axios'

const count = 3

export default class StatusCard extends React.Component {
    constructor(){
        super()
        this.state = {
            like: false,
            cmtState: false,
            deleteStatusState: false,
            editStatusState: false,
            modalshow: false,            
            likecount: 0,
            commentcount: 0,
            likelist: [],

            cmtdata: [],
            cmtlist: [],

            initLoading: true,
            loading: false,

            textcontent: '',
            imgcontent: '',
            linkyoutube: '',

            edittext: '',
            ytState: false,
            editytlink: '',
            fileInput: '',
            previewFile: null,

        }
        this.likeHandle = this.likeHandle.bind(this)   
        this.cmtHandle = this.cmtHandle.bind(this)                    
        this.deleteHandle = this.deleteHandle.bind(this)        
        this.showModal = this.showModal.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.handleCancel = this.handleCancel.bind(this)                
        this.showEditModal = this.showEditModal.bind(this)
        this.handleEditCancel = this.handleEditCancel.bind(this)
        this.handleEditOk = this.handleEditOk.bind(this)        

        this.deleteImageHandle = this.deleteImageHandle.bind(this)
        this.imageBtnHandle = this.imageBtnHandle.bind(this)
        this.fileChangeHandle = this.fileChangeHandle.bind(this)
        this._previewFile = this._previewFile.bind(this)
        this.youtubeUpload = this.youtubeUpload.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.updateHandle = this.updateHandle.bind(this)

        this.onLoadMore  = this.onLoadMore.bind(this)  
        this.updateList  = this.updateList.bind(this)
    }

    componentDidMount(){                
        if (this.props.likelist.some(e => e.id_user === this.props.user_id)) {
            this.setState({
                like: true
            })
        }
        
        this.setState({
            likecount: this.props.likelist.length,
            commentcount: this.props.commentlist.length,
            likelist: this.props.likelist,
            
            cmtdata: this.props.commentlist,
            cmtlist: this.props.commentlist,

            textcontent: this.props.textcontent,
            imgcontent: this.props.imgcontent,
            linkyoutube: this.props.linkyoutube,
        })             
    }   

    componentDidUpdate(prevProps) {        
        if(this.props.newcmt && this.props.newcmt !== prevProps.newcmt) {
            let newcmtlist = this.state.cmtdata            
            newcmtlist.push(this.props.newcmt.cmt_data[0])            
            this.updateList(newcmtlist)
        }
    }

    updateList(newcmtlist){        
        this.setState({
            cmtdata: newcmtlist,
            commentcount: newcmtlist.length,
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
            axios.put(`${process.env.REACT_APP_IP}/newfeed/like/${this.props.post_id}`, {},{
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
    }

    cmtHandle(){
        this.setState({
            cmtState: !this.state.cmtState
        })        
    }  

    deleteHandle(){        
        if(this.props.post_id && this.props.token){
            axios.delete(`${process.env.REACT_APP_IP}/newfeed/delete/${this.props.post_id}`, {
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

    showEditModal() {           
        this.setState({
            editStatusState: true,
            edittext: this.state.textcontent,
            editytlink: this.state.linkyoutube,
            previewFile: this.state.imgcontent,            
        })        
        
        if(this.state.linkyoutube && this.state.linkyoutube.length > 0){
            this.setState({
                ytState: true,                
            })
        }
        
    }

    handleEditOk(){
        this.handleUpdate()
    }

    handleEditCancel(){
        this.setState({
            editStatusState:false
        })
    }        

    deleteImageHandle(){
        this.setState({
            fileInput:'',
            previewFile: null
        })
    }

    imageBtnHandle(){
        this.setState({
            ytState: false,
            editytlink: ''  
        })

        const input = document.getElementById('update-img')
        if(input){
            input.click()
        }
    }

    fileChangeHandle(e){        
        const file = e.target.files[0]
        this.setState({
            fileInput: file,       
        })
        this._previewFile(file)
    }

    _previewFile(file){
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            this.setState({
                previewFile: reader.result
            })                    
        }
    }

    youtubeUpload(){
        if(this.state.imgcontent){
            return
        }
        this.setState({
            previewFile: null,
            fileInput: ''
        })

        if(this.state.ytState){
            this.setState({
                ytState: false,
                editytlink: ''
            })
            return
        }
        this.setState({
            ytState: true
        })       
    }

    handleUpdate(){                    
        if(this.state.edittext.length > 0 || (this.state.editytlink && this.state.editytlink.length > 0) || this.state.fileInput){
            this.updateHandle()
        }
    }

    async updateHandle(){
        var formData = new FormData();        

        let api = `${process.env.REACT_APP_IP}/newfeed/update/${this.props.post_id}`

        if(this.state.fileInput){
            if(!this.state.imgcontent) {
                api = `${process.env.REACT_APP_IP}/newfeed/update/new_image/${this.props.post_id}`
            } else {
                api=`${process.env.REACT_APP_IP}/newfeed/update/image/${this.props.post_id}`
            }

            await formData.append('image', this.state.fileInput)
            await formData.append('content', this.state.edittext)

            axios.put(api, formData, {
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'Authorization' : 'Bearer ' + this.props.token
                }
            })
            .then(res => {                
                if(res.data.code===0){
                    this.setState({
                        editStatusState: false,
                        textcontent: res.data.data.content,
                        imgcontent: res.data.data.image,
                        linkyoutube: res.data.data.linkyoutube,
                        edittext: '',
                        ytState: false,
                        editytlink: '',
                        fileInput: '',
                        previewFile: null,
                    })
                }
            })
            .catch(e => console.error(e))
        } else {
            axios.put(api,{
                content: this.state.edittext,
                linkyoutube: this.state.editytlink
            }, {
                headers:{                            
                    'Authorization' : 'Bearer ' + this.props.token
                }
            })
            .then(res => {                
                if(res.data.code===0){
                    this.setState({
                        editStatusState: false,
                        textcontent: res.data.data.content,
                        imgcontent: res.data.data.image,
                        linkyoutube: res.data.data.linkyoutube,
                        edittext: '',
                        ytState: false,
                        editytlink: '',
                        fileInput: '',
                        previewFile: null,
                    })
                    
                }
            })
            .catch(e => console.error(e))
        }       
    }

    onLoadMore() {
        this.setState({
            loading: true,
            cmtlist: this.state.cmtdata.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
        });
    }

    render(){        
        const menu = (
            <Menu>
                {
                    (this.props.user_id && this.props.user_post_id && this.props.role && (this.props.user_id === this.props.user_post_id || this.props.role !== 'admin')) && (
                        <Menu.Item>
                            <div style={{color:'gray'}} onClick={this.showEditModal}><FaRegEdit className='mr-1' style={{margin:'auto'}} color='gray' size='16px'></FaRegEdit> Edit</div>        
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

                        <Modal title="Confirm to delete" visible={this.state.modalshow} onOk={this.handleOk} onCancel={this.handleCancel}>
                            <div>Are you sure to delete this post?</div>
                        </Modal>

                        <Modal title="Update status" visible={this.state.editStatusState} onOk={this.handleEditOk} onCancel={this.handleEditCancel}>
                            
                        <div className='stp-post' style={{width:'100%'}}>
                                <textarea className='post-text p-2' rows='3' style={{width:'100%', border:'none', outline:'none'}} onChange={e => this.setState({edittext: e.target.value})} value={this.state.edittext} placeholder={`Wanna change something?`}></textarea>
                                <div className='stp-preview row ml-2'>
                                    {
                                        this.state.ytState && (<div style={{width:'100%', justifyContent:'center', display:'flex', marginRight:'22px'}}>
                                            <input type='text' value={this.state.editytlink} onChange={e => this.setState({editytlink: e.target.value})} placeholder='Paste youtube video url here' style={{outline:'none', border:'none', width:'80%', color:'rgb(2, 117, 216)', textAlign:'center'}}></input>
                                        </div>)
                                    }
                                    {this.state.previewFile && (
                                        <div>
                                            <img className='ml-3' src={this.state.previewFile} alt='chosen' style={{height:'180px', borderRadius:'4px'}}/> 
                                            <ImBin className='ml-2 clickable-icon' color='gray' size='22px' onClick={this.deleteImageHandle}></ImBin>
                                        </div>
                                    )}
                                </div>
                                <div className='row stp-action'>
                                    <div>
                                        <MdInsertPhoto className='clickable-icon mr-2' color='rgba(79,78,75,255)' size='24px' onClick={this.imageBtnHandle}></MdInsertPhoto>
                                        <input id='update-img' type='file' name='image' style={{display:'none'}} onChange={this.fileChangeHandle} accept="image/png, image/jpeg"/>
                                    </div>
                                    <div>
                                        <AiFillYoutube onClick={this.youtubeUpload} className='clickable-icon mr-4' color='rgba(79,78,75,255)' size='26px'></AiFillYoutube>
                                    </div>                                        
                                </div>                                    
                        </div>                            
                        </Modal>

                        <div className='stc-header row col-14 pt-2'>
                            <div className='col-1' style={{margin:'auto'}}>
                                <img src={this.props.avatar} width='30px' height='30px'></img>
                            </div>
                            <div className='col-9' style={{margin:'auto'}}>
                                <div className='text-primary username-direct ml-1' onClick={this.props.directToWall} style={{fontWeight:'bold', padding:'2px'}}>{this.props.username}</div>                                
                                <div className='row ml-0 ml-1'>
                                    <div style={{color:'gray', marginRight:'2px', fontSize:'14px'}}>{this.props.date}</div>
                                    <AiFillClockCircle style={{margin:'auto', marginLeft:'2px'}} size='13px' color='gray'></AiFillClockCircle>
                                </div>
                            </div>
                            <div className='col-2' style={{margin:'auto'}}>
                                {
                                    (this.props.user_id === this.props.user_post_id || this.props.role === 'admin') && (
                                        <Dropdown overlay={menu} placement="bottomRight" arrow>
                                            <BsThreeDots className='clickable-icon ml-2' size='22px' color='gray'></BsThreeDots>
                                        </Dropdown>
                                    )
                                }                        
                            </div>
                        </div>
                        <div className='stc-contain p-1 mt-1' style={{paddingTop: '4px'}}>
                            {                                                            
                                (this.state.textcontent && this.state.textcontent.length > 0) && (                                    
                                    <div className='mb-2'>
                                        <div className='stc-text'>{this.state.textcontent}</div>
                                    </div>
                                )                                
                            }

                            {
                                (this.state.linkyoutube && this.state.linkyoutube.length > 0) && (
                                    <div>
                                        <ReactPlayer width='100%' controls={true} url={this.state.linkyoutube}/>
                                    </div>
                                )
                            }

                            {
                                (this.state.imgcontent && this.state.imgcontent.length > 0) && (
                                <div className='p-0 img-frame'>
                                    {/* <Slideshow
                                        input={this.props.imgcontent}
                                        ratio={`4:2`}
                                        mode={`manual`}></Slideshow> */}
                                        <Image
                                            className='stc-img'
                                            width={380}
                                            src={this.state.imgcontent}
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
                                            (this.state.cmtdata && this.state.cmtdata.length > 0)?(
                                                this.state.cmtdata.map((value, index) => (                                            
                                                    <CommentChild
                                                        key={value._id}
                                                        user_name={value.user_id.user_name}
                                                        avatar={value.user_id.avatar}
                                                        content={value.comment}
                                                        datetime={value.date.split('T')[0]}
                                                        cmt_id={value.cmt_id}
                                                        user_cmt_id={value.user_id._id}
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