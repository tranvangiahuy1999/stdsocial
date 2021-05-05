import React, {useState, useEffect} from 'react'
import StatusPost from '../statuspost.component'
import StatusCard from '../statuscard.component'
import NotiZone from '../notificate-zone.component'
import axios from 'axios'
import useWindowDimensions from '../useWindowDimensions'
import {connect} from 'react-redux'
import { useAlert } from 'react-alert'
import { io } from "socket.io-client";
// import socketIOClient from "socket.io-client";

const Newfeed = (props) =>  {
    const [newfeedData, setNewfeedData] = useState(null)
    const [userData, setUserData] = useState(null) 
    const [notiData, setNotiData] = useState(null)   

    const {width, height} = useWindowDimensions()
    var alert = useAlert()

    useEffect(async () => {       
        const socket = io.connect(`http://${process.env.REACT_APP_IP}`, { transports: ["websocket"], withCredentials: true, reconnection: false});  
        socket.on('connect', function() {
            console.log('Connected')   
            socket.once('new_notification', (data) => {
                if(data && userData && notiData){     
                    if(userData.faculty.includes(data.role)){
                        alert.show(`You have new notification from ${data.role}`)
                        setNotiData([data].concat(notiData))
                    }                                   
                }
            })
        })

        await getNotiData()
        await getUserData()
        await getNewfeed()
    }, [])

    async function getNotiData(){
        await axios.get(`http://${process.env.REACT_APP_IP}/notification/page/${1}`,{
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
        await axios.get(`http://${process.env.REACT_APP_IP}/account/current`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(async res => {
            console.log('user', res)
            if(res.data.code === 0){
                await setUserData(res.data.data)                
            }
        })
        .catch(e => {
            console.error(e)
        })
    }

    async function getNewfeed(){
        await axios.get(`http://${process.env.REACT_APP_IP}/newfeed`, {
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
    
    function cmtHandle(id){        
        //post {statusId, token} retrive cmt of status
    }

    function likeHandle(id){        
        axios.put(`http://${process.env.REACT_APP_IP}/newfeed/like/${id}`,{
            headers:{
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then((res) => {
            if(res.data.code === 0){
                console.log(res)
            }
        })
        .catch(e => {
            console.log(e)
        })
    }
    
    return(
        <div className='col-15 row newfeed-page'>
            <div className={(width < 768)?'col-12 p-0':'col-8 p-0'}>
                <StatusPost
                    avatar={userData?userData.avatar:''}
                    username={userData?userData.user_name:''}
                    posted={getNewfeed}               
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
                            like={value.likecount}
                            cmt={value.commentcount}                            
                            likeHandle={() => likeHandle(value._id)}
                            cmtHandle={() => cmtHandle(value._id)}
                            commentlist={value.commentlist}
                            postid={value._id}
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