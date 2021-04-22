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
import NotiPage from '../components/childviews/notificate.child'
import CreateNoti from '../components/childviews/create-noti.child'
import CreateAccountPage from '../components/childviews/create-account.child'
import useWindowDimensions from '../components/useWindowDimensions'
import Modal from 'react-modal';
import axios from 'axios'

const token = localStorage.getItem('token')

const Homepage = (props) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userData, setUserData] = useState()
    const [userrole, setUserRole] = useState()

    const [chooseSideBar, setChooseSideBar] = useState(0)
    const {width, height} = useWindowDimensions()

    let history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(async () => {
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

    }, [])

    function onSetSidebarOpen(open) {
        setSidebarOpen(open)
    }
 
    async function logOutHandle(){
        await localStorage.setItem('token','')
        history.push('/login')
    }    

        return(
                //Mobile render
                <Router>
                <div className="containerr">
                    <NavBar
                        sideBarHandle = {() => onSetSidebarOpen(!sidebarOpen)}
                        avatar={''}
                        username={userData?userData.user:''}
                        logOutHandle={logOutHandle}
                    ></NavBar>
                    <div className={width < 768?'':'row'}>
                    {
                        width < 768?(
                            <div>
                            <Sidebar
                                sidebar={
                                    <SideBar
                                        avatar={''}
                                        username={userData?userData.user:''}
                                        homeLink={<Link className="link pl-2" style={{color:width>768?'black':'white'}} onClick={() => setChooseSideBar(0)} to={url}>Homepage</Link>}
                                        notiLink={<Link className="link pl-2" style={{color:width>768?'black':'white'}} onClick={() => setChooseSideBar(1)} to={`${url}/notification`}>Notification</Link>}
                                        notiWrite={<Link className="link pl-2" style={{color:width>768?'black':'white'}} onClick={() => setChooseSideBar(2)} to={`${url}/postnotification`}>Post notification</Link>}
                                        createAccLink={<Link className="link pl-2" style={{color:width>768?'black':'white'}} onClick={() => setChooseSideBar(3)} to={`${url}/createaccount`}>Create account</Link>}
                                        choose={chooseSideBar}
                                    ></SideBar>}
                                    open={sidebarOpen}
                                    onSetOpen={onSetSidebarOpen}
                                    styles={{ sidebar: { background: "rgba(51,72,93,255)", width: "180px" ,position: 'fixed', top: 0}}}/>                    
                            </div>
                        ):(
                                <div className='col-3'>
                                <SideBar
                                        avatar={''}
                                        username={userData?userData.user:''}
                                        homeLink={<Link className="link pl-2" style={{color:width>768?'black':'white'}} onClick={() => setChooseSideBar(0)} to={url}>Homepage</Link>}
                                        notiLink={<Link className="link pl-2" style={{color:width>768?'black':'white'}} onClick={() => setChooseSideBar(1)} to={`${url}/notification`}>Notification</Link>}
                                        notiWrite={<Link className="link pl-2" style={{color:width>768?'black':'white'}} onClick={() => setChooseSideBar(2)} to={`${url}/postnotification`}>Post notification</Link>}
                                        createAccLink={<Link className="link pl-2" style={{color:width>768?'black':'white'}} onClick={() => setChooseSideBar(3)} to={`${url}/createaccount`}>Create account</Link>}
                                        choose={chooseSideBar}
                                    ></SideBar>
                                </div>
                        )
                    }
                    <div className={width < 768?'':'col-9'} style={{justifyContent:'center', padding:'15px', paddingTop:'48px'}}>                
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
                                path={`${path}/postnotification`}                            
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

export default Homepage