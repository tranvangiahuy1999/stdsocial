import React, {useState, useEffect} from 'react'
import {
    Form,
    Button,    
    Select,  
    DatePicker,
    Input
  } from 'antd';
import {connect} from 'react-redux'
import logo from '../resources/logo-tdtu.png'
import axios from 'axios'
import useWindowDimensions from '../components/useWindowDimensions'
import { useAlert } from 'react-alert'
import {useHistory} from 'react-router-dom'
import {getToken} from '../actions/index'

const RegisterPage = (props) => {
    const {width, height} = useWindowDimensions()
    const alert = useAlert()
    const history = useHistory()

    const [componentSize, setComponentSize] = useState('default');
    const [falcutyData, setFalcutyData] = useState(null)
    
    const [faculty, setFaculty] = useState()
    const [datetime, setDatetime] = useState()
    const [gender, setGender] = useState('male')
    const [phone, setPhone] = useState('')
    const [btnState, setBtnState] = useState(false)

    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };

    useEffect(() => {
        getRole()
    },[])

    async function getRole(){
        await axios.get(`${process.env.REACT_APP_IP}/role`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(async res =>{            
            if(res.data.code === 0){
                await setFalcutyData(res.data.data)                
            } else {
                alert.show(res.data.message, {
                    type: 'error'
                })                
            }
        })
        .catch( e => {
            console.error(e)
            if(e.response.status === 401){
                props.logOut()
                history.push('/login')
            }
        })
    }

    function submitHandle(e){
        e.preventDefault();

        if(!faculty){
            alert.show('Please choose your faculty', {
                type:'error'
            })
            return
        }

        let now = new Date()
        let yearnow = now.getFullYear()
        if(yearnow - datetime.split('-')[0] < 15){
            alert.show('Your age is not suitable', {
                type:'error'
            })
            return
        }

        setBtnState(true)        

        axios.put(`${process.env.REACT_APP_IP}/account/update/user`,{
            faculty: faculty,
            birth: datetime,
            phone: phone,
            gender: gender
        }, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }            
        })
        .then(res => {            
            if(res.data.code === 0){
                props.getToken(res.data.token)
                alert.show(res.data.message + '. Đang chuyển hướng...', {
                    type:'success'
                })                
                setTimeout(()=> {
                    history.push('/home')
                }, 3000)                
            }
            else {
                alert.show(res.data.message, {
                    type:'error'
                })            
            }            
        })
        .catch( e => {
            alert.show('something wrong',{
                type:'error'
            })
            if(e.response.status === 401){
                props.logOut()
                history.push('/login')
            }          
        })
        setBtnState(false)
    }
    return(
        <div className="col-md-12 containerr" style={{flex: 1}}>
                <div className="img-bg d-flex justify-content-center">
                    <div className= {width < 768?"form-container col-12 p-4 m-2 d-flex justify-content-center align-self-center":"form-container col-5 p-4 m-2 d-flex justify-content-center align-self-center"}>                  
                        <Form className="login-form col-10 m-5"
                            labelCol={{
                                span: 10,
                            }}
                            wrapperCol={{
                                span: 14,
                            }}
                            layout="horizontal"
                            initialValues={{
                                size: componentSize,
                            }}
                            onValuesChange={onFormLayoutChange}
                            size={componentSize}                            
                            >
                            <img className='login-img' src={logo} alt="tdtu-logo"/>
                            <h3 className="text-primary">Setup student information</h3>                                              
                            <Form.Item label="Select your faculty:">
                                <Select className='form-control' placeholder='Faculty' onChange={value => setFaculty(value)}>
                                    {
                                        (falcutyData && falcutyData.length > 0)?(
                                            falcutyData.map((value, index) => (                                                
                                                (value.nameRole.split(' ')[0] === 'Khoa') && (
                                                    <Select.Option key={index} value={value.nameRole}>{value.nameRole}</Select.Option>
                                                )
                                                                                           
                                            ))
                                        ):(
                                            <></>
                                        )
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item label="Day of birth:">
                                <DatePicker className='form-control' onChange={(date, dateString) => {setDatetime(dateString)}}></DatePicker>
                            </Form.Item>

                            <Form.Item label="Gender:">
                                <Select className='mr-2' defaultValue='male' onChange={(value) => setGender(value)}>
                                    <Select.Option value="male">Male</Select.Option>
                                    <Select.Option value="female">Female</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Phone number:">
                                <Input type='tel' placeholder='+090' value={phone} onChange={(e) => setPhone(e.target.value)}/>
                            </Form.Item>                                                                                
                            <Button type="primary" loading={btnState} onClick={submitHandle} style={{float:'right'}}>Register</Button>                                                     
                        </Form>
                    </div>
                </div>
            </div>
    )
}

function mapStateToProps(state) {
    return {
        token: state.token
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getToken: token => dispatch(getToken(token)),
        logOut: () => dispatch({type: 'LOGOUT'}),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage)