import React, { useState, useEffect } from 'react'
import {
    useParams
} from "react-router-dom";
import axiosInstance from '../../api/service';
import { useAlert } from 'react-alert'

const NotiReader = (props) => {
    let { id } = useParams()

    const [title, setTitle] = useState('')
    const [faculty, setFalcuty] = useState('')
    const [user, setUser] = useState('')
    const [date, setDate] = useState('')
    const [desc, setDesc] = useState('')
    const [content, setContent] = useState('')

    const alert = useAlert()

    useEffect(() => {
        window.scrollTo(0, 0)
        axiosInstance.get(`/notification/${id}`)
            .then(res => {
                if (res.data.code === 0) {
                    setTitle(res.data.data.title)
                    setFalcuty(res.data.data.role)
                    setUser(res.data.data.user)
                    setDate(res.data.data.date.split('T')[0])
                    setDesc(res.data.data.description)
                    setContent(res.data.data.content)
                } else {
                    alert.show(`Notification doens't exist`)
                }
            })
            .catch(e => {
                console.error(e)
            })

    }, [])

    return (
        <div className='child-page'>
            <div className='child-body'>
                <h3 className='reading-title'>{title}</h3>
                <div className='reading-date'>{faculty}/<span>{date}</span></div>
                <div className='reading-content' dangerouslySetInnerHTML={{ __html: content }}>
                </div>
            </div>
        </div>
    )
}

export default NotiReader;