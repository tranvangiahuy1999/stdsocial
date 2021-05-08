import React,{useEffect, useState} from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useRouteMatch,
    useHistory,
    Link
} from 'react-router-dom'

import { Checkbox, Space, Spin } from 'antd';
import axios from 'axios'
import AccManagerPage from './account-manager.child'
import { RiSendPlaneFill } from "react-icons/ri";
import {connect} from 'react-redux'
import {useAlert} from 'react-alert'


const CreateAccountPage = (props) => {
    const [username, setUsername] = useState('')
    const [pwd, setPwd] = useState('')
    const [repwd, setRePwd] = useState('')
    const [falcuty, setFalcuty] = useState(null)
    const [falcutyChoose, setFalcutyChoose] = useState([])

    const [btnState, setBtnState] = useState(false)

    const [loading, setLoading] = useState(true)

    const {path, url} = useRouteMatch()    

    const alert = useAlert() 

    const history = useHistory()

    useEffect( async () => {
        //check status code
        getRole()
    }, [])

    async function getRole(){
        await axios.get(`${process.env.REACT_APP_IP}/role`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res =>{
            if(res.data.code === 0){
                setFalcuty(res.data.data)
            } else {
                alert.show(res.data.message, {
                    type: 'error'
                })                
            }
        })
        .catch(e => {
            console.error(e)
            // if(e.response.status===401){
            //     await props.logOut()
            //     history.push('/login')
            // }
        })
        setLoading(false)
    }

    async function createAccount (e){
        e.preventDefault();        

        if(pwd !== repwd){
            alert.show(`Password and Re-password doesn't match!`, {
                type: 'error'
            })            

        } else if(falcutyChoose.length === 0) {
            alert.show(`Choose one of the falcuty!`, {
                type: 'error'
            })            
            
        } else {
            setBtnState(true)

            await axios.post(`${process.env.REACT_APP_IP}/admin/adduser`,
            {'user': username, 'password': pwd, 'faculty': falcutyChoose},
            {
                headers: {
                    'Authorization' : 'Bearer ' + props.token
                }
            })
            .then(res => {                
                if(res.data.code === 0){                    
                    alert.show('Create successfully!', {
                        type:'success'
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
            })
            .catch( e => {
                console.error(e)
                // if(e.response.status===401){
                //     await props.logOut()
                //     history.push('/login')
                // }                
            })
        }
        setBtnState(false)
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
        <Router>
            <Switch>
                <Route path={`${path}`} exact>
                    <div className='child-page'>
                        <h5 className='child-header'>
                            CREATE ACCOUNT
                        </h5>
                        <div className='child-body'>                            
                            <div className='col-12' style={{margin:'auto'}}>                                
                                <form className='row' onSubmit={createAccount}>
                                    <div className='col-6' style={{borderRight:'1px solid lightgray'}}>
                                        <h6>Create Faculty account</h6>
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
                                        <div className='form-group'>
                                            <button disabled={btnState} className="btn btn-primary"><RiSendPlaneFill size='16px' color='white'></RiSendPlaneFill> Create</button>                                            
                                        </div>
                                        <div className='form-group'>
                                            <div>Head to <Link className='link' to={`${url}/accountmanager`}>Account manager</Link></div>                                     
                                        </div>

                                    </div>
                                    <div className='col-6 selectboxmap'>
                                        <h6>Choose faculty you want to add</h6>
                                        <div>
                                            <div className='p-2 ml-4' styles={{backgroundColor:'rgba(241,242,246,255)'}}>                                        
                                                {
                                                    (loading)?(
                                                        <div style={{textAlign:'center'}}>
                                                            <Space size="middle" style={{marginTop:'100px'}}>
                                                                <Spin size='large'/>
                                                            </Space>
                                                        </div>
                                                    ):(
                                                        (falcuty && falcuty.length > 0)?
                                                        falcuty.map((value, index) => (
                                                            <div key={index}>
                                                                <Checkbox onChange={checkHandle} value={value.nameRole}>{value.nameRole}</Checkbox>                                                        
                                                            </div>
                                                        )):
                                                        <div>No falcuty has shown</div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Route>
                <Route path={`${path}/accountmanager`}>
                    <AccManagerPage link={<div style={{margin: '4px'}}>Can't find one? <Link className='link' to={`${url}`}>Create account</Link></div>}></AccManagerPage>
                </Route>
            </Switch>
        </Router>
    )
}

function mapStateToProps(state) {
    return {
        token: state.token
    };
}

function mapDispatchToProps(dispatch) {
    return {        
        logOut: () => dispatch({type: 'LOGOUT'}),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountPage)