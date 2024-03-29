import React, { useState, useEffect } from 'react'

import { FaRegEdit, FaUndoAlt } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import { BsThreeDotsVertical } from "react-icons/bs";

import axiosInstance from '../api/service';
import { Modal, Avatar, Dropdown, Menu } from 'antd'
import { useAlert } from 'react-alert';

const UserCard = (props) => {
    const [deleteModalState, setDeleteModalState] = useState(false)
    const [deleteState, setDeleteState] = useState(props.deleted)
    const [role, setRole] = useState(props.user_name)
    const [avatarSrc, setAvatarSrc] = useState(props.avatar)    
    const [pwd, setPwd] = useState('')
    const [rePwd, setRePwd] = useState('')
    const [editModalState, setEditModelState] = useState(false)
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

    function deleteHandle() {
        axiosInstance.delete(`/admin/user/${props.user_id}`)
            .then(res => {
                if (res.data.code === 0) {
                    alert.show('Account deleted', {
                        type: 'success'
                    })
                    setDeleteState(true)
                    setAvatarSrc('https://res.cloudinary.com/tdtimg/image/upload/v1621065055/kas5z5tfafnu1ypuwul6.png')
                    setRole('tài khoản không khả dụng')
                }
                else {
                    alert.show(res.data.message, {
                        type: 'error'
                    })
                }
            })
            .catch(e => console.error(e))
    }

    function editHandle() {
        if (pwd !== rePwd) {
            alert.show('Password and re-password does not match', {
                type: 'error'
            })
            return
        }

        if (pwd.length < 6) {
            alert.show('Password at least 6 characters', {
                type: 'error'
            })
            return
        }
        const body = {
            password: pwd
        }
        axiosInstance.put(`/admin/user/${props.user_id}`, body)
            .then(res => {
                if (res.data.code === 0) {
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

    function rerollAccount() {
        axiosInstance.get(`/admin/rollback/user/${props.user_id}`)
            .then(
                (res) => {
                    if (res.data.code === 0) {
                        alert.show('Account has been reroll', {
                            type: 'success'
                        })
                        setDeleteState(false)
                        setRole('Tài khoản quản lý')
                        setAvatarSrc('https://res.cloudinary.com/tdtimg/image/upload/v1619852102/wuib8yglnihou4zycrho.jpg')
                    } else {
                        alert.show(res.data.message, {
                            type: 'error'
                        })
                    }
                }
            )
            .catch(e => {
                console.log(e)
            })
    }

    const menu = (
        (deleteState) ? (
            <Menu>
                <Menu.Item>
                    <div style={{ color: 'gray' }} onClick={rerollAccount}><FaUndoAlt className='mr-1' color='gray' size='16px'></FaUndoAlt> Reroll</div>
                </Menu.Item>
            </Menu>
        ) : (
            <Menu>
                <Menu.Item>
                    <div style={{ color: 'gray' }} onClick={showEditModal}><FaRegEdit className='mr-1' color='gray' size='16px'></FaRegEdit> Edit</div>
                </Menu.Item>
                <Menu.Item>
                    <div style={{ color: 'gray' }} onClick={showDelModal}><ImBin className='mr-1' color='gray' size='16px'></ImBin> Delete</div>
                </Menu.Item>
            </Menu>
        )
    );

    return (
        <div>
            <Modal title="Confirm to delete" visible={deleteModalState} onOk={handleDelOk} onCancel={handleDelCancel}>
                Are you sure you want to delete this account? <span style={{ color: 'red' }}>*There is no running back!</span>
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

            <div className='row user-card m-2' style={{ backgroundColor: deleteState ? 'lightgray' : 'white' }}>
                <div className='col-md-1 col-lg-1 col-2 p-1' style={{ backgroundColor: deleteState ? 'gray' : props.backgroundColor, textAlign: 'center', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                    <Avatar className='mt-2' src={avatarSrc}></Avatar>
                </div>
                <div className='col-md-10 col-lg-10 col-7 p-2'>
                    <div style={{ color: deleteState ? 'gray' : props.color, fontSize: '17px' }}>{props.user}</div>
                    <div style={{ color: 'gray', fontSize: '14px' }}>
                        {role}
                    </div>
                </div>
                <div className='col-md-1 col-lg-1 col-2 p-1' style={{ textAlign: 'right', margin: 'auto' }}>
                    <Dropdown overlay={menu} placement="bottomRight" arrow>
                        <BsThreeDotsVertical className='clickable-icon' color='gray' size='16px'></BsThreeDotsVertical>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

export default UserCard