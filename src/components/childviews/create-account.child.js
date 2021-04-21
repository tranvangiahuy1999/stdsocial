import React,{useEffect, useState} from 'react'
import { TiUserAdd } from "react-icons/ti";
import axios from 'axios'
import { RiSendPlaneFill } from "react-icons/ri";
import { Route, Redirect } from 'react-router-dom'

const CreateAccountPage = (props) => {
    const [username, setUsername] = useState('')
    const [pwd, setPwd] = useState('')
    const [repwd, setRePwd] = useState('')
    const [falcuty, setFalcuty] = useState(null)
    const [falcutyChoose, setFalcutyChoose] = useState([])

    const [succAlert, setSuccAlert] = useState(false)
    const [errAlert, setErrAlert] = useState(false)
    const [succ, setSucc] = useState(null)
    const [err, setErr] = useState(null)

    const token = localStorage.getItem('token')

    useEffect( async () => {
        //check status code
        const res = await axios.get(`http://${process.env.REACT_APP_IP}:3000/role`, {
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        }).catch()

        if(res) {
            if(res.status === 200){
                if(res.data.code === 0){
                    await setFalcuty(res.data.data)
                } else {
                    if(res) {
                        setErr(res.data.message)
                        setErrAlert(true)
                        setTimeout(() => {setErrAlert(false)}, 3000)
                    }
                }
            }
            else{        
                setErr(res.data.message)
                setErrAlert(true)
                setTimeout(() => {setErrAlert(false)}, 3000)        
            }
        }
    }, [])

    async function createAccount (e){
        e.preventDefault();
        if(pwd !== repwd){
            setErr(`Password and Re-password doesn't match!`)
            setErrAlert(true)
            setTimeout(() => {setErrAlert(false)}, 3000)

        } else if(falcutyChoose.length === 0) {
            setErr(`Choose on of the falcuty!`)
            setErrAlert(true)
            setTimeout(() => {setErrAlert(false)}, 3000)
        } else {
            const res = await axios.post(`http://${process.env.REACT_APP_IP}:3000/account/adduser`,
            {'user': username, 'password': pwd, 'role': falcutyChoose},
            {
                headers: {
                    'Authorization' : 'Bearer ' + token
                }
            }).catch()

            if(res && res.status === 200){
                if(res.data.code === 0){
                    setSucc('Created Successfully!')
                    setSuccAlert(true)
                    setTimeout(() => {setSuccAlert(false)}, 3000)
                } else {
                    setErr(res.data.message)
                    setErrAlert(true)
                    setTimeout(() => {setErrAlert(false)}, 3000)
                }
            }
            else {
                if(res){
                    setErr(res.data.message)
                    setErrAlert(true)
                    setTimeout(() => {setErrAlert(false)}, 3000)
                }
            }
        }
    }

    function checkHandle(e){
        let checked = e.target.checked
        let value = e.target.value

        if(checked) {
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

    return(
            <div className='child-page'>
                <h5 className='child-header'>
                    CREATE ACCOUNT<TiUserAdd style={{marginLeft:'5px'}} size="22px" color="gray"/>
                </h5>
                <div className='child-body'>
                    <div className='col-12' style={{margin:'auto'}}>
                        <form className='row' onSubmit={createAccount}>
                            <div className='col-6' style={{borderRight:'1px solid lightgray'}}>
                                <h6>Create Falcuty account</h6>
                                <div className='form-group'>
                                    <label>Username</label>
                                    <input value={username} onChange={v => setUsername(v.target.value)} className='form-control' placeholder='Enter username' required></input>
                                </div>
                                <div className='form-group'>
                                    <label>Password</label>
                                    <input type='password' value={pwd} onChange={v => setPwd(v.target.value)} className='form-control' placeholder='Enter password' required></input>
                                </div>
                                <div className='form-group'>
                                    <label>Re-enter password</label>
                                    <input type='password' value={repwd} onChange={v => setRePwd(v.target.value)} className='form-control' placeholder='Re-enter password' required></input>
                                </div>
                                <div className='form-group ml-4'>                        
                                    <input className="form-check-input" type="checkbox" required/>
                                    <label className="form-check-label">
                                        Accept to create account
                                    </label>
                                </div>
                                <button className="btn btn-primary"><RiSendPlaneFill size='20px' color='white'></RiSendPlaneFill> Create</button>                                                            
                                <div className={(succAlert)?'alert alert-success fadeIn':'alert alert-success fadeOut'} style={{textAlign:'center'}}>{succ}</div>
                                <div className={(errAlert)?'alert alert-danger fadeIn':'alert alert-danger fadeOut'} style={{textAlign:'center'}}>{err}</div>                                                                                            
                            </div>
                            <div className='selectboxmap col-6'>
                                <h6>Choose falcuty you want to add</h6>
                                <div>

                                <div className='p-2 ml-4' styles={{backgroundColor:'rgba(241,242,246,255)'}}>                   
                                    {
                                        (falcuty && falcuty.length > 0)?
                                        falcuty.map((value, index) => (
                                            <div key={index}>
                                            <input className="form-check-input" type="checkbox" value={value.nameRole} onChange={checkHandle}/>
                                                <label className="form-check-label">
                                                    {value.nameRole}
                                                </label>
                                            </div>
                                        )):
                                        <div>No falcuty has shown</div>
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