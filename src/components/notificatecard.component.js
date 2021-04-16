import React, {useState, useEffect} from 'react'

const NotiCard = (props) => {
    return(
        <div className='noti-card' style={{borderLeft: props.borderStyle, backgroundColor: props.backgroundStyle , padding:'4px'}} onClick={props.notiClickHandle}>
            <div className='noticard-header row pl-3'>
                <div style={{color:'gray', fontSize:'14px'}}>
                    [{props.falcutyname}]
                </div>
                <div style={{color:'gray', fontSize:'14px', paddingLeft:'5px'}}>
                    {props.date}
                </div>
            </div>
            <div className='noticard-body'>
                <div className='noticard-title' style={{color:'black', fontWeight:'bold', fontSize:'16px'}}>
                    {props.title}                    
                </div>
                <div className='noticard-content' style={{color:'gray', fontSize:'15px'}}>
                    {props.subtitle}                    
                </div>
            </div>
        </div>
    )
}

export default NotiCard