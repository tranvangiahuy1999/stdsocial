import React, {useEffect, useState} from 'react'
import { RiSendPlaneFill } from "react-icons/ri";
import { RiNotificationBadgeLine } from "react-icons/ri";
import axios from 'axios'
import Dropdown from 'react-dropdown';

const CreateNoti = (props) => {
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [content, setContent] = useState('')
    const [falcuty, setFalcuty] = useState([])

    const [succAlert, setSuccAlert] = useState(false)
    const [errAlert, setErrAlert] = useState(false)
    const [succ, setSucc] = useState(null)
    const [err, setErr] = useState(null)

    const [selectedOption, setSelectedOption] = useState(null)
    const token = localStorage.getItem('token')

    useEffect(async ()=> {
        const res = await axios.get(`http://${process.env.REACT_APP_IP}:3000/account/current`, {
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        })
        
        if(res && res.status === 200){
            if(res.data.code === 0){
                await setFalcuty(res.data.data.role)
            } else {
                if(res) {
                    setErr(res.data.message)
                    setErrAlert(true)
                    setTimeout(() => {setErrAlert(false)}, 3000)
                }
            }
        }
        else {
            if(res){
                setErr(res.data.message)
                setErrAlert(true)
                setTimeout(() => {setErrAlert(false)}, 3000)
            }
        }

    }, [])

    function handleChange(selectedOption) {
        setSelectedOption(selectedOption)
    }

    async function onSubmit(e) {
        e.preventDefault()
        const res = await axios.post(`http://${process.env.REACT_APP_IP}:3000/notification/add`,
        {
            'title': title,
            'content': content,
            'description': desc,
            'role': selectedOption.value
        },{
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        })

        console.log(res)

        if(res && res.status === 200){
            if(res.data.code === 0){
                setSucc(res.data.message)
                setSuccAlert(true)
                setTimeout(() => {setSuccAlert(false)}, 3000)
            } else {
                if(res){
                    setErr(res.data.message)
                    setErrAlert(true)
                    setTimeout(() => {setErrAlert(false)}, 3000)
                }
            }
        }
        else if(res.status === 401){
            setErr(res.data.message)
            setErrAlert(true)
            setTimeout(() => {setErrAlert(false)}, 3000)
        }
    }

    //huy

    return(
        <div style={{margin:'auto'}}>
            <h5 style={{color:'gray', backgroundColor:'white', textAlign:'center', padding:'5px'}}>
                CREATE NOTIFICATON<RiNotificationBadgeLine style={{marginLeft:'5px'}} size="22px" color="gray"/>
            </h5>
            <div className='fragment-body' style={{backgroundColor:'white', margin: '2px', padding:'16px'}}>
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <input className='form-control' value={title} style={{fontWeight:'bold'}} onChange={e => setTitle(e.target.value)} placeholder='Title'></input>
                    </div>
                    <div className='form-group'>
                        <input className='form-control' value={desc} onChange={e => setDesc(e.target.value)} placeholder='Description'></input>
                    </div>
                    <div className='form-group'>
                        <Dropdown options={falcuty} onChange={handleChange} value={selectedOption} placeholder="Search by falcuty" /> 
                    </div>
                    <div className='form-group'>
                        <textarea className='form-control' value={content} onChange={e => setContent(e.target.value)} placeholder='Write something here'></textarea>
                    </div>
                    <button className="btn btn-primary"><RiSendPlaneFill size='20px' color='white'></RiSendPlaneFill> Create</button>
                    <div className={(succAlert)?'alert alert-success fadeIn':'alert alert-success fadeOut'} style={{textAlign:'center'}}>{succ}</div>
                    <div className={(errAlert)?'alert alert-danger fadeIn':'alert alert-danger fadeOut'} style={{textAlign:'center'}}>{err}</div>                            
                </form>
            </div>
        </div>
    )    
}

export default CreateNoti