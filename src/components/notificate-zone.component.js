import React, {useState, useEffect} from 'react'
import {
    BrowserRouter as Router,    
    Link,    
} from 'react-router-dom'
import NotiCard from './notificatecard.component'
import axios from 'axios'
import {connect} from 'react-redux'

const NotiZone = (props) => {
    function notiClickHandle(){

    }

    return(
        <div className='notizone-container bg-white'>
            <div className='component-title'>
                <div className='title'><Link style={{color:'black'}}>NOTIFICATION</Link></div>
            </div>
            <div className='notizone-body'>            
                {
                    props.notiData && props.notiData.length > 0?
                    props.notiData.map((value, index) => (
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