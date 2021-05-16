import React, {useState, useEffect} from 'react'
import { FaRegEdit, FaUndoAlt } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import axios from 'axios';
import {connect} from 'react-redux'
import {Modal} from 'antd'
import { useAlert } from 'react-alert';

const AccRow = (props) => {
    const [deleteModalState, setDeleteModalState] = useState(false);
    const [deleteState, setDeleteState] = useState(false)
    const [faculty, setFaculty] = useState([])
    
    const [pwd, setPwd] = useState('')
    const [rePwd, setRePwd] = useState('')    

    const [editModalState, setEditModelState] = useState(false)

    const alert = useAlert()

    useEffect(() => {
        getRole()
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
        setPwd('')
        setRePwd('')
        setEditModelState(true)
    }

    const handleEditOk = () => {
        editHandle()        
    }

    const handleEditCancel = () => {
        setEditModelState(false)
    }

    function getRole(){
        axios.get(`${process.env.REACT_APP_IP}/role`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then( res =>{
            if(res.data.code === 0){
                setFaculty(res.data.data)
            } else {
                alert.show(res.data.message, {
                    type: 'error'
                })                
            }
        })
        .catch(e => {
            console.error(e)
        })        
    }

    function deleteHandle(){
        axios.delete(`${process.env.REACT_APP_IP}/admin/user/${props.acc_id}`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {
            if(res.data.code === 0){
                alert.show('Account deleted', {
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

    function editHandle(){
        if(pwd !== rePwd){
            alert.show('Password and re-password does not match', {
                type:'error'
            })
            return
        }

        if(pwd.length < 6){
            alert.show('Password at least 6 characters', {
                type: 'error'
            })
            return
        }

        axios.put(`${process.env.REACT_APP_IP}/admin/user/${props.user_id}`, {
            password: pwd
        }, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then( res => {
            if(res.data.code === 0){
                alert.show('Password updated', {
                    type: 'success'
                })
                setEditModelState(false)
            }
            else {
                alert.show(res.data.message, {
                    type: 'error'
                })
            }            
        })
        .catch(e => {
            console.error(e)
        })
    }

    function rerollAccount(){
        
    }

    return(
        (deleteState)?(
            <div className='row acc-row' style={{backgroundColor:'lightgray'}}>            

            <div className='col-3'>{props.user}</div>
            <div className='col-3'>
                <div className='ml-1'>
                    {props.user_name}
                </div>
            </div>
            <div className='col-3'>
                <div className='ml-2'>
                    {props.faculty}
                </div>
            </div>
            <div className='col-3'>
                <FaUndoAlt className='ml-4 clickable-icon' size='18px' color='gray' title='undo' onClick={rerollAccount}></FaUndoAlt>                          
            </div>
        </div>
        ):(
            <div className='row acc-row' style={{backgroundColor:props.deleted?'lightgray':'white'}}>

            <Modal title="Confirm to delete" visible={deleteModalState} onOk={handleDelOk} onCancel={handleDelCancel}>
                Are you sure you want to delete this account? <span style={{color:'red'}}>*There is no running back!</span>
            </Modal>

            <Modal title="Update account" visible={editModalState} onOk={handleEditOk} onCancel={handleEditCancel}>
                <div>                    
                    <div className='form-group'>
                        <input autoComplete="off" className='form-control' type='password' value={pwd} onChange={e => setPwd(e.target.value)} placeholder='Password'></input>
                    </div>
                    <div className='form-group'>
                        <input autoComplete="off" className='form-control' type='password' value={rePwd} onChange={e => setRePwd(e.target.value)} placeholder='Re-password'></input>
                    </div>                    
                </div>
            </Modal>

            <div className='col-3'>{props.user}</div>
            <div className='col-3'>
                <div className='ml-1'>
                    {props.user_name}
                </div>
            </div>
            <div className='col-3'>
                <div className='ml-2'>
                    {props.faculty}
                </div>
            </div>
            <div className='col-3'>
                {
                    props.deleted?(
                        <FaUndoAlt className='ml-4 clickable-icon' size='18px' color='gray' title='undo' onClick={rerollAccount}></FaUndoAlt>
                    ):(
                        <div className='ml-2'>
                            <FaRegEdit className='clickable-icon' size='20px' color='gray' title='edit' onClick={showEditModal}></FaRegEdit>
                            <span>
                                <ImBin className='ml-3 clickable-icon' size='20px' color='gray' title='delete' onClick={showDelModal}></ImBin>
                            </span>
                        </div>
                    )
                }                
            </div>
        </div>
        )        
    )
}

function mapStateToProps(state){
    return{
        token: state.token
    }
}

export default connect(mapStateToProps)(AccRow)