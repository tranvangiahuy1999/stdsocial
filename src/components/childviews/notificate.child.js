import React, {useState, useEffect} from 'react'
import DatePicker from "react-datepicker";
import NotiCard from '../notificatecard.component'
import "react-datepicker/dist/react-datepicker.css";
import { AiFillNotification } from "react-icons/ai";
import { BiCalendar } from "react-icons/bi";
import axios from 'axios'
import { RiDeleteBin6Line, RiSendPlaneFill } from "react-icons/ri";
import Dropdown from 'react-dropdown';

//fake data import
import {notiRes} from '../../data/data'

const mm = require('micromatch');

const NotiPage = (props) => {
    const [searchNotiTitle, setSearchNotiTitle] = useState('')
    const [searchNotiContent, setSearchNotiContent] = useState('')
    const [searchFalcuty, setSearchFalcuty] = useState('')
    const [notiData, setNotiData] = useState(null)
    const [falcuty, setFalcuty] = useState([])    
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(null)
    const [startDate, setStartDate] = useState(new Date());

    const [selectedOption, setSelectedOption] = useState(null)

    const [succAlert, setSuccAlert] = useState(false)
    const [errAlert, setErrAlert] = useState(false)
    const [succ, setSucc] = useState(null)
    const [err, setErr] = useState(null)

    const token = localStorage.getItem('token')

    useEffect(async ()=> {
        //check status code
        // setNotiData(notiRes)
        const resRole = await axios.get(`http://${process.env.REACT_APP_IP}:3000/role`, {
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        })

        if(resRole && resRole.status === 200){
            if(resRole.data.code === 0){
                await setFalcuty(resRole.data.data)
            } else {
                if(resRole) {
                    setErr(resRole.data.message)
                    setErrAlert(true)
                    setTimeout(() => {setErrAlert(false)}, 3000)
                }
            }
        }
        else{
            if(resRole){
                setErr(resRole.data.message)
                setErrAlert(true)
                setTimeout(() => {setErrAlert(false)}, 3000)
            }
        }

        const resNoti = await axios.get(`http://${process.env.REACT_APP_IP}:3000/notification/${currentPage}`,{
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        })

        if(resNoti && resNoti.status === 200){
            await setNotiData(resNoti.data.data)
        }
        else {
            if(resNoti) {
                setErr(resNoti.data.message)
                setErrAlert(true)
                setTimeout(() => {setErrAlert(false)}, 3000)
            }
        }

    }, [])

    function submitFilter(e){
        e.preventDefault();

    }

    function handleChange(selectedOption) {
        setSelectedOption(selectedOption)
    }

    function CleanAll(){
        setSearchNotiTitle('')
        setSearchNotiContent('')
        setSearchFalcuty('')
        setStartDate(new Date())
    }    

    function notiClickHandle(){

    }

    return(
        <div>
            <h5 style={{color:'gray', backgroundColor:'white', textAlign:'center', padding:'5px'}}>
                NOTIFICATON<AiFillNotification style={{marginLeft:'5px'}} size="22px" color="gray"/>
            </h5>
            <div className='fragment-body' style={{backgroundColor:'white', margin: '2px', padding:'4px'}}>
                <div>
                    <form onSubmit={submitFilter}>
                        <div className='row col-12 pl-2'>
                            <div class="form-group col-4">                                
                                <input className='form-control' style={{padding: '4px', width:'100%'}} placeholder='Search by tittle' value={searchNotiTitle} onChange={v => setSearchNotiTitle(v.target.value)} ></input>    
                            </div>
                            <div class="form-group col-5">                                
                                <input className='form-control' style={{padding: '4px', width:'100%'}} placeholder='Search by content' value={searchNotiContent} onChange={v => setSearchNotiContent(v.target.value)}></input>    
                            </div>
                            <div class="form-group col-3">                            
                                <Dropdown options={falcuty} onChange={handleChange} value={selectedOption} placeholder="Search by falcuty" />                 
                            </div>
                        </div>
                        <div className=' row col-12 pl-2'>
                            <div class="form-group col-5">
                                <label className='pr-4'>Search by Date<BiCalendar style={{marginLeft:'6px'}} size='20px' color='black'></BiCalendar></label>
                                <DatePicker className='form-control' selected={startDate} onChange={date => setStartDate(date)} />
                            </div>
                            <div class="form-check col-3">                        
                                <div className='ml-2' style={{width:'50%'}}>
                                    <input className="form-check-input" type="checkbox" />
                                    <label className="form-check-label">
                                        Unread
                                    </label>
                                </div>
                                <div className='ml-2' style={{width:'50%'}}>                        
                                    <input className="form-check-input" type="checkbox" />
                                    <label className="form-check-label">
                                        Important
                                    </label>
                                </div>
                            </div>                        
                            <div class="col-2">
                                <button type='button' className='btn btn-danger m-2' style={{fontSize: '16px'}} onClick={CleanAll}><RiDeleteBin6Line size='16px' color='white'></RiDeleteBin6Line> Clean</button>            
                            </div> 
                            <div class="col-2">
                                <button type='submit' className='btn btn-primary m-2' style={{fontSize: '16px'}}><RiSendPlaneFill size='16px' color='white'></RiSendPlaneFill> Search</button>
                            </div>
                        </div>
                    </form>
                <div className='noti-list'>
                    {
                        (notiData && notiData.length > 0)?
                            notiData.map((value, index) => (
                                <NotiCard
                                    borderStyle={index%2===0?'3px solid rgba(69,190,235,255)':'3px solid gray'}
                                    backgroundStyle={index%2===0?'rgba(201,231,254,255)':'white'}
                                    notiClickHandle={notiClickHandle}
                                    falcutyname={value.role}
                                    date={value.date.split('T')[0]}
                                    title={value.title}
                                    subtitle={value.description}
                                    >
                                </NotiCard>))
                            : <div></div>
                    }
                </div>
            </div>
            </div>
        </div>
    )
}
export default NotiPage