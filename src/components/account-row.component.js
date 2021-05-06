import React, {useState, useEffect} from 'react'
import { FaRegEdit } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import axios from 'axios';
import {connect} from 'react-redux'
import {Modal} from 'antd'
import { useAlert } from 'react-alert';

const AccRow = (props) => {
    const [deleteModalState, setDeleteModalState] = useState(false);
    const [deleteState, setDeleteState] = useState(false)
    const alert = useAlert()

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

    function deleteHandle(){
        axios.delete(`https://${process.env.REACT_APP_IP}/admin/user/${props.acc_id}`, {
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

    }

    return(
        (deleteState)?(
            <></>
        ):(
            <div className='row acc-row col-14'>
            <Modal title="Confirm to delete" visible={deleteModalState} onOk={handleDelOk} onCancel={handleDelCancel}>
                Are you sure you want to delete this account? <span style={{color:'red'}}>*There is no running back!</span>
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
                <div className='ml-2'>
                    <FaRegEdit className='clickable-icon' size='20px' color='gray' onClick={editHandle}></FaRegEdit>
                    <span>
                        <ImBin className='ml-3 clickable-icon' size='20px' color='gray' onClick={showDelModal}></ImBin>
                    </span>
                </div>
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