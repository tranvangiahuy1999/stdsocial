import React, {useState, useEffect} from 'react'
import { Comment, Tooltip, Avatar, Menu, Dropdown, Modal } from 'antd';
import { FaRegEdit } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import { RiEditLine } from "react-icons/ri";
import moment from 'moment';
import axios from 'axios'
import { connect } from 'react-redux'


const CommentChild = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [commentDeleteState, setCommentDeleteState] = useState(false)    

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        deleteCommentHandle()
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    function editHandle() {

    }

    function deleteCommentHandle(){
        console.log(props.token)
        if(props.cmt_id){            
            axios.put(`https://${process.env.REACT_APP_IP}/newfeed/delete/comment/${props.cmt_id}`, {}, {
                headers: {
                    'Authorization' : 'Bearer ' + props.token
                }
            })
            .then(res => {
                console.log(res)
                if(res.data.code === 0){
                    setCommentDeleteState(true)
                }
            })
            .catch(e => console.error(e))
        }
    }

    const menu = (
        <Menu>
            {
                ((props.user_id && props.user_cmt_id && props.user_role && (props.user_id === props.user_cmt_id || props.user_role !== 'admin'))) && (
                    <Menu.Item>
                        <div style={{color:'gray'}} onClick={editHandle}><FaRegEdit className='mr-1' style={{margin:'auto'}} color='gray' size='16px'></FaRegEdit> Edit</div>        
                    </Menu.Item>
                )
            }                   
            <Menu.Item>
                <div style={{color:'gray'}} onClick={showModal}><ImBin className='mr-1' style={{margin:'auto'}} color='gray' size='16px'></ImBin> Delete</div> 
            </Menu.Item>      
        </Menu>
    )
    return(
        (commentDeleteState)?(
            <div className='empty-data'>
                <div className='empty-text'>Comment has been deleted</div>
            </div>
        ):(
                <div className='row'>
                <Modal title="Confirm" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <div>Are you sure to delete this comment?</div>
                </Modal>
                <div className='col-10'>
                    <Comment            
                    author={<a>{props.user_name}</a>}
                    avatar={
                        <Avatar
                        src={props.avatar}
                        alt="avatar"
                        />
                    }
                    content={
                        <p>
                            {props.content}
                        </p>
                    }
                    datetime={
                        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{props.datetime}</span>
                        </Tooltip>
                    }
                    />
                </div>
                    {
                        (props.user_cmt_id && props.user_id && props.user_role && (props.user_cmt_id === props.user_id || props.user_role ==='admin')) && (
                            <Dropdown className='mt-auto mb-auto ml-4' overlay={menu} placement="bottomRight" arrow>
                                <RiEditLine className='clickable-icon ml-2' size='20px' color='gray'></RiEditLine>
                            </Dropdown>    
                        )
                    }                                      
            </div>      
        )  
    )
}

function mapStateToProps(state) {
    return {
        token: state.token
    };
}

export default connect(mapStateToProps)(CommentChild)