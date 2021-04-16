import React,{useEffect, useState} from 'react'
import { TiUserAdd } from "react-icons/ti";

const CreateAccountPage = (props) => {
    const [username, setUsername] = useState('')
    const [pwd, setPwd] = useState('')
    const [repwd, setRePwd] = useState('')
    const [err, setErr] = useState('')

    useEffect(() => {
        //check status code
    })

    function createAccount(e){
        e.preventDefault();
        if(pwd === repwd){

        } else {
            setErr(`Password and Re-password doesn't match!`)
            setTimeout(() => {setErr('')}, 3000)
        }
    }

    return(
            <div style={{justifyContent:'center', padding:'15px', height:'600px'}}>
                <h5 style={{color:'gray', backgroundColor:'white', textAlign:'center', padding:'5px'}}>
                    Create Account<TiUserAdd style={{marginLeft:'5px'}} size="23px" color="gray"/>
                </h5>
                <div className='row'>
                    <div className='col-md-6 col-12'>
                        <form onSubmit={createAccount} style={{margin: '4px', padding: '10px', backgroundColor:'white'}}>
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
                            {
                                (err && err.length > 0)?
                                <div className='alert alert-danger'>{err}</div>:
                                <div></div>
                            }
                            <button className="btn btn-primary">Create</button>
                        </form>
                    </div>
                    <div className='col-md-6 col-12'>
                        <div style={{margin: '4px', padding: '10px', backgroundColor:'white'}}>
                            <h6>Find Falcuty account</h6>

                        </div>
                    </div>
                </div>
            </div>
    )
}

export default CreateAccountPage