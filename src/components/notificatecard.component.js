import React, {useState, useEffect} from 'react'
import { RiDeleteBin2Line } from "react-icons/ri";
import axios from 'axios'
import { connect } from 'react-redux'

const NotiCard = (props) => {
    const [userData, getUserData] = useState()

    useEffect(() => {
        getCurrentUser()
    }, [])

    function getCurrentUser() {
        axios.get(`https://${process.env.REACT_APP_IP}/account/current`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {            
            if(res.data.code === 0){
                getUserData(res.data.data)
            }
        })
        .catch(e => {
            console.error(e)
        })
    }

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
                    <div numberOfLines={1} className='noticard-title' style={{color:'black', fontWeight:'bold', fontSize:'16px'}}>
                        {props.title} {
                            (userData && (userData.role === 'admin' || (userData.role === 'user' && userData.faculty.some(props.falcutyname)))) && (
                                <span><RiDeleteBin2Line className='ml-1 clickable-icon' size='20px' color='gray'></RiDeleteBin2Line></span>
                            )
                        }                  
                    </div>
                    <div className='noticard-content' style={{color:'gray', fontSize:'15px'}}>
                        {props.subtitle}
                    </div>
                    {props.notiLink}
                </div>                                            
        </div>
    )
}

function mapStateToProps(state) {
    return {
        token: state.token
    };
}

export default connect(mapStateToProps)(NotiCard)