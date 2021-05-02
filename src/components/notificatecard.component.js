import React, {useState, useEffect} from 'react'

const NotiCard = (props) => {
    return(
        <div className='noti-card m-1' style={{borderLeft: props.borderStyle, backgroundColor: props.backgroundStyle}}>
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
                {props.notiLink}
            </div>
        </div>
    )
}

export default NotiCard