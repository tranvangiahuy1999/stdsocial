import React, {useState} from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NotiPage = (props) => {
    const [searchNotiTitle, setSearchNotiTitle] = useState('')
    const [searchNotiContent, setSearchNotiContent] = useState('')
    const [searchFalcuty, setSearchFalcuty] = useState('')
    const [startDate, setStartDate] = useState(new Date());

    return(
        <div style={{justifyContent:'center', padding:'10px'}}>
            <div style={{color:'gray', backgroundColor:'white', textAlign:'center'}}>
            NOTIFICATON
            </div>
            <div style={{backgroundColor:'white', margin: '5px', padding:'5px'}}>
                <div className='noti-filter'>
                    <div className='row col-md-12 col-sm-12 p-2'>
                        <div class="col-md-5 col-sm-5">
                            <input style={{padding: '4px', width:'100%'}} placeholder='Search by notificate tittle' value={searchNotiTitle} onChange={v => setSearchNotiTitle(v.target.value)} ></input>    
                        </div>
                        <div class="col-md-5 col-sm-5">
                            <input style={{padding: '4px', width:'100%'}} placeholder='Search by notificate content' value={searchNotiContent} onChange={v => setSearchNotiContent(v.target.value)}></input>    
                        </div>
                        <div class="col-md-2 col-sm-2">
                            <input style={{padding: '4px', width:'100%'}} placeholder='Search by falcuty' value={searchFalcuty} onChange={v => setSearchFalcuty(v.target.value)}></input>
                        </div>
                    </div>
                    <div className='row col-md-12 col-sm-12 p-2'>
                        <div class="col-md-7 col-sm-7">
                            <DatePicker style={{padding: '4px', width:'100%'}} selected={startDate} onChange={date => setStartDate(date)} />
                        </div>
                        <div class="col-md-3 col-sm-3">

                        </div>
                        <div class="col-md-2 col-sm-2">
                            
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