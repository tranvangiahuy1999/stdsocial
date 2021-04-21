import React, {useState, useEffect} from 'react'
import { BiNotification } from "react-icons/bi";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useLocation
} from 'react-router-dom'
import NotiCard from './notificatecard.component'
import axios from 'axios'

const token = localStorage.getItem('token')

const NotiZone = (props) => {
    const [notiData, setNotiData] = useState(null)

    useEffect(async ()=> {
        const res = await axios.get(`http://${process.env.REACT_APP_IP}:3000/notification/page/${1}`,{
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        })
        .catch()

        if(res) {
            if(res.status === 200){
                await setNotiData(res.data.data)    
                console.log(notiData)            
            }
        }
    }, [])

    function notiClickHandle(){

    }

    return(
        <div className='notizone-container' style={{height: '42px', margin:'5px'}}>
            <div className='notizone-header p-1 bg-white'>
                <h5 style={{textAlign:'center'}}> <BiNotification color='black' size='22px'></BiNotification> <Link style={{color:'black'}}>Notificate</Link></h5>
            </div>
            <div className='notizone-body mt-1 bg-white'>
                {
                    notiData && notiData.length > 0?
                    notiData.map((value, index) => (
                        <NotiCard
                            key={index} //id noti
                            borderStyle={index%2===0?'3px solid rgba(69,190,235,255)':'3px solid gray'}
                            backgroundStyle={index%2===0?'rgba(201,231,254,255)':'white'}                    
                            notiClickHandle={notiClickHandle}
                            falcutyname={value.role}
                            date={value.date.split('T')[0]}
                            title={value.title}
                            subtitle={value.description}
                            >                                
                        </NotiCard>
                    )):<div></div>
                }
            </div>
        </div>
    )
}

export default NotiZone