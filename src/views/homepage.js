import React, {useState, useEffect} from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useRouteMatch,
    useHistory,
    Link,    
} from 'react-router-dom'
import {useAlert} from 'react-alert'

import Sidebar from "react-sidebar";
import NavBar from '../components/navbar.component'
import SideBar from "../components/sidebar.component"
import Newfeed from '../components/childviews/newfeed.child'
import NotiPage from '../components/childviews/notification.child'
import CreateNoti from '../components/childviews/create-notification.child'
import CreateAccountPage from '../components/childviews/create-account.child'
import PersonalPage from '../components/childviews/personal-page.child'
import useWindowDimensions from '../components/useWindowDimensions'
import axios from 'axios'
import {connect} from 'react-redux';
import {LOGOUT} from '../constants/index'
import {
    Avatar, 
    } from 'antd';
import { FaHome, FaUserPlus } from "react-icons/fa";
import { RiNotificationBadgeFill, RiNotificationBadgeLine } from "react-icons/ri";
import NotiReader from '../components/childviews/notification-reader.child'
import AccManagerPage from '../components/childviews/account-manager.child'

const Homepage = (props) => {    
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userData, setUserData] = useState()

    const [avatar, setAvatar] = useState('')
    const [username, setUsername] = useState('')

    const [route, setRoute] = useState(null)
    const alert = useAlert()

    const {width, height} = useWindowDimensions()

    let history = useHistory();
    let { path, url } = useRouteMatch();    

    useEffect( () => {
        console.log('called')
        getCurrentUserData()          
    }, [props.token])    

    function setCompRoute(role){
        if(role === 'admin') {
            setRoute([
                {
                    name: 'Homepage',
                    route: url,
                    icon: <FaHome className='mb-1' size="22px" color='gray'/>
                },
                {
                    name: 'Notification',
                    route: `${url}/notification`,
                    icon: <RiNotificationBadgeFill className='mb-1' size="22px" color='gray'/>,
                },
                {
                    name: 'Post notificate',
                    route: `${url}/postnotificate`,
                    icon: <RiNotificationBadgeLine className='mb-1' size="22px" color='gray'/>,
                },
                {
                    name: 'Create account',
                    route: `${url}/createaccount`,
                    icon: <FaUserPlus className='mb-1' size="22px" color='gray'/>,
                },        
            ])
        }
        else if(role === 'user') {
            setRoute([
                {
                    name: 'Homepage',
                    route: url,
                    icon: <FaHome className='mb-1' size="22px" color='gray'/>
                },
                {
                    name: 'Notification',
                    route: `${url}/notification`,
                    icon: <RiNotificationBadgeFill className='mb-1' size="22px" color='gray'/>,
                },
                {
                    name: 'Post notificate',
                    route: `${url}/postnotificate`,
                    icon: <RiNotificationBadgeLine className='mb-1' size="22px" color='gray'/>,
                },                  
            ])
        }
        else {
            setRoute([
                {
                    name: 'Homepage',
                    route: url,
                    icon: <FaHome className='mb-1' size="22px" color='gray'/>
                },
                {
                    name: 'Notification',
                    route: `${url}/notification`,
                    icon: <RiNotificationBadgeFill className='mb-1' size="22px" color='gray'/>,
                }                    
            ])
        }
    }

    function getCurrentUserData(){
        axios.get(`${process.env.REACT_APP_IP}/account/current`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {                    
            if(res.data.code === 0){                                
                setUserData(res.data.data)
                setCompRoute(res.data.data.role)
                setAvatar(res.data.data.avatar)
                setUsername(res.data.data.user_name)                

                if(res.data.data.faculty.length < 1 && res.data.data.role === 'student'){
                    alert.show('Your account is not registed', {
                        type:'error'
                    })
                    setTimeout(() => {
                        history.push('/register')
                    }, 3000)                    
                }
            }
        })
        .catch( e => {
            console.error(e)            
        })
    }

    function onSetSidebarOpen(open) {
        setSidebarOpen(open)
    }
 
    async function logOutHandle(){
        await props.logOut()
        history.push('/login') 
    }

        return(            
                //Mobile render
                <Router>
                <div className="containerr">
                    <div>
                        <NavBar
                            sideBarHandle = {() => onSetSidebarOpen(!sidebarOpen)}                            
                            logOutHandle={logOutHandle}                            
                            usersession={
                            <Link to={`${url}/personalwall/${(userData) && userData._id}`}>
                                <div className='userwall row mr-1' onClick={props.userwallredirect}>
                                    <Avatar src={avatar} alt="avatar" ></Avatar>
                                    <div className="align-self-center pl-2 pr-3 text-primary" style={{color: 'black', fontWeight:'bold'}}>{username}</div>
                                </div>
                            </Link>}
                            user_role={userData?userData.role:''}
                        ></NavBar>
                    </div>                    
                    <div className='row'>
                    {
                        width < 768?(
                            <div>
                            <Sidebar
                                sidebar={
                                    <SideBar                                    
                                        avatar={userData?userData.avatar:''}
                                        username={userData?userData.user:''}
                                        sidebarchild={(route) && route.map((value, index)=> (                                            
                                            <div key={index}>
                                                <Link to={value.route}><button className="sidebar-btn pl-2">{value.icon}<span className='ml-2' style={{color:'gray', fontSize:'17px'}}>{value.name}</span></button></Link>                                                        
                                            </div>                                         
                                        ))}
                                    ></SideBar>}
                                    open={sidebarOpen}
                                    onSetOpen={onSetSidebarOpen}
                                    styles={{ sidebar: { background: "white", width: "180px" ,position: 'fixed', top: 0}}}/>                    
                            </div>
                        ):(
                            <div className='col-3'>
                                <SideBar
                                    avatar={userData?userData.avatar:''}
                                    username={userData?userData.user:''}
                                    sidebarchild={(route) && route.map((value, index)=> (
                                        <div key={index}>
                                            <Link to={value.route}><button className="sidebar-btn pl-2">{value.icon}<span className='ml-2' style={{color:'gray', fontSize:'17px'}}>{value.name}</span></button></Link>                                                        
                                        </div>                                                                                                         
                                    ))}                                                                            
                                ></SideBar>
                            </div>
                        )
                    }
                    <div className={width < 768?'home-body col-12':'home-body col-9'}>                
                        <Switch>                            
                            <Route
                                path={`${path}`}                    
                                exact={true}             
                            >
                                <Newfeed notilink={<Link to={`${url}/notification`}>See all</Link>}></Newfeed>
                            </Route>                                                
                            <Route
                                path={`${path}/notification`}                                    
                                component={NotiPage}
                                exact
                            />
                            <Route
                                path={`${path}/notification/:id`}
                                component={NotiReader}                                                              
                            />
                            <Route
                                path={`${path}/personalwall/:id`}
                                component={PersonalPage}
                            />
                            {
                                (userData && userData.role === 'user') && (
                                    <Route
                                        path={`${path}/postnotificate`}                                    
                                        component={CreateNoti}
                                    />
                                )
                            }
                            {   
                                (userData && userData.role === 'admin') && (
                                    <>
                                    <Route
                                        path={`${path}/postnotificate`}                                    
                                        component={CreateNoti}
                                    />
                                    <Route
                                        path={`${path}/createaccount`}                               
                                        component={CreateAccountPage}
                                        exact
                                    />
                                    <Route
                                        path={`${path}/createaccount/accountmanager`}                               
                                        component={AccManagerPage}
                                    />                                
                                    </>
                                )                             
                            }                                                                                       
                        </Switch>                    
                    </div>
                    </div>
                </div>
                </Router>                         
        )        
}

function mapStateToProps(state) {
    return {
        token: state.token
    };
}

function mapDispatchToProps(dispatch) {
    return {
      logOut: () => dispatch({type: LOGOUT}),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)