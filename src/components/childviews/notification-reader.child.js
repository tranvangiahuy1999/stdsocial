import React, {useState, useEffect} from 'react'
import {    
    useParams
  } from "react-router-dom";

const NotiReader = (props) => {
    let { id } = useParams()

    const [title, setTitle] = useState('')
    const [faculty, setFalcuty] = useState('')
    const [user, setUser] = useState('')
    const [date, setDate] = useState('')
    const [desc, setDesc] = useState('')
    const [content, setContent] = useState('')

    useEffect(() => {

    }, [])

    return(        
        <div className='child-body' style={{backgroundColor:'white', margin: '2px', padding:'16px'}}>
            <h3 className='reading-title'>{title}</h3>
            <div className='reading-date'>{faculty}/<span>{date}</span></div>
            <div>{user}</div>
            <div className='reading-content'>
                <div>{desc}</div>
                {content}
            </div>
        </div>        
    )
}

export default NotiReader