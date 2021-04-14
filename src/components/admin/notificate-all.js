import React, {useState} from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NotiPage = () => {
    const [searchNotiTitle, setSearchNotiTitle] = useState('')
    const [searchNotiContent, setSearchNotiContent] = useState('')
    const [startDate, setStartDate] = useState(new Date());

    return(
        <div style={{justifyContent:'center'}}>
            <div style={{width:'90%', color:'gray', backgroundColor:'white'}}>
            NOTIFICATON
            </div>
            <div style={{width:'85%', backgroundColor:'white', margin: '5px', padding:'5px'}}>
                <div className='noti-filter'>
                    <div className='row col-md-8 col-sm-8'>
                        <input className='col-md-3 col-sm-3' placeholder='Search by notificate tittle' value={this.state.searchNotiTitle} onChange={v => setSearchNotiTitle(v.target.value)} ></input>
                        <input className='col-md-3 col-sm-3' placeholder='Search by notificate content' value={this.state.searchNotiContent} onChange={v => setSearchNotiContent(v.target.value)}></input>
                        <div class="dropdown col-md-2 col-sm-2">
                            
                        </div>
                    <div className='row col-md-8 col-sm-8'>
                        <div className='col-md-4 col-sm-4'>
                            <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                        </div>
                        <div className='col-md-2 col-sm-2'>
                            
                        </div>
                        <div className='col-md-2 col-sm-2'>
                            
                        </div>
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