import React, {useState, useEffect} from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useRouteMatch,
    useHistory,
    Link
} from 'react-router-dom'

import Sidebar from "react-sidebar";
import NavBar from '../components/navbar.component'
import SideBar from "../components/sidebar.component"
import Newfeed from '../components/childviews/newfeed.child'
import NotiPage from '../components/childviews/notification.child'
import CreateNoti from '../components/childviews/create-notification.child'
import CreateAccountPage from '../components/childviews/create-account.child'
import useWindowDimensions from '../components/useWindowDimensions'
import axios from 'axios'
import {connect} from 'react-redux';
import {LOGOUT} from '../constants/index'
import { FaHome, FaUserPlus } from "react-icons/fa";
import { RiNotificationBadgeFill, RiNotificationBadgeLine } from "react-icons/ri";

const Homepage = (props) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userData, setUserData] = useState()

    const {width, height} = useWindowDimensions()

    let history = useHistory();
    let { path, url } = useRouteMatch();

    const routeComponent = [
        {
            name: 'Homepage',
            route: url,
            icon: <FaHome size="20px" color='gray'/>
        },
        {
            name: 'Notification',
            route: `${url}/notification`,
            icon: <RiNotificationBadgeFill size="20px" color='gray'/>,
        },
        {
            name: 'Post notificate',
            route: `${url}/postnotificate`,
            icon: <RiNotificationBadgeLine size="20px" color='gray'/>,
        },
        {
            name: 'Create account',
            route: `${url}/createaccount`,
            icon: <FaUserPlus size="20px" color='gray'/>,
        }
    ]

    useEffect(async () => {
        console.log('token: ',props.token)

        await axios.get(`http://${process.env.REACT_APP_IP}/account/current`, {
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
    }, [])

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
                            avatar={userData?userData.avatar:''}
                            username={userData?userData.user:''}
                            logOutHandle={logOutHandle}
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
                                        sidebarchild={routeComponent.map((value, index)=> (                                            
                                            <div className="p-2 sidebar-child">
                                                {value.icon}
                                                <Link className="link pl-2" style={{color:'gray'}} to={value.route}>{value.name}</Link>
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
                                    sidebarchild={routeComponent.map((value, index)=> (                                            
                                        <div className="p-2 sidebar-child">
                                            {value.icon}
                                            <Link className="link pl-2" style={{color:'gray'}} to={value.route}>{value.name}</Link>
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
                                component={Newfeed}
                            />                                                                
                            <Route
                                path={`${path}/notification`}                                    
                                component={NotiPage}
                            />
                            <Route
                                path={`${path}/postnotificate`}                                    
                                component={CreateNoti}
                            />
                            <Route
                                path={`${path}/createaccount`}                                    
                                component={CreateAccountPage}
                            />                            
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