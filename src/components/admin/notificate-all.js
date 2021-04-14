import React, {useState} from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiFillNotification } from "react-icons/ai";
import { BiCalendar } from "react-icons/bi";

const mm = require('micromatch');

const NotiPage = (props) => {
    const [searchNotiTitle, setSearchNotiTitle] = useState('')
    const [searchNotiContent, setSearchNotiContent] = useState('')
    const [searchFalcuty, setSearchFalcuty] = useState('')
    const [startDate, setStartDate] = useState(new Date());

    function FalcutyFilter(){
        
    }

    return(
        <div style={{justifyContent:'center', padding:'15px'}}>
            <h5 style={{color:'gray', backgroundColor:'white', textAlign:'center', padding:'5px'}}>
                NOTIFICATON<AiFillNotification style={{marginLeft:'5px'}} size="23px" color="gray"/>
            </h5>
            <div className='noti-filter' style={{backgroundColor:'white', margin: '2px', padding:'4px'}}>
                <div>
                    <div className='row col-md-12 col-sm-12 p-2'>
                        <div class="form-group col-md-5 col-sm-5">
                            <label>Search by Notificate tittle</label>
                            <input className='form-control' style={{padding: '4px', width:'100%'}} placeholder='green summer .etc' value={searchNotiTitle} onChange={v => setSearchNotiTitle(v.target.value)} ></input>    
                        </div>
                        <div class="form-group col-md-5 col-sm-5">
                            <label>Search by Notificate content</label>
                            <input className='form-control' style={{padding: '4px', width:'100%'}} placeholder='hello, today i feel so good .etc' value={searchNotiContent} onChange={v => setSearchNotiContent(v.target.value)}></input>    
                        </div>
                        <div class="form-group col-md-2 col-sm-2">
                            <label>Search by Falcuty</label>
                            <input className='form-control' style={{padding: '4px', width:'100%'}} placeholder='CTHSSV, TDT Creative Language Center, .etc' value={searchFalcuty} onChange={v => setSearchFalcuty(v.target.value)}></input>
                        </div>
                    </div>
                    <div className=' row col-md-12 col-sm-12 p-2'>
                        <div class="form-group col-md-5 col-sm-5">
                            <label className='pr-4'>Search by Date<BiCalendar style={{marginLeft:'6px'}} size='20px' color='black'></BiCalendar></label>
                            <DatePicker className='form-control' selected={startDate} onChange={date => setStartDate(date)} />
                        </div>
                        <div class="form-check col-md-3 col-sm-3">                        
                            <div style={{width:'50%'}}>
                                <input className="form-check-input" type="checkbox" />
                                <label className="form-check-label">
                                    Unread
                                </label>
                            </div>
                            <div style={{width:'50%'}}>                        
                                <input className="form-check-input" type="checkbox" />
                                <label className="form-check-label">
                                    Important
                                </label>
                            </div>
                        </div>                        
                        <div class="col-md-2 col-sm-2">
                            <button className='btn btn-danger'>Delete All</button>            
                        </div> 
                        <div class="col-md-2 col-sm-2">                            
                            <button className='btn btn-primary p'>Search</button>
                        </div> 
                    </div>
                <div className='noti-list'>
                    
                </div>
            </div>
            </div>
        </div>
    )
}
export default NotiPage