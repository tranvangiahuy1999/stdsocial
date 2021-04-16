import React, {useState, useEffect} from 'react'
import StatusPost from '../statuspost.component'
import StatusCard from '../statuscard.component'
import NotiZone from '../notificate-zone.component'

//Fake data import
import {homepageResTrue, loginResTrue} from '../../data/data'

const Newfeed = (props) =>  {
    const [newfeedData, setNewfeedData] = useState(null)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        //check status code
        setUserData(loginResTrue)
        setNewfeedData(homepageResTrue)
    })

    function cmtHandle(){
        console.log('cmt')
        //post {statusId, token} retrive cmt of status
    }

    function likeHandle(){
        console.log('like')
        //like handle
    }
    return(
        <div className='hp-container col-md-15 col-sm-15 row'>
            <div className='hp-left col-md-3 col-sm-0'></div>
            <div className='hp-post col-md-6 col-sm-8 p-0'>
                <StatusPost                
                    avatar={userData?userData.data[0].avatar:''}
                    username={userData?userData.data[0].username:''}
                    ></StatusPost>                    
                <div className='post-data col-md-12 col-sm-12'>
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
                        :<div style={{height:'600px', paddingTop:'4px'}}>
                            <div style={{color:'gray', textAlign:'center'}}>No content to show</div>
                        </div>}
                </div>
            </div>
            <div className='hp-noti col-md-3 col-sm-4' style={{justifyContent:'center'}}>
                <NotiZone></NotiZone>
            </div>
        </div>
    )
}

export default Newfeed