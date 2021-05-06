import React, {useState, useEffect} from 'react'
import { Comment, Tooltip, Avatar, Menu, Dropdown, Modal } from 'antd';
import { FaRegEdit } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import { BsThreeDots } from "react-icons/bs";
import moment from 'moment';

const CommentChild = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    function editHandle() {

    }

    const menu = (
        <Menu>                    
            <Menu.Item>
                <div style={{color:'gray'}} onClick={editHandle}><FaRegEdit className='mr-1' style={{margin:'auto'}} color='gray' size='16px'></FaRegEdit> Edit</div>        
            </Menu.Item>                          
            <Menu.Item>
                <div style={{color:'gray'}} onClick={showModal}><ImBin className='mr-1' style={{margin:'auto'}} color='gray' size='16px'></ImBin> Delete</div> 
            </Menu.Item>      
        </Menu>
    )
    return(
        <div className='row'>
            <Modal title="Confirm" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <div>Are you sure to delete this post?</div>
            </Modal>
            <div>
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
            <Dropdown className='mt-auto mb-auto' overlay={menu} placement="bottomRight" arrow>
                <BsThreeDots className='clickable-icon-dark ml-2' size='22px' color='gray'></BsThreeDots>
            </Dropdown>
        </div>        
    )
}

export default CommentChild