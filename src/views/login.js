import React, {useState} from 'react'
import { Form, Button } from 'react-bootstrap'
import logo from '../resources/logo-tdtu.png'
import {FaGooglePlus} from 'react-icons/fa'
import {useHistory} from 'react-router-dom'
import {connect} from 'react-redux'
import {getToken} from '../actions/index'
import useWindowDimensions from '../components/useWindowDimensions'
import { GoogleLogin } from 'react-google-login'
import {message, Checkbox } from 'antd'

const rememberme = JSON.parse(localStorage.getItem('rememberuser'))

const LoginView = (props) => {
    const axios = require('axios');
    const [user, setUser] = useState((rememberme)?rememberme.username:'')
    const [password, setPassword] = useState((rememberme)?rememberme.password:'')
    const [loginBtnState, setLoginBtnState] = useState(false)
    
    const [checked, setChecked] = useState((rememberme)?true:false)
    const {width, height} = useWindowDimensions()    
    
    let history = useHistory()

    function checkHandle() {
        setChecked(!checked)
    }

    const responseSuccessGoogle = (response) => {
        let emailtail = response.profileObj.email.split('@')[1]        

        if(emailtail !== 'student.tdtu.edu.vn'){           
            message.error('This account is not suitable!') 
            return
        }        

        axios.post(`${process.env.REACT_APP_IP}/api/googlelogin`,{
            tokenId: response.tokenId
        })
        .then(res => {                        
            if(res.data.code === 0){                                
                props.getToken(res.data.token)                   
                history.push('/home')
            }
            else {
                message.error(res.data.message)                
            }
        })
        .catch(e => {
            console.log(e)
        })
    }

    const responseErrorGoogle = (response) => {
        message.error('Something wrong with google login')    
    }
    
    async function submitHandle(e) {
        e.preventDefault();        

        if(user.length === 0 && password.length === 0){
            message.error('Dont let username and password empty!')              
            return
        }

        setLoginBtnState(true)        

        axios.post(`${process.env.REACT_APP_IP}/account/login`, {
            user: user,
            password: password
        })
        .then(async res => {       
            if(res.data.code === 0){       
                if(checked){
                    let data = {username: user, password: password}
                    localStorage.setItem('rememberuser', JSON.stringify(data))                    
                } else {
                    localStorage.setItem('rememberuser', null)                    
                }         
                await props.getToken(res.data.token)                   
                history.push('/home')
            }
            else {
                message.error(res.data.message)                 
            }
            setLoginBtnState(false)           
        })
        .catch(e => {         
            message.error('Check your username or password!')            
            setLoginBtnState(false)     
        })        
    }    
        return(
            <div className="col-md-12 containerr" style={{flex: 1}}>
                <div className="img-bg d-flex justify-content-center">
                    <div className= {width < 768?"form-container col-12 p-4 d-flex justify-content-center align-self-center":"form-container col-5 p-4 d-flex justify-content-center align-self-center"}>                  
                        <Form className="login-form col-10 m-5" onSubmit={submitHandle}>
                            <img className='login-img' src={logo} alt="tdtu-logo"/>
                                <h3 className="text-primary">Login with TDTSocial</h3>                                
                                    <div style={{color:'gray', margin:'2px', fontSize: '15px'}}>                                        
                                        Sign in to your admin or faculty account                                                                              
                                    </div>                                    
                                    <Form.Group className="form-group pt-3">
                                        <Form.Label style={{fontSize: '16px'}}>Username</Form.Label>
                                        <Form.Control style={{padding: '22px'}} value={user} onChange={e => setUser(e.target.value)} type="text" placeholder="Enter username" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label style={{fontSize: '16px'}}>Password</Form.Label>
                                        <Form.Control style={{padding: '22px'}} value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter password"/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Checkbox defaultChecked={checked} onChange={checkHandle}>Remember me</Checkbox>                                                                            
                                    </Form.Group>                                                        
                                    <Button className="btn col-md-12 mt-2" type="submit" disabled={loginBtnState}>Login with TDTSocial Account</Button>
                                    <div style={{textAlign: 'center', color:'gray', margin: '8px', fontSize: '15px'}}>  
                                        Or sign in to student account
                                    </div>                                                                                                            
                                    <GoogleLogin
                                        clientId={process.env.REACT_APP_GG_TOKEN}
                                        render={renderProps => (
                                                <Button onClick={renderProps.onClick} disabled={renderProps.disabled} className="btn col-md-12 mt-2" type="button" variant="danger"><FaGooglePlus color="white" size="22px"/> Login with Google Account</Button>
                                            )}
                                        buttonText="Login"
                                        onSuccess={responseSuccessGoogle}
                                        onFailure={responseErrorGoogle}
                                        cookiePolicy={'single_host_origin'}
                                    />
                        </Form>
                    </div>
                </div>
            </div>
        )
}

function mapDispatchToProps(dispatch) {
    return {
        getToken: token => dispatch(getToken(token)),
    };
}

export default connect(null, mapDispatchToProps)(LoginView)