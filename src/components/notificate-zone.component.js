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

//import fake data
import {notiRes} from '../data/data'

const NotiZone = (props) => {
    const [notiData, setNotiData] = useState(null)

    useEffect(()=> {
        //check status code
        setNotiData(notiRes)
    })

    function notiClickHandle(){

    }

    return(
        <div className='notizone-container' style={{height: '42px', margin:'5px'}}>
            <div className='notizone-header p-1 bg-white'>
                <h5 style={{textAlign:'center'}}> <BiNotification color='black' size='22px'></BiNotification> <Link style={{color:'black'}}>Notificate</Link></h5>
            </div>
            <div className='notizone-body mt-1 bg-white'>
                {
                    notiData && notiData.data.length > 0?
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
                        </NotiCard>
                    )):<div></div>
                }
            </div>
        </div>
    )
}

export default NotiZone