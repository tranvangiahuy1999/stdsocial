import React, {useState, useEffect} from 'react'
import StatusPost from '../statuspost.component'
import StatusCard from '../statuscard.component'
import NotiZone from '../notificate-zone.component'
import axios from 'axios'
// import socketIOClient from "socket.io-client";

//Fake data import
import {homepageResTrue, loginResTrue} from '../../data/data'

const token = localStorage.getItem('token')

const Newfeed = (props) =>  {
    const [newfeedData, setNewfeedData] = useState(null)
    const [userData, setUserData] = useState(null)

    useEffect(async () => {
        //check status code
        const res = await axios.get(`http://${process.env.REACT_APP_IP}:3000/account/current`, {
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        }).catch()
        
        if(res){
            if(res.status === 200){
                if(res.data.code === 0){
                    await setUserData(res.data.data)
                }
            }            
        }

        setNewfeedData(homepageResTrue)
    }, [])

    function cmtHandle(){
        console.log('cmt')
        //post {statusId, token} retrive cmt of status
    }

    function likeHandle(){
        console.log('like')
        //like handle
    }
    
    return(
        <div className='col-15 row'>
            <div className='col-8 p-0'>
                <StatusPost
                    avatar={''}
                    username={userData?userData.user:''}
                    // openModal={}
                    ></StatusPost>                    
                <div className='post-data col-12'>
                    {(newfeedData && newfeedData.data.length > 0)?
                        newfeedData.data.map((value, index) => (
                        <StatusCard
                            key={value._id}
                            avatar={value.avatar}
                            username={value.name}
                            date={value.date}
                            imgcontent= {value.imgcontenturl}
                            textcontent={value.textcontent}
                            like={value.like}
                            cmt={value.cmt}
                            likeHandle={likeHandle}
                            cmtHandle={cmtHandle}
                        ></StatusCard>))
                        :<div style={{paddingTop:'4px'}}>
                            <div style={{color:'gray', textAlign:'center'}}>No content to show</div>
                        </div>}
                </div>
            </div>
            <div className='col-4' style={{justifyContent:'center'}}>
                <NotiZone></NotiZone>
            </div>
        </div>
    )
}

export default Newfeed