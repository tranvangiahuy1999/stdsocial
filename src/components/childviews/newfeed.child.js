import React, {useState, useEffect} from 'react'
import StatusPost from '../statuspost.component'
import StatusCard from '../statuscard.component'
import NotiZone from '../notificate-zone.component'
import axios from 'axios'
import useWindowDimensions from '../useWindowDimensions'
import {connect} from 'react-redux'
import { useAlert } from 'react-alert'
import { io } from "socket.io-client";
import { notification, Spin, Space } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router'

const Newfeed = (props) =>  {
    const [userData, setUserData] = useState() 
    const [newfeedData, setNewfeedData] = useState([])
    const [notiData, setNotiData] = useState([])

    const [avatar, setAvatar] = useState('')
    const [username, setUsername] = useState('')

    const [loading, setLoading] = useState(true)
    const [loadingNoti, setLoadingNoti] = useState(true)
    
    const [loadingNewfeed, setLoadingNewfeed] = useState(false)
    const [hasMore, setHasMore] = useState(true) 

    const {width, height} = useWindowDimensions()
    const history = useHistory()
    var alert = useAlert()
    var notidata = undefined, userdata = undefined, newfeeddata = [], count = 1

    useEffect(() => {                
        getNotiData()
        getUserData()
        getNewfeed()        
        
        window.addEventListener('scroll', debounce(handleInfiniteOnLoad, 1000))
        return () => window.removeEventListener('scroll', debounce(handleInfiniteOnLoad, 1000));
    }, [])

    useEffect(() => {
        const socket = io.connect(`${process.env.REACT_APP_IP}`, { transports: ["websocket"], withCredentials: true});        
        socket.on('new_notification', (data) => {                 
            if(userdata && notidata && userdata.faculty.includes(data.role) && userdata.role === 'student'){
                popNoti(data)
            }
        })
        socket.on('new_comment', (data) => {
            newCommentHandler(data)
        })
        return () => {
            socket.off('new_notification');
            socket.off("new_comment");
        }
    }, [])

    useEffect(() => {
        getUserData()
    }, [props.token])

    const openNotification = (role) => {
        notification.open({
          message: 'Notification',
          description: `You have new notification from ${role}`,
          top: '70px',
          icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
    };

    const debounce = (func, delay) => {
        let inDebounce;
        return function() {
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => {
        func.apply(this, arguments);
            }, delay);
        }
    }

    function newCommentHandler(data){                      
        if(newfeeddata.length > 0){                   
            newfeeddata.some((item, index) => {                                
                if(item._id === data.data.id_post){
                    newfeeddata[index].commentlist.push(data.data.cmt_data[0])                    
                    setNewfeedData(newfeeddata)                    
                }
                return
            })
        }
    }

    function handleInfiniteOnLoad(){        
        if (document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 100 && !loadingNewfeed){
            setLoadingNewfeed(true)
            count += 1                       
            getNewfeed()        
        }
    }    

    function popNoti(data) {                              
        openNotification(data.role)
        setNotiData([data].concat(notidata))
    }

    function getNotiData() {        
        axios.get(`${process.env.REACT_APP_IP}/notification/page/${1}`,{
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {            
            if(res.data.code === 0){                
                notidata = res.data.data
                setNotiData(res.data.data)                
            }
            setLoadingNoti(false)
        })
        .catch(async e => {
            console.error(e)            
        })        
    }

    function getUserData(){
         axios.get(`${process.env.REACT_APP_IP}/account/current`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {                     
            if(res.data.code === 0){
                userdata = res.data.data                
                setAvatar(res.data.data.avatar)
                setUsername(res.data.data.user_name)        
                setUserData(res.data.data)
            }            
        })
        .catch( e => {
            console.error(e)           
        })
    }

    function getNewfeed(){
        console.log(count)    
        axios.get(`${process.env.REACT_APP_IP}/newfeed/${count}`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {
            console.log(res)              
            if(res.data.code === 0){
                newfeeddata = newfeeddata.concat(res.data.data)
                setNewfeedData(newfeeddata)                    
            } else {
                setHasMore(false)
            }
            setLoading(false)
            setLoadingNewfeed(false)
        })
        .catch(e => {
            console.error(e)            
        })          
    }
    
    function newPostHandle(post) {
        setNewfeedData([post].concat(newfeedData))
    }
    
    function seeDetail(id) {
        history.push(`/home/notification/${id}`)
    }
    
    return(       
        <div className='col-15 row newfeed-page' id='ele'>                  
            <div className={(width < 768)?'col-12 p-0':'col-8 p-0'}>        
                <StatusPost
                    avatar={avatar}
                    username={username}
                    posted={newPostHandle}           
                    ></StatusPost>
                <div className='post-data'>
                    {
                        (loading)?(
                            <div style={{textAlign:'center', margin:'30px'}} >
                                <Space size="middle">
                                    <Spin size="large" />
                                </Space>
                            </div>
                        ):(
                            (newfeedData && newfeedData.length > 0)?(
                                newfeedData.map((value, index) => (                                       
                                    <StatusCard                                        
                                        directToWall={() => history.push(`/home/personalwall/${value.user._id}`)}
                                        key={value._id}                                        
                                        avatar={value.user.avatar}
                                        current_avatar={userData?userData.avatar:''}
                                        username={value.user.user_name}
                                        date={value.date.split('T')[0]}
                                        textcontent={value.content}
                                        linkyoutube={value.linkyoutube}
                                        imgcontent= {value.image}                                                        
                                        likelist={value.likelist}
                                        commentlist={value.commentlist}       
                                        user_id={userData?userData._id:''}
                                        user_post_id={value.user._id}
                                        post_id={value._id}    
                                        token={props.token}
                                        alertshow={()=> {
                                            alert.show('Deleted success!', {
                                                type:'success'
                                        })}}
                                        role={(userData) && userData.role}                                                                      
                                    ></StatusCard>))
                            ):(
                            <div className='empty-data'>
                                <div className='empty-text'>No content to show</div>
                            </div>)
                            
                        )                                                                                                                                                                   
                    }
                    {loadingNewfeed && hasMore && (
                        <div style={{textAlign:'center', margin:'30px'}} >
                        <Space size="middle">
                            <Spin />
                        </Space>
                    </div>
                    )}

                    {
                        !hasMore && (
                            <div className='empty-data'>
                                <div className='empty-text'>There are no posts left</div>
                            </div>
                        )
                    }                          
                </div>
            </div>
            {
                (width < 768)?(
                    <div/>
                ):(
                    <div className='col-4' style={{justifyContent:'center', alignContent:'center'}}>                          
                        <NotiZone notiData={notiData} loading={loadingNoti} notilink={props.notilink} seedetail={seeDetail}></NotiZone>
                    </div>
                )
            }                  
    </div>)
}

function mapStateToProps(state){
    return{
        token: state.token
    }
}

function mapDispatchToProps(dispatch) {
    return {        
        logOut: () => dispatch({type: 'LOGOUT'}),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Newfeed)