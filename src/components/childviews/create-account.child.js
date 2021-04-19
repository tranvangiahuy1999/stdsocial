import React,{useEffect, useState} from 'react'
import { TiUserAdd } from "react-icons/ti";
import axios from 'axios'
import { RiSendPlaneFill } from "react-icons/ri";
import {useHistory} from 'react-router-dom'

const CreateAccountPage = (props) => {
    const [username, setUsername] = useState('')
    const [pwd, setPwd] = useState('')
    const [repwd, setRePwd] = useState('')
    const [falcuty, setFalcuty] = useState(null)
    const [falcutyChoose, setFalcutyChoose] = useState([])
    const [err, setErr] = useState(null)
    const [succ, setSucc] = useState(null)
    const token = localStorage.getItem('token')
    let history = useHistory()

    useEffect( async () => {
        //check status code
        const res = await axios.get(`http://${process.env.REACT_APP_IP}:3000/role`, {
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        })

        console.log(res)

        if(res && res.status === 200){
            if(res.data.code === 0){
                await setFalcuty(res.data.data)
            } else {
                if(res) {
                    setErr(res.data.message)
                    setTimeout(() => {setErr('')}, 3000)
                }
            }
        }
        else{
            if(res){
                setErr(res.data.message)
                setTimeout(()=>{setErr('')}, 3000)
            }
        }
    }, [])

    async function createAccount (e){
        e.preventDefault();
        if(pwd !== repwd){
            setErr(`Password and Re-password doesn't match!`)
            setTimeout(() => {setErr('')}, 3000)
        } else if(falcutyChoose.length === 0) {
            setErr(`Choose on of the falcuty!`)
            setTimeout(() => {setErr('')}, 3000)
        } else {
            const res = await axios.post(`http://${process.env.REACT_APP_IP}:3000/account/adduser`,
            {'user': username, 'password': pwd, 'role': falcutyChoose},
            {
                headers: {
                    'Authorization' : 'Bearer ' + token
                }
            })

            if(res && res.status === 200){
                if(res.data.code === 0){
                    setSucc('Created Successfully!')
                    setTimeout(() => {setSucc('')}, 3000)
                } else {
                    setErr(res.data.message)
                    setTimeout(() => {setErr('')}, 3000)
                }
            }
            else {
                if(res){
                    setErr(res.data.message)
                    setTimeout(()=>{setErr('')}, 3000)
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
            <div style={{justifyContent:'center', padding:'15px', paddingTop:'46px'}}>
                <h5 style={{color:'gray', backgroundColor:'white', textAlign:'center', padding:'5px'}}>
                    Create Account<TiUserAdd style={{marginLeft:'5px'}} size="23px" color="gray"/>
                </h5>
                <div>
                    <div className='col-12' style={{margin:'auto'}}>
                        <form className='row' onSubmit={createAccount} style={{padding: '10px', backgroundColor:'white'}}>
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
                                <div className='pt-2'>
                                    <div className={(succ && succ.length > 0)?'alert alert-success fadeIn':'alert alert-success fadeOut'} style={{textAlign:'center'}}>{succ}</div>
                                    <div className={(err && err.length > 0)?'alert alert-danger fadeIn':'alert alert-danger fadeOut'} style={{textAlign:'center'}}>{err}</div>
                                </div>                             
                            </div>
                            <div className='col-6'>
                                <h6>Choose falcuty you want to add</h6>
                                <div className='p-2 ml-4' styles={{ height: '400px', overflowY: 'scroll', backgroundColor:'rgba(241,242,246,255)'}}>                        
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
                        </form>
                    </div>
                </div>
            </div>
    )
}

export default CreateAccountPage