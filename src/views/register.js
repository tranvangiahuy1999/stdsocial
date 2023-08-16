import React, { useState, useEffect } from 'react'
import {
    Form,
    Button,
    Select,
    DatePicker,
    Input
} from 'antd';
import logo from '../resources/logo-tdtu.png'
import axiosInstance from '../api/service';
import useWindowDimensions from '../components/useWindowDimensions'
import { useAlert } from 'react-alert'
import { useHistory } from 'react-router-dom'

const RegisterPage = () => {
    const { width } = useWindowDimensions()
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
    }, [])

    function getRole() {
        axiosInstance.get(`/role`)
            .then(res => {
                if (res.data.code === 0) {
                    setFalcutyData(res.data.data)
                } else {
                    alert.show(res.data.message, {
                        type: 'error'
                    })
                }
            })
            .catch(e => {
                if (e.response.status === 401) {
                    sessionStorage.removeItem("token")
                    history.push('/login')
                }
            })
    }

    function submitHandle(e) {
        e.preventDefault();

        if (!faculty) {
            alert.show('Please choose your faculty', {
                type: 'error'
            })
            return
        }

        let now = new Date()
        let yearnow = now.getFullYear()
        if (yearnow - datetime.split('-')[0] < 15) {
            alert.show('Your age is not suitable', {
                type: 'error'
            })
            return
        }

        setBtnState(true)
        const body = {
            faculty: faculty,
            birth: datetime,
            phone: phone,
            gender: gender
        }
        axiosInstance.put(`/account/update/user`, body)
            .then(res => {
                if (res.data.code === 0) {
                    sessionStorage.setItem("token", res.data.token)
                    alert.show(res.data.message + '. Đang chuyển hướng...', {
                        type: 'success'
                    })
                    setTimeout(() => {
                        history.push('/home')
                    }, 3000)
                }
                else {
                    alert.show(res.data.message, {
                        type: 'error'
                    })
                }
                setBtnState(false)
            })
            .catch(e => {
                setBtnState(false)
                alert.show('something wrong', {
                    type: 'error'
                })
                if (e.response.status === 401) {
                    sessionStorage.removeItem("token");
                    history.push('/login')
                }
            })        
    }
    return (
        <div className="col-md-12 containerr" style={{ flex: 1 }}>
            <div className="img-bg d-flex justify-content-center">
                <div className={width < 768 ? "form-container col-12 p-4 m-2 d-flex justify-content-center align-self-center" : "form-container col-5 p-4 m-2 d-flex justify-content-center align-self-center"}>
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
                        <img className='login-img' src={logo} alt="tdtu-logo" />
                        <h3 className="text-primary">Setup student information</h3>
                        <Form.Item label="Select your faculty:">
                            <Select className='form-control' placeholder='Faculty' onChange={value => setFaculty(value)}>
                                {
                                    (falcutyData && falcutyData.length > 0) ? (
                                        falcutyData.map((value, index) => <Select.Option key={index} value={value._id}>{value.nameRole}</Select.Option>)
                                    ) : <></>
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item label="Day of birth:">
                            <DatePicker className='form-control' onChange={(date, dateString) => { setDatetime(dateString) }}></DatePicker>
                        </Form.Item>

                        <Form.Item label="Gender:">
                            <Select className='mr-2' defaultValue='male' onChange={(value) => setGender(value)}>
                                <Select.Option value="male">Male</Select.Option>
                                <Select.Option value="female">Female</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Phone number:">
                            <Input type='tel' placeholder='+090' value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </Form.Item>
                        <Button type="primary" loading={btnState} onClick={submitHandle} style={{ float: 'right' }}>Register</Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage