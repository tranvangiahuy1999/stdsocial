import React, { useEffect, useState } from 'react'
import {
    useRouteMatch,
    useHistory,
} from 'react-router-dom'

import { Checkbox, Space, Spin } from 'antd';
import axiosInstance from '../../api/service';
import { RiUserAddLine, RiUserSettingsLine } from "react-icons/ri";
import { connect } from 'react-redux'
import { useAlert } from 'react-alert'


const CreateAccountPage = (props) => {
    const [username, setUsername] = useState('')
    const [pwd, setPwd] = useState('')
    const [repwd, setRePwd] = useState('')
    const [falcuty, setFalcuty] = useState(null)
    const [falcutyChoose, setFalcutyChoose] = useState([])
    const [btnState, setBtnState] = useState(false)
    const [loading, setLoading] = useState(true)
    const { url } = useRouteMatch()
    const alert = useAlert()
    const history = useHistory()

    useEffect(async () => {
        //check status code
        getRole()
        window.scrollTo(0, 0)
    }, [])

    async function getRole() {
        await axiosInstance.get(`/role`)
            .then(res => {
                if (res.data.code === 0) {
                    setFalcuty(res.data.data)
                } else {
                    alert.show(res.data.message, {
                        type: 'error'
                    })
                }
            })
            .catch(e => {
                console.error(e);
            })
        setLoading(false)
    }

    function createAccount(e) {
        e.preventDefault();

        if (pwd !== repwd) {
            alert.show(`Password and Re-password doesn't match!`, {
                type: 'error'
            })

        } else if (falcutyChoose.length === 0) {
            alert.show(`Choose one of the falcuty!`, {
                type: 'error'
            })

        } else {
            setBtnState(true)
            const body = { 'user': username, 'password': pwd, 'faculty': falcutyChoose };
            axiosInstance.post(`/admin/adduser`, body)
                .then(res => {
                    if (res.data.code === 0) {
                        alert.show('Create successfully!', {
                            type: 'success'
                        })

                        setUsername('')
                        setPwd('')
                        setRePwd('')
                        setFalcutyChoose([])

                    } else {
                        alert.show(res.data.message, {
                            type: 'error'
                        })
                    }
                    setBtnState(false)
                })
                .catch(e => {
                    setBtnState(false)
                    console.error(e)
                })
        }        
    }

    function checkHandle(e) {
        let checked = e.target.checked
        let value = e.target.value

        if (checked) {
            setFalcutyChoose([...falcutyChoose, value])
        }
        else {
            var index = falcutyChoose.indexOf(value)
            if (index > -1) {
                falcutyChoose.splice(index, 1);
                setFalcutyChoose(falcutyChoose)
            }
        }
    }

    return (
        <div className='child-page'>
            <h5 className='child-header'>
                CREATE ACCOUNT
                <div style={{ textAlign: 'right' }}>
                    <button className='m-1 p-1 direct-btn' onClick={() => history.push(`${url}/accountmanager`)} style={{ borderRadius: '25px', fontSize: '16px', position: 'relative' }}><RiUserSettingsLine size='18px'></RiUserSettingsLine> User management</button>
                </div>
            </h5>
            <div className='child-body'>
                <div className='col-12' style={{ margin: 'auto' }}>
                    <form className='row' onSubmit={createAccount}>
                        <div className='col-6' style={{ borderRight: '1px solid lightgray' }}>
                            <h6>Create faculty account</h6>
                            <div className='form-group'>
                                <label>Username</label>
                                <input autoComplete="off" value={username} onChange={v => setUsername(v.target.value)} className='form-control' placeholder='Enter username' required></input>
                            </div>
                            <div className='form-group'>
                                <label>Password</label>
                                <input autoComplete="off" type='password' value={pwd} onChange={v => setPwd(v.target.value)} className='form-control' placeholder='Enter password' required></input>
                            </div>
                            <div className='form-group'>
                                <label>Re-enter password</label>
                                <input autoComplete="off" type='password' value={repwd} onChange={v => setRePwd(v.target.value)} className='form-control' placeholder='Re-enter password' required></input>
                            </div>
                            <div className='form-group'>
                                <button disabled={btnState} className="btn btn-primary"><RiUserAddLine size='16px' color='white'></RiUserAddLine> Create</button>
                            </div>
                        </div>
                        <div className='col-6'>
                            <h6>Choose faculty you want to add</h6>
                            <div className='selectboxmap'>
                                <div className='p-2 ml-4' styles={{ backgroundColor: 'rgba(241,242,246,255)' }}>
                                    {
                                        (loading) ? (
                                            <div style={{ textAlign: 'center' }}>
                                                <Space size="middle" style={{ marginTop: '100px' }}>
                                                    <Spin size='large' />
                                                </Space>
                                            </div>
                                        ) : (
                                            (falcuty && falcuty.length > 0) ?
                                                falcuty.map((value, index) => (
                                                    <div key={index}>
                                                        <Checkbox onChange={checkHandle} value={value.nameRole}>{value.nameRole}</Checkbox>
                                                    </div>
                                                )) :
                                                <div>No faculty has shown</div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateAccountPage