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
    const [hoverState, setHoverState] = useState(false)

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
        axios.delete(`${process.env.REACT_APP_IP}/notification/delete/${props.noti_id}`, {
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
        axios.put(`${process.env.REACT_APP_IP}/notification/update/${props.noti_id}`,{
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
                alert.show('Updated', {
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
        axios.get(`${process.env.REACT_APP_IP}/account/current`, {
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
                <div className='noti-card m-1' style={{borderLeft: props.borderStyle, backgroundColor: hoverState?'white':'rgba(248,248,248,255)'}} onMouseEnter={() => setHoverState(true)} onMouseLeave={() => setHoverState(false)}>    
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
                    <div className='ml-3 p-1'>
                        {
                            hoverState?(
                                <div className='row'>
                                    <div className='col-9' onClick={props.seedetail}>
                                        <div style={{fontSize: '18px', color: props.textStyle, fontWeight: '500'}}>
                                            {title}
                                        </div>
                                        <div style={{color:'gray'}}>
                                            {desc}
                                        </div>
                                        <div style={{color:'lightgray', fontSize: '14px'}}>
                                            {props.date}<span>/ {props.falcutyname}</span>                                        
                                        </div>
                                    </div>
                                    <div className='col-3 mt-auto mb-auto' style={{textAlign:'right'}}>
                                        <button className='btn btn-primary mr-1' style={{textAlign:'center'}}>
                                            <AiOutlineEdit onClick={showEditModal} size='17px' color='white'></AiOutlineEdit>                                    
                                        </button>    
                                        <button className='btn btn-danger mr-2' style={{textAlign:'center'}}>
                                            <ImBin onClick={showDelModal} size='15px' color='white'></ImBin>
                                        </button>                                                                                                         
                                    </div>
                                </div>
                            ):(                                
                                    <div onClick={props.seedetail}>
                                        <div style={{fontSize: '18px', color: props.textStyle, fontWeight: '500'}}>
                                            {title}
                                        </div>                                    
                                        <div style={{color:'gray', fontSize: '14px'}}>
                                            {props.date}<span>/ {props.falcutyname}</span>
                                        </div>
                                    </div>                                                                
                            )
                        }                                                                
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