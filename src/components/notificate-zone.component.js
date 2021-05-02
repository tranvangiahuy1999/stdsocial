import React, {useState, useEffect} from 'react'
import {
    BrowserRouter as Router,    
    Link,    
} from 'react-router-dom'
import NotiCard from './notificatecard.component'
import axios from 'axios'
import {connect} from 'react-redux'

const NotiZone = (props) => {
    const [notiData, setNotiData] = useState(null)

    useEffect(async ()=> {
        await axios.get(`http://${process.env.REACT_APP_IP}/notification/page/${1}`,{
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(async res => {
            if(res.data.code === 0){
                await setNotiData(res.data.data)                
            }
        })
        .catch(e => {
            console.error(e)
        })
    }, [])

    function notiClickHandle(){

    }

    return(
        <div className='notizone-container bg-white'>
            <div className='component-title'>
                <div className='title'><Link style={{color:'black'}}>NOTIFICATION</Link></div>
            </div>
            <div className='notizone-body'>            
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
                    )):<div className='empty-data'>
                            <div className='empty-text'>No content to show</div>
                        </div>
                }
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        token: state.token
    };
}

export default connect(mapStateToProps)(NotiZone)