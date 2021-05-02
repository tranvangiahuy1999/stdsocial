import React, {useState} from 'react'
import { Button, Form } from 'react-bootstrap'
import logo from '../resources/logo-tdtu.png'
import {FaGooglePlus} from 'react-icons/fa'
import {useHistory} from 'react-router-dom'
import {connect} from 'react-redux'
import {getToken} from '../actions/index'
import useWindowDimensions from '../components/useWindowDimensions'
import { useAlert } from 'react-alert'
import { GoogleLogin } from 'react-google-login'

const LoginView = (props) => {
    const axios = require('axios');
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    
    const [checked, setChecked] = useState(false)
    const {width, height} = useWindowDimensions()    

    const alert = useAlert()
    let history = useHistory()

    function checkHandle() {
        setChecked(!checked)
    }

    const responseSuccessGoogle = (response) => {
        let emailtail = response.profileObj.email.split('@')[1]        

        if(emailtail !== 'student.tdtu.edu.vn'){
            alert.show(`Account doesn't meet require!`, {
                type: 'error'
            })
            return
        }

        axios.post(`http://${process.env.REACT_APP_IP}/api/googlelogin`,{
            tokenId: response.tokenId
        })
        .then(res => {            
            if(res.data.code === 0){
                props.getToken(res.data.token)                   
                history.push('/home')
            }
            else {
                alert.show(res.data.message, {
                    type: 'error'
                })
            }
        })
        .catch(e => {
            console.log(e)
        })
    }

    const responseErrorGoogle = (response) => {
        console.log(response);
        alert.show(`Login failed!`, {
            type: 'error'
        })
    }
    
    async function submitHandle(e) {
        e.preventDefault();

        if(user.length === 0 && password.length === 0){
            alert.show(`Dont let username and password empty!`, {
                type: 'error'
            })
            return            
        }

        axios.post(`http://${process.env.REACT_APP_IP}/account/login`, {
            user: user,
            password: password
        })
        .then(async res => {             
            if(res.data.code === 0){
                await props.getToken(res.data.token)                   
                history.push('/home')
            }
            else {
                alert.show(res.data.message, {
                    type: 'error'
                })
            }
        })
        .catch(e => {
            alert.show('Check your user or pwd!', {
                type: 'error'
            })            
        })
    }    
        return(
            <div className="col-md-12 containerr" style={{flex: 1}}>
                <div className="img-bg d-flex justify-content-center">
                    <div className= {width < 768?"form-container col-12 p-4 d-flex justify-content-center align-self-center":"form-container col-5 p-4 d-flex justify-content-center align-self-center"}>                  
                        <Form className="login-form col-10 m-5" onSubmit={submitHandle}>
                            <img className='login-img' src={logo} alt="tdtu-logo"/>
                                <h3 className="text-primary">Login with TDTSocial</h3>
                                    <Form.Group className="form-group pt-3">
                                        <Form.Label>Falcuty username</Form.Label>
                                        <Form.Control value={user} onChange={e => setUser(e.target.value)} type="text" placeholder="Enter falcuty username" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter password"/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Check defaultChecked={checked} onChange={checkHandle} custom label={`Remember me`}/>
                                    </Form.Group>                                                        
                                    <Button className="btn col-md-12 mt-2" type="submit" variant="primary">Login with TDTU Social</Button>
                                    <div style={{textAlign:'center', color:'gray', margin:'2px'}}>
                                        Or
                                    </div>
                                    <GoogleLogin
                                        clientId="173768816222-a3th16lqbckuej5epilhsnv3tg0l031q.apps.googleusercontent.com"
                                        render={renderProps => (
                                                <Button onClick={renderProps.onClick} disabled={renderProps.disabled} className="btn col-md-12 mt-2" type="button" variant="danger"><FaGooglePlus color="white" size="22px"/> Login with Google Account</Button>
                                            )}
                                        buttonText="Login"
                                        onSuccess={responseSuccessGoogle}
                                        onFailure={responseErrorGoogle}
                                        cookiePolicy={'single_host_origin'}
                                    />,
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