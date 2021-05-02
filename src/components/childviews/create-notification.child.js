import React, {useEffect, useState} from 'react'
import { RiSendPlaneFill } from "react-icons/ri";
import axios from 'axios'
import Dropdown from 'react-dropdown';
import {connect} from 'react-redux'
import {useAlert} from 'react-alert'

const CreateNoti = (props) => {
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [content, setContent] = useState('')
    const [falcuty, setFalcuty] = useState([])

    const alert = useAlert() 

    const [selectedOption, setSelectedOption] = useState(null)

    useEffect(async ()=> {
        await axios.get(`http://${process.env.REACT_APP_IP}/account/current`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(async res => {
            console.log(res)
            if(res.data.code === 0){
                if(Array.isArray(res.data.data.faculty)) {
                    await setFalcuty(res.data.data.faculty)
                }
            } else {
                alert.show(res.data.message, {
                    type: 'error'
                })
            }
        })
        .catch(e => {
            console.error(e)
        })
        
    }, [])

    function handleChange(selectedOption) {
        setSelectedOption(selectedOption)
    }

    async function onSubmit(e) {
        e.preventDefault()
        if(selectedOption){
            await axios.post(`http://${process.env.REACT_APP_IP}/notification/add`,
            {
                'title': title,
                'content': content,
                'description': desc,
                'role': selectedOption.value
            },{
                headers: {
                    'Authorization' : 'Bearer ' + props.token
                }
            })
            .then(async res => {
                if(res.data.code === 0){
                    alert.show(res.data.message, {
                        type:'success'
                    })                    

                } else {                
                    alert.show(res.data.message, {
                        type: 'error'
                    })

                }
            })
            .catch(e => {
                console.error(e)
            })
        }
        else {
            alert.show(`Please pick one of the faculty`, {
                type: 'error'
            })        
        }
    }

    return(
        <div className='child-page'>
            <h5 className='child-header'>
                POST NOTIFICATON
            </h5>
            <div className='child-body'>
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
                        <textarea className='form-control' rows='6' value={content} onChange={e => setContent(e.target.value)} placeholder='Write something here'></textarea>
                    </div>
                    <button className="btn btn-primary"><RiSendPlaneFill size='16px' color='white'></RiSendPlaneFill> Post</button>                    
                                            
                </form>
            </div>
        </div>
    )    
}

function mapStateToProps(state) {
    return {
        token: state.token
    };
}

export default connect(mapStateToProps)(CreateNoti)