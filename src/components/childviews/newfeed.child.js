import React, {useState, useEffect} from 'react'
import StatusPost from '../statuspost.component'
import StatusCard from '../statuscard.component'
import NotiZone from '../notificate-zone.component'
import axios from 'axios'
import useWindowDimensions from '../useWindowDimensions'
import {connect} from 'react-redux'
import { useAlert } from 'react-alert'
import { io } from "socket.io-client";
import { notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

const Newfeed = (props) =>  {
    const [newfeedData, setNewfeedData] = useState(null)
    const [userData, setUserData] = useState(null) 
    const [notiData, setNotiData] = useState(null)
    const [page, setPage] = useState(1)    

    const {width, height} = useWindowDimensions()
    var alert = useAlert()

    useEffect(async () => {       
        const socket = io.connect(`https://${process.env.REACT_APP_IP}`, { transports: ["websocket"], withCredentials: true});  
        socket.on('connect', function() {
            console.log('Connected')
            socket.on('new_notification', (data) => {                
                if(data && userData && notiData){
                    if(userData.faculty.includes(data.role)){                        
                        openNotification(data.role)                        
                        setNotiData([data].concat(notiData))
                    }                                   
                }
            })
        })
        await getNotiData()
        await getUserData()
        await getNewfeed(1)     
        // showModal()   
    }, [])

    const openNotification = (role) => {        
        notification.open({
          message: 'Notification',
          description: `You have new notification from ${role}`,
          top: '70px',
          icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
      };      

    async function getNotiData(){        
        await axios.get(`https://${process.env.REACT_APP_IP}/notification/page/${1}`,{
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(async res => {
            console.log('noti',res)
            if(res.data.code === 0){
                await setNotiData(res.data.data)                
            }
        })
        .catch(e => {
            console.error(e)
        })
    }

    async function getUserData(){
        await axios.get(`https://${process.env.REACT_APP_IP}/account/current`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(async res => {            
            if(res.data.code === 0){
                await setUserData(res.data.data)                
            }
        })
        .catch(e => {
            console.error(e)
        })
    }

    async function getNewfeed(page){
        await axios.get(`https://${process.env.REACT_APP_IP}/newfeed/${page}`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(async res => {
            console.log('newsfeed', res)
            if(res.data.code === 0){
                await setNewfeedData(res.data.data)
            }
        })
        .catch(e => {
            console.error(e)
        })
    }        
    
    function newPostHandle(post) {
        setNewfeedData([post].concat(newfeedData))
    }
    
    return(
        <div className='col-15 row newfeed-page'>            
            <div className={(width < 768)?'col-12 p-0':'col-8 p-0'}>            
                <StatusPost
                    avatar={userData?userData.avatar:''}
                    username={userData?userData.user_name:''}
                    posted={newPostHandle}           
                    ></StatusPost>
                <div className='post-data'>
                    {(newfeedData && newfeedData.length > 0)?                        
                        newfeedData.map((value, index) => (                                       
                        <StatusCard
                            key={index}
                            avatar={value.user.avatar}
                            username={value.user.user_name}
                            date={value.date.split('T')[0]}
                            textcontent={value.content}
                            linkyoutube={value.linkyoutube}
                            imgcontent= {value.image}
                            likecount={value.likecount}
                            commentcount={value.commentcount}                            
                            likelist={value.likelist} 
                            commentlist={value.commentlist}                          
                            user_id={userData?userData.id:''}
                            user_post_id={value.user.user_id}
                            post_id={value._id}             
                            token={props.token}
                            alertshow={()=> {
                                alert.show('Deleted success!', {
                                    type:'success'
                            })}}
                            role={(userData) && userData.role}                                       
                        ></StatusCard>))
                        :<div className='empty-data'>
                            <div className='empty-text'>No content to show</div>
                        </div>}
                </div>
            </div>
            {
                (width < 768)?(
                    <div/>
                ):(
                    <div className='col-4' style={{justifyContent:'center', alignContent:'center'}}>
                        <NotiZone notiData={notiData}></NotiZone>
                    </div>
                )
            }
        </div>
    )
}

function mapStateToProps(state){
    return{
        token: state.token
    }
}

export default connect(mapStateToProps)(Newfeed)