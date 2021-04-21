import React, {useState, useEffect} from 'react'
import { GrFormNext } from "react-icons/gr";
const NotiReader = (props) => {
    return(
        <div className='child-page'>
            <h5 className='child-header'>
                <span className='reading-link' onClick={props.back}>NOTIFICATON <GrFormNext color='blue' size='20px'></GrFormNext></span> NOTIFICATON DETAIL
            </h5>
            <div className='child-body' style={{backgroundColor:'white', margin: '2px', padding:'16px'}}>
                <h3 className='reading-title'>[{props.title}]</h3>
                <div className='reading-date'>{props.falcuty}/<span>{props.date}</span></div>
                <div className='reading-content'>
                    {props.content}
                </div>
            </div>
        </div>
    )
}

export default NotiReader