import React, {useState} from 'react'
import { Button, Form } from 'react-bootstrap';
import logo from '../resources/logo-tdtu.png'
import {FaGooglePlus} from 'react-icons/fa'
import {useHistory} from 'react-router-dom'

const LoginView = () => {
    const axios = require('axios');
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')

    const [err, setErr] = useState(null)
    const [alert, setAlert] = useState(false)
    
    const [checked, setChecked] = useState(false)
    let history = useHistory()

    function checkHandle() {
        setChecked(!checked)
    }
    
    async function submitHandle(e) {
        e.preventDefault();
        const res = await axios.post(`http://${process.env.REACT_APP_IP}:3000/account/login`, {
            user: user,
            password: password
        })

        if(res && res.data.code === 0){
            await localStorage.setItem('token', res.data.token)
            history.push('/home')
        }
        else {
            setErr(res.data.message)
            setAlert(true)
            setTimeout(() => {setAlert(false)}, 3000)
        }
    }
    
    function googleLogin(){

    }
        return(
            <div className="col-md-12" style={{flex: 1}}>
                <div className="img-bg d-flex justify-content-center">
                    <div className="form-container col-md-5 p-2 d-flex justify-content-center align-self-center pb-4">
                        <Form className="login-form col-md-9 p-2" onSubmit={submitHandle}>
                        <img src={logo} width="400" height="500" alt="tdtu-logo"/>
                            <h3 className="text-primary">Login with TDTSocial</h3>
                            <Form.Group className="form-group pt-3">
                                <Form.Label>Falcuty username</Form.Label>
                                <Form.Control value={user} onChange={e => setUser(e.target.value)} type="text" placeholder="Enter falcuty username" required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter password" required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Check defaultChecked={checked} onChange={checkHandle} custom label={`Remember me`}/>
                            </Form.Group>                                                        
                            <Button className="btn col-md-12 mt-3" type="submit" variant="primary">Login</Button>{' '}
                            <Button onClick={googleLogin} className="btn col-md-12 mt-2" type="button" variant="danger"><FaGooglePlus color="white" size="22px"/> Login with Google Account</Button>
                            {
                                (alert)?(
                                    <div className={(alert)?'alert alert-danger fadeIn':'alert alert-danger fadeOut'}>{err}</div>
                                ):(
                                    <div></div>
                                )
                            }
                            
                        </Form>
                    </div>
                </div>
            </div>
        )
}

export default LoginView