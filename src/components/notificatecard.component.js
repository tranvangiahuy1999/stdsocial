import React, {useState, useEffect} from 'react'
import { AiOutlineEdit } from "react-icons/ai";
import { ImBin } from "react-icons/im";
import {Modal} from 'antd'
import axios from 'axios'
import { connect } from 'react-redux'
import { useAlert } from 'react-alert';

const NotiCard = (props) => {    
    const [userData, getUserData] = useState()
    const [deleteModalState, setDeleteModalState] = useState(false);
    const [deleteState, setDeleteState] = useState(false)

    const [title, setTitle] = useState(props.title)
    const [desc, setDesc] = useState(props.subtitle)

    const [editModalState, setEditModelState] = useState(false)
    const [editTitle, setEditTitle] = useState('')
    const [editDesc, setEditDesc] = useState('')
    const [editContent, setEditContent] = useState('')

    const alert= useAlert()

    useEffect(() => {
        getCurrentUser()
    }, [])

    const showDelModal = () => {        
        setDeleteModalState(true);
    };
    
    const handleDelOk = () => {
        deleteHandle()
        setDeleteModalState(false);
    };
    
    const handleDelCancel = () => {
        setDeleteModalState(false)
    }

    const showEditModal = () => {   
        setEditTitle(props.title)     
        setEditDesc(props.subtitle)
        setEditContent(props.content)
        setEditModelState(true)
    }

    const handleEditOk = () => {
        editHandle()        
    }

    const handleEditCancel = () => {
        setEditModelState(false)
    }

    function deleteHandle(){
        axios.delete(`https://${process.env.REACT_APP_IP}/notification/delete/${props.noti_id}`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {
            if(res.data.code===0){
                alert.show('Delete success', {
                    type:'success'
                })
                setDeleteState(true)
            }
            else {
                alert.show(res.data.message, {
                    type:'error'
                })
            }
        })
        .catch(e => console.error(e))
    }

    function editHandle() {
        axios.put(`https://${process.env.REACT_APP_IP}/notification/update/${props.noti_id}`,{
            title: editTitle,
            description: editDesc,
            faculty: props.falcutyname,
            content: editContent
        }, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {
            if(res.data.code===0){
                alert.show('Delete success', {
                    type:'success'
                })
                setTitle(editTitle)
                setDesc(editDesc)
                setEditModelState(false)        
            }
            else {
                alert.show(res.data.message, {
                    type:'error'
                })
            }
        })
        .catch(e => console.error(e))

    }

    function getCurrentUser() {
        axios.get(`https://${process.env.REACT_APP_IP}/account/current`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {            
            if(res.data.code === 0){
                getUserData(res.data.data)
            }
        })
        .catch(e => {
            console.error(e)
        })
    }

    return(
        (deleteState)?(
            <div className='empty-data'>
                <div className='empty-text'>Deleted notification</div>
            </div>
        ):(
            <div className='noti-card m-1' style={{borderLeft: props.borderStyle, backgroundColor: props.backgroundStyle}}>    
            <Modal title="Confirm to delete" visible={deleteModalState} onOk={handleDelOk} onCancel={handleDelCancel}>
                Are you sure you want to delete this notification? <span style={{color:'red'}}>*There is no running back!</span>
            </Modal>

            <Modal title="Update notification" visible={editModalState} onOk={handleEditOk} onCancel={handleEditCancel}>
                <div>
                    <div className='form-group'>
                        <input className='form-control' value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder='Title'></input>
                    </div>
                    <div className='form-group'>
                        <input className='form-control' value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder='Description'></input>
                    </div>
                    <div className='form-group'>
                        <input className='form-control' value={props.falcutyname} disabled={true} placeholder='Faculty'></input>
                    </div>
                    <div className='form-group'>
                        <textarea className='form-control' value={editContent} onChange={e => setEditContent(e.target.value)} placeholder='Content'></textarea>
                    </div>
                </div>
            </Modal>

                <div className='noticard-header row pl-3'>
                    <div style={{color:'gray', fontSize:'14px'}}>
                        [{props.falcutyname}]
                    </div>
                        <div style={{color:'gray', fontSize:'14px', paddingLeft:'5px'}}>
                            {props.date}
                        </div>
                </div>
                <div className='noticard-body'>
                    <div className='noticard-title' style={{color:'black', fontWeight:'bold', fontSize:'16px'}}>
                        {title} {
                            (userData && userData.role !== 'student') && (
                                <span>
                                    <AiOutlineEdit className='ml-2 clickable-icon' onClick={showEditModal} size='19px' color='gray'></AiOutlineEdit>
                                    <ImBin className='ml-2 clickable-icon' onClick={showDelModal} size='17px' color='gray'></ImBin>
                                </span>                        
                            )
                        }                  
                    </div>
                    <div className='noticard-content' style={{color:'gray', fontSize:'15px'}}>
                        {desc}
                    </div>
                    {props.notiLink}
                </div>                                            
        </div>
        )        
    )
}

function mapStateToProps(state) {
    return {
        token: state.token
    };
}

export default connect(mapStateToProps)(NotiCard)