import React, {useState, useEffect} from 'react'
import DatePicker from "react-datepicker";
import NotiCard from '../notificatecard.component'
import "react-datepicker/dist/react-datepicker.css";
import { BiCalendar } from "react-icons/bi";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import { RiDeleteBin6Line, RiSendPlaneFill, RiNotificationBadgeFill } from "react-icons/ri";
import axios from 'axios'

import Dropdown from 'react-dropdown';
import NotiReader from './noti-reader.child'

const mm = require('micromatch');

const NotiPage = (props) => {
    const [searchNotiTitle, setSearchNotiTitle] = useState('')
    const [searchFalcuty, setSearchFalcuty] = useState('')
    const [notiData, setNotiData] = useState(null)
    const [falcuty, setFalcuty] = useState([])
    const [startDate, setStartDate] = useState('');

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(null)
    const [paging, setPaging] = useState([])

    const [read, setRead] = useState(false)
    const [reading, setReading] = useState(null)

    const [selectedOption, setSelectedOption] = useState(null)

    const [succAlert, setSuccAlert] = useState(false)
    const [errAlert, setErrAlert] = useState(false)
    const [succ, setSucc] = useState(null)
    const [err, setErr] = useState(null)

    const token = localStorage.getItem('token')

    useEffect(async ()=> {        
        await getRole()
        await getPage(currentPage)
    }, [])

    async function submitFilter(e){
        e.preventDefault();
        let res = null
        if(selectedOption && selectedOption.value !== 'All'){
            await setSearchFalcuty(selectedOption.value)
        }

        console.log(`http://${process.env.REACT_APP_IP}:3000/notification/falcuty/${searchFalcuty}`)

        if(searchNotiTitle.length > 0 || searchFalcuty.length > 0 || startDate.length > 0){
            if(searchNotiTitle.length > 0 && searchFalcuty.length > 0 && startDate.length > 0){
                res = await axios.get(`http://${process.env.REACT_APP_IP}:3000/notification/search/${searchNotiTitle}/${searchFalcuty}/${startDate}/${startDate}`, {
                    headers : {
                        'Authorization' : 'Bearer ' + token
                    }
                }).catch()
            }
            else if(searchNotiTitle.length > 0) {
                if(searchFalcuty.length > 0 ){
                    res = await axios.get(`http://${process.env.REACT_APP_IP}:3000/notification/search/${searchNotiTitle}/${searchFalcuty}`, {
                        headers:{
                            'Authorization' : 'Bearer ' + token
                        }
                    }).catch()
                } else if(startDate.length > 0){
                    res = await axios.get(`http://${process.env.REACT_APP_IP}:3000/notification/title-date/${searchNotiTitle}/${startDate}/${startDate}`, {
                        headers:{
                            'Authorization' : 'Bearer ' + token
                        }
                    }).catch()
                } else {
                    res = await axios.get(`http://${process.env.REACT_APP_IP}:3000/notification/search/${searchNotiTitle}`, {
                        headers:{
                            'Authorization' : 'Bearer ' + token
                        }
                    }).catch()
                }
            }
            else if(searchFalcuty.length > 0){
                if(startDate.length > 0){
                    res = await axios.get(`http://${process.env.REACT_APP_IP}:3000/notification/role-date/${searchFalcuty}/${startDate}/${startDate}`, {
                        headers:{
                            'Authorization' : 'Bearer ' + token
                        }
                    }).catch()
                } else {
                    res = await axios.get(`http://${process.env.REACT_APP_IP}:3000/notification/faculty/${searchFalcuty}`, {
                        headers:{
                            'Authorization' : 'Bearer ' + token
                        }
                    }).catch()
                }
            }
            else {
                res = await axios.get(`http://${process.env.REACT_APP_IP}:3000/notification/dateSort/${startDate}/${startDate}`, {
                        headers:{
                            'Authorization' : 'Bearer ' + token
                        }
                    }).catch()
            }
        } else {
            getPage(1)
        }

        if(res) {
            if(res.status === 200){
                if(res.data.code === 0){
                    await setNotiData(res.data.data)
                } else {                    
                    setErr(res.data.message)
                    setErrAlert(true)
                    setTimeout(() => {setErrAlert(false)}, 3000)                    
                }
            }
            else{                         
                setErr(res.data.message)
                setErrAlert(true)
                setTimeout(() => {setErrAlert(false)}, 3000)            
            }
        }
    }

    function handleChange(selectedOption) {
        setSelectedOption(selectedOption)
    }

    function cleanAll() {
        setSearchNotiTitle('')
        setStartDate('')
    }

    async function getRole(){
        const resRole = await axios.get(`http://${process.env.REACT_APP_IP}:3000/role`, {
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        }).catch()

        if(resRole) {
            if(resRole.status === 200){
                if(resRole.data.code === 0){
                    let array = ['All']
                    await resRole.data.data.map((value) => {array.push(value.nameRole)})
                    await setFalcuty(array)                    
                } else {                    
                    setErr(resRole.data.message)
                    setErrAlert(true)
                    setTimeout(() => {setErrAlert(false)}, 3000)                    
                }
            }
            else{                         
                setErr(resRole.data.message)
                setErrAlert(true)
                setTimeout(() => {setErrAlert(false)}, 3000)            
            }
        }
    }

    async function getPage(pageRequest){
        const resNoti = await axios.get(`http://${process.env.REACT_APP_IP}:3000/notification/page/${pageRequest}`,{
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        }).catch()

        if(resNoti && resNoti.status === 200){
            await setNotiData(resNoti.data.data)
            await setTotalPage(resNoti.data.total)
            await setCurrentPage(pageRequest)        

            let pagingtemp = []
            
            for(let i = pageRequest; i <= ((pageRequest+4 > resNoti.data.total)?resNoti.data.total:pageRequest+4); i++){
                await pagingtemp.push(i)                
            }            
            await setPaging(pagingtemp)
        }
        else {
            if(resNoti) {
                setErr(resNoti.data.message)
                setErrAlert(true)
                setTimeout(() => {setErrAlert(false)}, 3000)
            }
        }
    }

    async function notiClickHandle(obj) {
        setReading(obj)
        setRead(true)
    }

    async function pagingHandle(pageRequest) {
        if(pageRequest >= 1 && pageRequest <= totalPage){            
            await getPage(pageRequest)
        }
    }

    return(
        (read && reading)?(
            <NotiReader
                title={reading.title}
                falcuty={reading.role}
                back={() => setRead(false)}
                date={reading.date.split('T')[0]}
                content={reading.content}
            ></NotiReader>
        ):
        (<div className='child-page'>
            <h5 className='child-header'>
                NOTIFICATON<RiNotificationBadgeFill style={{marginLeft:'5px'}} size="22px" color="gray"/>
            </h5>
            <div className='child-body'>
                <div>
                    <form onSubmit={submitFilter}>
                        <div className='row col-12 pl-2'>
                            <div class="form-group col-7">                                
                                <input className='form-control' style={{padding: '4px', width:'100%'}} placeholder='Search by tittle' value={searchNotiTitle} onChange={v => setSearchNotiTitle(v.target.value)} ></input>    
                            </div>
                            <div class="form-group col-5">                                
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
                                <button type='button' className='btn btn-danger m-2' style={{fontSize: '16px'}} onClick={cleanAll}><RiDeleteBin6Line size='16px' color='white'></RiDeleteBin6Line> Clean</button>            
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
                                    key={value._id}                             
                                    borderStyle={index%2===0?'3px solid rgba(69,190,235,255)':'3px solid gray'}
                                    backgroundStyle={index%2===0?'rgba(201,231,254,255)':'white'}
                                    notiClickHandle={() => notiClickHandle(value)}
                                    falcutyname={value.role}
                                    date={value.date.split('T')[0]}
                                    title={value.title}
                                    subtitle={value.description}
                                    >
                                </NotiCard>))
                            : <div></div>
                    }
                </div>
                <div className='paging'>
                    <div className='row ml-2 paging-wrapper'>                                        
                        <div>
                            <button disabled={(currentPage === 1)?true:false} onClick={() => pagingHandle(1)}><FiSkipBack color='black' size='16px'></FiSkipBack></button>
                            <button disabled={(currentPage === 1)?true:false} onClick={() => pagingHandle(currentPage - 1)}><GrFormPrevious color='black' size='16px'></GrFormPrevious></button>
                        </div>                         
                        
                        {
                            paging.map((value, index) => (                            
                                <button key={index} style={{color: (value===currentPage)?'rgb(2, 117, 216)':'', borderRadius: (value===currentPage)?'6px':'', backgroundColor: (value===currentPage)?'lightgray':''}} onClick={()=>pagingHandle(value)}>{value}</button>
                            ))
                        }                
                      
                        <div>
                            <button disabled={(currentPage === totalPage)?true:false} onClick={() => pagingHandle(currentPage + 1)}><GrFormNext color='black' size='16px'></GrFormNext></button>
                            <button disabled={(currentPage === totalPage)?true:false} onClick={() => pagingHandle(totalPage)}><FiSkipForward color='black' size='16px'></FiSkipForward></button>
                        </div>                            
                        <div className='paging-text' >Page <span>{currentPage}</span> of {totalPage} pages</div>                        
                    </div>
                </div>
            </div>
            </div>
        </div>)
    )
}
export default NotiPage