import React, {useState, useEffect} from 'react'
import DatePicker from "react-datepicker";
import NotiCard from '../notificatecard.component'
import "react-datepicker/dist/react-datepicker.css";
import { AiFillNotification } from "react-icons/ai";
import { BiCalendar } from "react-icons/bi";

//fake data import
import {notiRes} from '../../data/data'

const mm = require('micromatch');

const NotiPage = (props) => {
    const [searchNotiTitle, setSearchNotiTitle] = useState('')
    const [searchNotiContent, setSearchNotiContent] = useState('')
    const [searchFalcuty, setSearchFalcuty] = useState('')
    const [notiData, setNotiData] = useState(null)
    const [startDate, setStartDate] = useState(new Date());

    useEffect(()=> {
        //check status code
        setNotiData(notiRes)
    })

    function submitFilter(){
        e.preventDefault();
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
        <div style={{justifyContent:'center', padding:'15px', height:'600px'}}>
            <h5 style={{color:'gray', backgroundColor:'white', textAlign:'center', padding:'5px'}}>
                NOTIFICATON<AiFillNotification style={{marginLeft:'5px'}} size="23px" color="gray"/>
            </h5>
            <div className='noti-filter' style={{backgroundColor:'white', margin: '2px', padding:'4px'}}>
                <div>
                    <form onSubmit={submitFilter}>
                        <div className='row col-12 p-2'>
                            <div class="form-group col-4">
                                <label>Search by tittle</label>
                                <input className='form-control' style={{padding: '4px', width:'100%'}} placeholder='green summer .etc' value={searchNotiTitle} onChange={v => setSearchNotiTitle(v.target.value)} ></input>    
                            </div>
                            <div class="form-group col-5">
                                <label>Search by content</label>
                                <input className='form-control' style={{padding: '4px', width:'100%'}} placeholder='hello, today i feel so good .etc' value={searchNotiContent} onChange={v => setSearchNotiContent(v.target.value)}></input>    
                            </div>
                            <div class="form-group col-3">
                                <label>Search by falcuty</label>
                                <input className='form-control' style={{padding: '4px', width:'100%'}} placeholder='CTHSSV, TDT Creative Language Center, .etc' value={searchFalcuty} onChange={v => setSearchFalcuty(v.target.value)}></input>
                            </div>
                        </div>
                        <div className=' row col-12 p-2'>
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
                                <button className='btn btn-danger m-2' onClick={CleanAll}>Clean</button>            
                            </div> 
                            <div class="col-2">                            
                                <button className='btn btn-primary m-2'>Search</button>
                            </div>
                        </div>
                    </form>
                <div className='noti-list'>
                    {
                        (notiData && notiData.data.length > 0)?
                            notiData.data.map((value, index) => (
                                <NotiCard
                                    borderStyle={index%2===0?'3px solid rgba(69,190,235,255)':'3px solid gray'}
                                    backgroundStyle={index%2===0?'rgba(201,231,254,255)':'white'}
                                    notiClickHandle={notiClickHandle}
                                    falcutyname={value.falcuty}
                                    date={value.date}
                                    title={value.title}
                                    subtitle={value.subtitle}
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